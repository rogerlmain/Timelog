start transaction;

drop procedure if exists get_project;
drop procedure if exists get_project_by_id;

delimiter ??

create procedure get_project_by_id (project_id integer) begin

	select
		clt.company_id,
		prj.id as project_id,
        prj.client_id,
        prj.`name` as project_name,
        prj.`code` as project_code,
        prj.`description`
	from
		projects as prj
	join
		clients as clt
	on
		clt.id = prj.client_id
	where
		prj.id = project_id;

end??