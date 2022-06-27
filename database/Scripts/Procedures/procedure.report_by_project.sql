start transaction;

drop procedure if exists report_by_project;

delimiter ??

create procedure report_by_project (project_id int) begin

	select
		log.id as logry_id,
		log.start_time,
        log.end_time,
        timestampdiff (second, log.start_time, log.end_time) as total_time
	from
		logging as log
	where
		log.project_id = project_id;
        
end??
