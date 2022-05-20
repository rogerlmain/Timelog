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
		((account_id is not null) and (prj.account_id = account_id)) or
		((client_id is not null) and (prj.client_id = client_id));

end??