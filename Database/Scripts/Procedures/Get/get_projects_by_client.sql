start transaction;

drop procedure if exists get_projects;
drop procedure if exists get_projects_by_client;

delimiter ??

create procedure get_projects_by_client (client_id varchar (64)) begin

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
		(prj.client_id = client_id) and
        (not prj.deleted);

end??