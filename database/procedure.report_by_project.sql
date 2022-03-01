start transaction;

drop procedure if exists report_by_project;

delimiter ??

create procedure report_by_project (project_id int) begin

	select
		ent.id as entry_id,
		ent.start_time,
        ent.end_time,
        timestampdiff (microsecond, ent.start_time, ent.end_time) as total_time
	from
		entries as ent
	where
		ent.project_id = project_id;
        
end??
