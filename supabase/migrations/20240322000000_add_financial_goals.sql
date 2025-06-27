-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create financial_goals table
CREATE TABLE IF NOT EXISTS financial_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12,2) DEFAULT 0.00 NOT NULL CHECK (current_amount >= 0),
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_dates CHECK (target_date >= start_date)
);

-- Create goal_contributions table to track contributions
CREATE TABLE IF NOT EXISTS goal_contributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    goal_id UUID REFERENCES financial_goals(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    contribution_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_account_id ON financial_goals(account_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_status ON financial_goals(status);
CREATE INDEX IF NOT EXISTS idx_financial_goals_created_at ON financial_goals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal_id ON goal_contributions(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_date ON goal_contributions(contribution_date DESC);

-- Enable Row Level Security
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for financial_goals
DROP POLICY IF EXISTS "Users can view their own goals" ON financial_goals;
CREATE POLICY "Users can view their own goals"
    ON financial_goals FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own goals" ON financial_goals;
CREATE POLICY "Users can create their own goals"
    ON financial_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON financial_goals;
CREATE POLICY "Users can update their own goals"
    ON financial_goals FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own goals" ON financial_goals;
CREATE POLICY "Users can delete their own goals"
    ON financial_goals FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for goal_contributions
DROP POLICY IF EXISTS "Users can view their own goal contributions" ON goal_contributions;
CREATE POLICY "Users can view their own goal contributions"
    ON goal_contributions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM financial_goals
        WHERE financial_goals.id = goal_contributions.goal_id
        AND financial_goals.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can create contributions for their goals" ON goal_contributions;
CREATE POLICY "Users can create contributions for their goals"
    ON goal_contributions FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM financial_goals
        WHERE financial_goals.id = goal_contributions.goal_id
        AND financial_goals.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update their own goal contributions" ON goal_contributions;
CREATE POLICY "Users can update their own goal contributions"
    ON goal_contributions FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM financial_goals
        WHERE financial_goals.id = goal_contributions.goal_id
        AND financial_goals.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete their own goal contributions" ON goal_contributions;
CREATE POLICY "Users can delete their own goal contributions"
    ON goal_contributions FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM financial_goals
        WHERE financial_goals.id = goal_contributions.goal_id
        AND financial_goals.user_id = auth.uid()
    ));

-- Create function to update goal amount and status
CREATE OR REPLACE FUNCTION update_goal_amount(goal_id uuid, contribution_amount numeric)
RETURNS void AS $$
DECLARE
  goal_record RECORD;
BEGIN
  -- Get the goal record
  SELECT * INTO goal_record
  FROM financial_goals
  WHERE id = goal_id;

  -- Check if goal exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Goal with id % not found', goal_id;
  END IF;

  -- Update the goal with new amount and status
  UPDATE financial_goals
  SET
    current_amount = goal_record.current_amount + contribution_amount,
    status = CASE
      WHEN (goal_record.current_amount + contribution_amount) >= goal_record.target_amount THEN 'completed'
      ELSE 'active'
    END,
    updated_at = NOW()
  WHERE id = goal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get goal progress
CREATE OR REPLACE FUNCTION get_goal_progress(goal_id uuid)
RETURNS TABLE(
  goal_id uuid,
  current_amount numeric,
  target_amount numeric,
  progress_percentage numeric,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fg.id,
    fg.current_amount,
    fg.target_amount,
    CASE 
      WHEN fg.target_amount > 0 THEN (fg.current_amount / fg.target_amount) * 100
      ELSE 0
    END as progress_percentage,
    fg.status
  FROM financial_goals fg
  WHERE fg.id = goal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's goal summary
CREATE OR REPLACE FUNCTION get_user_goals_summary(user_uuid uuid)
RETURNS TABLE(
  total_goals bigint,
  active_goals bigint,
  completed_goals bigint,
  total_target_amount numeric,
  total_current_amount numeric,
  overall_progress numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_goals,
    COUNT(*) FILTER (WHERE status = 'active') as active_goals,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_goals,
    COALESCE(SUM(target_amount), 0) as total_target_amount,
    COALESCE(SUM(current_amount), 0) as total_current_amount,
    CASE 
      WHEN SUM(target_amount) > 0 THEN (SUM(current_amount) / SUM(target_amount)) * 100
      ELSE 0
    END as overall_progress
  FROM financial_goals
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for financial_goals
DROP TRIGGER IF EXISTS update_financial_goals_updated_at ON financial_goals;
CREATE TRIGGER update_financial_goals_updated_at
    BEFORE UPDATE ON financial_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 