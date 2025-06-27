-- This migration is now handled in the main financial_goals migration
-- Keeping this file for reference but the functions are now in 20240322000000_add_financial_goals.sql

-- The following functions are now created in the main migration:
-- - update_goal_amount(goal_id uuid, contribution_amount numeric)
-- - get_goal_progress(goal_id uuid)
-- - get_user_goals_summary(user_uuid uuid)
-- - update_updated_at_column() trigger function

-- This file can be removed or kept for documentation purposes 