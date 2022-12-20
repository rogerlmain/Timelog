start transaction;

drop procedure if exists report_by_task;

delimiter ??

create procedure report_by_task (project_id integer) 
begin

	select
		log.project_id,
		prj.`name` as project_name,    
        log.`notes` as task,
		sec_to_time(sum(time_to_sec(log.end_time) - time_to_sec(log.start_time))) as total_time
	from
		logging as log
	join
		accounts as acc
	on
		acc.id = log.account_id
	join
		projects as prj
	on
		prj.id = log.project_id
	where
		prj.id = project_id
	group by
		log.project_id,
		project_name,
        task
	order by
		task;
        
	end??
    
    delimiter ;
    
    commit;