select logging.*, unix_timestamp(start_time) from logging;

select
	log.client_id,
	log.project_id,
    prj.name as project_name,
    sum(unix_timestamp(log.end_time) - unix_timestamp(log.start_time)) as elapsed_time,
    from_unixtime(sum(unix_timestamp(log.end_time) - unix_timestamp(log.start_time)), "%H:%i:%s") as elapsed_time_formatted
from 
	logging as log
join
	projects as prj
on
	prj.id = log.project_id
where 
	(log.client_id = 143) and
    (log.start_time >= '2023-02-13') and
    (log.end_time < '2023-02-18')
group by
	client_id,
	project_id,
    project_name;