start transaction;

drop procedure if exists report_by_project;
drop procedure if exists create_report;

delimiter ??

create procedure create_report (
	project_id	int,
    start_date	date,
    end_date	date
) begin

	select
		log.id as log_id,
		log.start_time,
        log.end_time,
        timestampdiff (second, log.start_time, log.end_time) as total_time,
        (timestampdiff (second, log.start_time, log.end_time) / 3600) * get_rate (project_id) as total_due,
        log.notes,
        get_rate(project_id) as rate
	from
		logging as log
	where
		((log.project_id = project_id) or (project_id is null)) and
		((log.start_time >= start_date) or (start_date is null)) and
		((log.end_time < date_add(end_date, interval 1 day)) or (end_date is null))
	order by
		start_time;
        
end??
