-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    two_factor_auth BOOLEAN DEFAULT false,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    maintenance_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Only allow admins to read settings
CREATE POLICY "Allow admins to read settings"
    ON settings FOR SELECT
    USING (
        auth.jwt() ->> 'email' = 'admin@finsensei.com'
    );

-- Only allow admins to update settings
CREATE POLICY "Allow admins to update settings"
    ON settings FOR UPDATE
    USING (
        auth.jwt() ->> 'email' = 'admin@finsensei.com'
    );

-- Only allow admins to insert settings
CREATE POLICY "Allow admins to insert settings"
    ON settings FOR INSERT
    WITH CHECK (
        auth.jwt() ->> 'email' = 'admin@finsensei.com'
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (email_notifications, push_notifications, two_factor_auth, language, timezone, maintenance_mode)
VALUES (true, true, false, 'en', 'UTC', false)
ON CONFLICT DO NOTHING; 