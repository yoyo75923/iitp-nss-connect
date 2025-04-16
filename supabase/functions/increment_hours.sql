
-- Create a function to increment hours in mentor_assignments
create or replace function increment_hours(row_volunteer_id uuid, hours_to_add int)
returns int
language sql
as $$
  update mentor_assignments
  set total_hours = total_hours + hours_to_add
  where volunteer_id = row_volunteer_id
  returning total_hours;
$$;
