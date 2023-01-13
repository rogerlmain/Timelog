start transaction;

drop procedure if exists report_by_user;
drop procedure if exists report_daily_by_user;
drop procedure if exists report_daily_by_account;

delimiter ??

create procedure report_daily_by_account (account_id int, active_date date) begin

	select 
		log.id as log_id,
		clt.id as client_id,
		prj.id as project_id,
		clt.`name` as client_name,
		prj.`name` as project_name,
		log.start_time,
		coalesce(log.end_time, now()) as end_time,
		date(log.start_time) as start_date,
		date(coalesce(log.end_time, now())) as end_date
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
		(log.account_id = account_id) 
	having
		((start_date = active_date) or (end_date = active_date)) or 
		((start_date < active_date) and (end_date > active_date))
	order by
		client_name,
		project_name;
        
end??

delimiter ;
	
commit;