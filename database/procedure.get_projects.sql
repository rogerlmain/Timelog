start transaction;

drop procedure if exists get_projects;
drop procedure if exists get_projects_by_client;

delimiter ??

create procedure get_projects (
	account_id integer, 
	client_id integer
) begin

	select
		prj.id as project_id,
        prj.`name` as project_name,
        prj.`code` as project_code
        
	from
		projects as prj
	where
		(prj.account_id = account_id) and (prj.client_id = client_id);

end??