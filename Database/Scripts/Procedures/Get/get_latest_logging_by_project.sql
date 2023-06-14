start transaction;

drop procedure if exists get_active_logging_by_project;
drop procedure if exists get_latest_logging_by_project;

delimiter ??

create procedure get_latest_logging_by_project (account_id integer, project_id varchar (64))
begin

	select 
   
		log.id as log_id,
        log.id as account_id,
        log.client_id,
        log.project_id,

        clt.`name` as client_name,
        prj.`name` as project_name,
--         
        log.start_time,
        log.end_time,
        log.notes
        
	from 
		logging as log
	join
		clients as clt
	on 
		(clt.id = log.client_id)
	join
		projects as prj
	on
		(prj.id = log.project_id)
	where 
        (log.account_id = account_id) and
		(log.project_id = project_id)
	order by
		log.end_time is not null,
		log.end_time desc
	limit 1;

end??

delimiter ;

commit;