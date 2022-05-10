start transaction;

drop procedure if exists save_entry;

delimiter ??

create procedure save_entry (
	account_id	integer, 
	project_id	integer,
    time_stamp	datetime
) begin

	declare last_entry integer;
    
	select
		max(id) into last_entry
	from
		entries
	where
		(entries.account_id = account_id) and
		(entries.end_time is null);

	if (last_entry is null) then

		insert into entries values (
			null,
			account_id,
			project_id,
			time_stamp,
			null
		);

	else

		update entries set
			end_time = time_stamp
		where
			id = last_entry;

	end if;

	call get_latest_entry (account_id);
        
end??