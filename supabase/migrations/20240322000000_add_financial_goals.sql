-- Create financial_goals table
CREATE TABLE financial_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create goal_contributions table to track contributions
CREATE TABLE goal_contributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    goal_id UUID REFERENCES financial_goals(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    contribution_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX idx_financial_goals_account_id ON financial_goals(account_id);
CREATE INDEX idx_financial_goals_status ON financial_goals(status);
CREATE INDEX idx_goal_contributions_goal_id ON goal_contributions(goal_id);

-- Enable RLS
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for financial_goals
CREATE POLICY "Users can view their own goals"
    ON financial_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals"
    ON financial_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON financial_goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON financial_goals FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for goal_contributions
CREATE POLICY "Users can view their own goal contributions"
    ON goal_contributions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM financial_goals
        WHERE financial_goals.id = goal_contributions.goal_id
        AND financial_goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can create contributions for their goals"
    ON goal_contributions FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM financial_goals
        WHERE financial_goals.id = goal_contributions.goal_id
        AND financial_goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own goal contributions"
    ON goal_contributions FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM financial_goals
        WHERE financial_goals.id = goal_contributions.goal_id
        AND financial_goals.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own goal contributions"
    ON goal_contributions FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM financial_goals
        WHERE financial_goals.id = goal_contributions.goal_id
        AND financial_goals.user_id = auth.uid()
    )); 