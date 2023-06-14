start transaction;

drop procedure if exists get_active_logging_by_client;
drop procedure if exists get_latest_logging_by_client;

delimiter ??

create procedure get_latest_logging_by_client (account_id integer, client_id varchar (64))
begin

	select 
   
		log.id as log_id,
        log.id as account_id,
        log.client_id,
        log.project_id,
        
        clt.`name` as client_name,
        prj.`name` as project_name,

        log.start_time,
        log.end_time,
        log.notes
        
	from 
		logging as log
	join
		clients as clt
	on 
		(clt.id = log.client_id)
	left outer join
		projects as prj
	on
		(prj.id = log.project_id)
	where 
        (log.account_id = account_id) and
		(log.client_id = client_id)
	order by
		log.end_time is not null,
		log.end_time desc
	limit 1;

end??

delimiter ;

commit;