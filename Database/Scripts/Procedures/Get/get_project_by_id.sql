start transaction;

drop procedure if exists get_project;
drop procedure if exists get_project_by_id;

delimiter ??

create procedure get_project_by_id (project_id integer) begin

	select
		prj.id as project_id,
        prj.client_id,
		clt.company_id,
        prj.`code`,
        prj.`name`,
        prj.`description`,
		prj.billing_rate
	from
		projects as prj
	join
		clients as clt
	on
		clt.id = prj.client_id
	where
		(prj.id = project_id) and
        (not prj.deleted);

end??