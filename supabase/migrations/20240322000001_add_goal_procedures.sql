-- Create a function to update goal amount and status
create or replace function update_goal_amount(goal_id uuid, contribution_amount numeric)
returns void as $$
declare
  current_amount numeric;
  target_amount numeric;
begin
  -- Get current and target amounts
  select current_amount, target_amount
  into current_amount, target_amount
  from financial_goals
  where id = goal_id;

  -- Update the goal with new amount and status
  update financial_goals
  set
    current_amount = current_amount + contribution_amount,
    status = case
      when current_amount + contribution_amount >= target_amount then 'completed'
      else 'active'
    end,
    updated_at = now()
  where id = goal_id;
end;
$$ language plpgsql security definer; 