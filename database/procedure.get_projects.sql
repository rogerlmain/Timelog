start transaction;

drop procedure if exists get_projects;
drop procedure if exists get_projects_by_client;

delimiter ??

create procedure get_projects (
	account_id integer, 
	client_id integer
) begin

	select
		clt.company_id,
		prj.id as project_id,
        prj.account_id,
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
		(prj.account_id = account_id) and (prj.client_id = client_id);

end??