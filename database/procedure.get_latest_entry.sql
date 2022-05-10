start transaction;

drop procedure if exists get_latest_entry;

delimiter ??

create procedure get_latest_entry (account_id integer) begin

	select
		etr.id as log_entry_id,
        clt.company_id,
        clt.id as client_id,
		etr.project_id,
		clt.`name` as client_name,
		prj.`name` as project_name,
		etr.start_time,
        etr.end_time
	from
		entries as etr
	left outer join
        projects as prj
	on
        (etr.project_id = prj.id)
	left outer join
		clients as clt
	on
		(prj.client_id = clt.id)
	where
		(etr.account_id  = account_id) and
        (etr.end_time is null)
	order by
		start_time
	limit 1;
        
end??