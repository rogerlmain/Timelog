start transaction;

drop procedure if exists get_projects_by_client;

delimiter ??

create procedure get_projects_by_client (client_id integer) begin

	select
		pr.id as project_id,
        pr.`name` as project_name,
        pr.`code` as project_code
        
	from
		projects as pr
	where
		pr.client_id = client_id;

end??