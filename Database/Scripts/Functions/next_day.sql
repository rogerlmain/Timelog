start transaction;

drop function if exists next_day;

delimiter ??

create function next_day (today date) returns date deterministic begin

	return date_add(today, interval 1 day);
    
end??


commit;