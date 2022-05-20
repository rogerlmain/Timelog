start transaction;

drop procedure if exists get_project;
drop procedure if exists get_project_by_id;

delimiter ??

create procedure get_project_by_id (project_id integer)
BEGIN

	select
		id as project_id,
        account_id,
        client_id,
        `name`,
        `code`,
        `description`
	from
		projects
	where
		id = project_id;

end??