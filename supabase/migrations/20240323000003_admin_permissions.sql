-- Update admin policies to allow access to coin management
-- Admin can view all coin purchases (update existing policy)
DROP POLICY IF EXISTS "Admin can view all coin purchases" ON coin_purchases;
CREATE POLICY "Admin can view all coin purchases"
    ON coin_purchases FOR SELECT
    USING (auth.email() = 'rondenielep13@gmail.com' OR auth.email() = 'work.rparagoso@gmail.com');

-- Admin can update all coin purchases (update existing policy)
DROP POLICY IF EXISTS "Admin can update coin purchases" ON coin_purchases;
CREATE POLICY "Admin can update coin purchases"
    ON coin_purchases FOR UPDATE
    USING (auth.email() = 'rondenielep13@gmail.com' OR auth.email() = 'work.rparagoso@gmail.com')
    WITH CHECK (auth.email() = 'rondenielep13@gmail.com' OR auth.email() = 'work.rparagoso@gmail.com');

-- Admin can view all coin transactions (update existing policy)
DROP POLICY IF EXISTS "Admin can view all coin transactions" ON coin_transactions;
CREATE POLICY "Admin can view all coin transactions"
    ON coin_transactions FOR SELECT
    USING (auth.email() = 'rondenielep13@gmail.com' OR auth.email() = 'work.rparagoso@gmail.com');

-- Admin can insert coin transactions
CREATE POLICY "Admin can insert coin transactions"
    ON coin_transactions FOR INSERT
    WITH CHECK (auth.email() = 'rondenielep13@gmail.com' OR auth.email() = 'work.rparagoso@gmail.com');

-- Admin can view all profiles for coin management
CREATE POLICY "Admin can view all profiles for coin management"
    ON profiles FOR SELECT
    USING (auth.email() = 'rondenielep13@gmail.com' OR auth.email() = 'work.rparagoso@gmail.com');

-- Admin can update all profiles for coin management
CREATE POLICY "Admin can update all profiles for coin management"
    ON profiles FOR UPDATE
    USING (auth.email() = 'rondenielep13@gmail.com' OR auth.email() = 'work.rparagoso@gmail.com')
    WITH CHECK (auth.email() = 'rondenielep13@gmail.com' OR auth.email() = 'work.rparagoso@gmail.com');

-- Grant execute permissions for admin functions
GRANT EXECUTE ON FUNCTION refresh_daily_coins_for_all_users() TO authenticated; 