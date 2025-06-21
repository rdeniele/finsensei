-- Add coins column to profiles table
ALTER TABLE profiles ADD COLUMN coins INTEGER DEFAULT 100 NOT NULL;

-- Create coin_purchases table for tracking coin purchases
CREATE TABLE coin_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    plan_type VARCHAR(20) CHECK (plan_type IN ('bronze', 'silver', 'gold')) NOT NULL,
    coins_amount INTEGER NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) NOT NULL,
    payment_method VARCHAR(50),
    payment_reference TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create coin_transactions table for tracking coin usage
CREATE TABLE coin_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')) NOT NULL,
    coins_amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    reference_id UUID, -- Reference to coin_purchases or chat_messages
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_coin_purchases_user_id ON coin_purchases(user_id);
CREATE INDEX idx_coin_purchases_status ON coin_purchases(status);
CREATE INDEX idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX idx_coin_transactions_type ON coin_transactions(transaction_type);

-- Enable RLS
ALTER TABLE coin_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

-- Coin purchases policies
CREATE POLICY "Users can view their own coin purchases"
    ON coin_purchases FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coin purchases"
    ON coin_purchases FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admin can view all coin purchases
CREATE POLICY "Admin can view all coin purchases"
    ON coin_purchases FOR SELECT
    USING (auth.email() = 'work.rparagoso@gmail.com');

-- Admin can update coin purchases
CREATE POLICY "Admin can update coin purchases"
    ON coin_purchases FOR UPDATE
    USING (auth.email() = 'work.rparagoso@gmail.com')
    WITH CHECK (auth.email() = 'work.rparagoso@gmail.com');

-- Coin transactions policies
CREATE POLICY "Users can view their own coin transactions"
    ON coin_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create coin transactions"
    ON coin_transactions FOR INSERT
    WITH CHECK (true);

-- Admin can view all coin transactions
CREATE POLICY "Admin can view all coin transactions"
    ON coin_transactions FOR SELECT
    USING (auth.email() = 'work.rparagoso@gmail.com');

-- Function to handle coin purchase completion
CREATE OR REPLACE FUNCTION complete_coin_purchase(purchase_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    purchase_record coin_purchases%ROWTYPE;
    current_coins INTEGER;
BEGIN
    -- Get the purchase record
    SELECT * INTO purchase_record FROM coin_purchases WHERE id = purchase_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Get current coins
    SELECT coins INTO current_coins FROM profiles WHERE user_id = purchase_record.user_id;
    
    -- Update user's coins
    UPDATE profiles 
    SET coins = current_coins + purchase_record.coins_amount 
    WHERE user_id = purchase_record.user_id;
    
    -- Update purchase status
    UPDATE coin_purchases 
    SET status = 'completed', updated_at = NOW() 
    WHERE id = purchase_id;
    
    -- Record the transaction
    INSERT INTO coin_transactions (user_id, transaction_type, coins_amount, description, reference_id)
    VALUES (purchase_record.user_id, 'purchase', purchase_record.coins_amount, 
            'Coin purchase - ' || purchase_record.plan_type || ' plan', purchase_id);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct coins for chat usage
CREATE OR REPLACE FUNCTION use_coins_for_chat(user_uuid UUID, coins_to_deduct INTEGER DEFAULT 20)
RETURNS BOOLEAN AS $$
DECLARE
    current_coins INTEGER;
BEGIN
    -- Get current coins
    SELECT coins INTO current_coins FROM profiles WHERE user_id = user_uuid;
    
    -- Check if user has enough coins
    IF current_coins < coins_to_deduct THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct coins
    UPDATE profiles 
    SET coins = current_coins - coins_to_deduct 
    WHERE user_id = user_uuid;
    
    -- Record the transaction
    INSERT INTO coin_transactions (user_id, transaction_type, coins_amount, description)
    VALUES (user_uuid, 'usage', coins_to_deduct, 'Chat with FinSensei AI Coach');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's coin balance
CREATE OR REPLACE FUNCTION get_user_coins(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    user_coins INTEGER;
BEGIN
    SELECT coins INTO user_coins FROM profiles WHERE user_id = user_uuid;
    RETURN COALESCE(user_coins, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 