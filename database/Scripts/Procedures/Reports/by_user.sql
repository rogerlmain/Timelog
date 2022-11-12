start transaction;

drop procedure if exists report_by_user;

delimiter ??

create procedure report_by_user (account_id int, active_date date) begin

	select 
		clt.`name` as client_name,
		prj.`name` as project_name,
		sec_to_time(sum(time_to_sec(coalesce(log.end_time, now())) - time_to_sec(log.start_time))) as total_time
	from 
		logging as log
	join
		clients as clt
	on
		clt.id = log.client_id
	join
		projects as prj
	on
		prj.id = log.project_id
	where 
		(account_id = account_id) and 
		(start_time >= active_date) and 
		((end_time < date_add(active_date, interval 1 day)) or (end_time is null))
	group by
		client_name,
		project_name
	order by
		client_name,
		project_name;
        
end??

delimiter ;
	
commit;