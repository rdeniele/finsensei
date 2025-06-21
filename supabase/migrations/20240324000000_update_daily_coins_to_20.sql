-- Update daily coins from 100 to 20
-- Update the check_and_refresh_daily_coins function
CREATE OR REPLACE FUNCTION check_and_refresh_daily_coins(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    user_profile profiles%ROWTYPE;
    current_date DATE := CURRENT_DATE;
    coins_to_add INTEGER := 20;
BEGIN
    -- Get user profile
    SELECT * INTO user_profile FROM profiles WHERE user_id = user_uuid;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Check if user already got coins today
    IF user_profile.last_daily_refresh >= current_date THEN
        -- Return current coins without adding more
        RETURN user_profile.coins;
    END IF;
    
    -- Add daily coins and update last refresh date
    UPDATE profiles 
    SET 
        coins = coins + coins_to_add,
        last_daily_refresh = current_date
    WHERE user_id = user_uuid;
    
    -- Record the transaction
    INSERT INTO coin_transactions (user_id, transaction_type, coins_amount, description)
    VALUES (user_uuid, 'bonus', coins_to_add, 'Daily free coins');
    
    -- Return new coin balance
    RETURN user_profile.coins + coins_to_add;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 