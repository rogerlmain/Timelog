start transaction;

drop procedure if exists get_latest_entry;

delimiter ??

create procedure get_latest_entry (account_id integer) begin

	select
		etr.id as log_entry_id,
		etr.project_id,
		clt.`name` as client_name,
		prj.`name` as project_name,
		etr.start_time,
        etr.end_time
	from
		entries as etr,
		clients as clt,
        projects as prj
	where
		(prj.client_id = clt.id) and
        (etr.project_id = prj.id) and
		(etr.account_id  = account_id) and
        (etr.end_time is null)
	order by
		start_time
	limit 1;
        
end??