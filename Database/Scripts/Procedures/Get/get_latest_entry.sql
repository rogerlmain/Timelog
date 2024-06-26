start transaction;

drop procedure if exists get_latest_entry;

delimiter ??

create procedure get_latest_entry (account_id integer) begin

	select
		log.id as log_entry_id,
        log.client_id,
		log.project_id,
        log.offshore_token_id,
		clt.`name` as client_name,
		prj.`name` as project_name,
        log.notes,
		log.start_time,
        log.end_time,
        (log.end_time is null) as logged_in
	from
		logging as log
	left outer join
        projects as prj
	on
        (log.project_id = prj.id)
	left outer join
		clients as clt
	on
		(log.client_id = clt.id)
	where
		(log.account_id  = account_id)
	order by
		(end_time is not null),
		end_time desc
 	limit 1;
        
end??