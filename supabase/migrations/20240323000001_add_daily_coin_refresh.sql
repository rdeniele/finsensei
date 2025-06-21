-- Add last_daily_refresh column to profiles table
ALTER TABLE profiles ADD COLUMN last_daily_refresh DATE DEFAULT CURRENT_DATE;

-- Create function to check and refresh daily coins
CREATE OR REPLACE FUNCTION check_and_refresh_daily_coins(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    user_profile profiles%ROWTYPE;
    current_date DATE := CURRENT_DATE;
    coins_to_add INTEGER := 100;
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

-- Create function to get user's daily refresh status
CREATE OR REPLACE FUNCTION get_daily_refresh_status(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    user_profile profiles%ROWTYPE;
    current_date DATE := CURRENT_DATE;
    result JSON;
BEGIN
    -- Get user profile
    SELECT * INTO user_profile FROM profiles WHERE user_id = user_uuid;
    
    IF NOT FOUND THEN
        RETURN '{"coins": 0, "last_refresh": null, "can_refresh": false, "next_refresh": null}'::JSON;
    END IF;
    
    -- Check if user can refresh today
    IF user_profile.last_daily_refresh >= current_date THEN
        -- Already refreshed today, next refresh is tomorrow
        result := json_build_object(
            'coins', user_profile.coins,
            'last_refresh', user_profile.last_daily_refresh,
            'can_refresh', false,
            'next_refresh', current_date + INTERVAL '1 day'
        );
    ELSE
        -- Can refresh today
        result := json_build_object(
            'coins', user_profile.coins,
            'last_refresh', user_profile.last_daily_refresh,
            'can_refresh', true,
            'next_refresh', current_date
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to refresh daily coins for all users (admin function)
CREATE OR REPLACE FUNCTION refresh_daily_coins_for_all_users()
RETURNS INTEGER AS $$
DECLARE
    user_record RECORD;
    refreshed_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
BEGIN
    -- Loop through all users who haven't refreshed today
    FOR user_record IN 
        SELECT user_id FROM profiles 
        WHERE last_daily_refresh < current_date OR last_daily_refresh IS NULL
    LOOP
        -- Refresh coins for this user
        PERFORM check_and_refresh_daily_coins(user_record.user_id);
        refreshed_count := refreshed_count + 1;
    END LOOP;
    
    RETURN refreshed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for better performance
CREATE INDEX idx_profiles_last_daily_refresh ON profiles(last_daily_refresh);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_and_refresh_daily_coins(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_refresh_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_daily_coins_for_all_users() TO authenticated; 