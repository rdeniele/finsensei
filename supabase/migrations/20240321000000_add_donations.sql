-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  cause TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  notes TEXT
);

-- Add RLS policies
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own donations
CREATE POLICY "Users can insert their own donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own donations
CREATE POLICY "Users can view their own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admin to view all donations
CREATE POLICY "Admin can view all donations"
  ON donations FOR SELECT
  TO authenticated
  USING (auth.email() = 'work.rparagoso@gmail.com');

-- Allow admin to update donation status
CREATE POLICY "Admin can update donation status"
  ON donations FOR UPDATE
  TO authenticated
  USING (auth.email() = 'work.rparagoso@gmail.com')
  WITH CHECK (auth.email() = 'work.rparagoso@gmail.com'); 