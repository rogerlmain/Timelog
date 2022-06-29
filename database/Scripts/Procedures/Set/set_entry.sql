start transaction;

drop procedure if exists save_entry;

delimiter ??

create procedure save_entry (
	account_id	integer, 
    client_id	integer,
	project_id	integer,
    notes		text,
    time_stamp	datetime
) begin

	declare last_entry integer;
    
	select
		max(id) into last_entry
	from
		logging
	where
		(logging.account_id = account_id) and
		(logging.end_time is null);

	if (last_entry is null) then

		insert into logging values (
			null,
			account_id,
            client_id,
			project_id,
            notes,
			time_stamp,
			null
		);

	else

		update logging as log set
			end_time = time_stamp,
            notes = coalesce(notes, log.notes)
		where
			id = last_entry;

	end if;

	call get_latest_entry (account_id);
        
end??