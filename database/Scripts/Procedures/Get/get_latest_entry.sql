start transaction;

drop procedure if exists get_latest_entry;

delimiter ??

create procedure get_latest_entry (account_id integer) begin

	select
		log.id as log_entry_id,
        clt.company_id,
        clt.id as client_id,
		log.project_id,
		clt.`name` as client_name,
		prj.`name` as project_name,
        log.notes,
		log.start_time,
        log.end_time
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
		(log.account_id  = account_id) and
        (log.end_time is null)
	order by
		start_time
	limit 1;
        
end??