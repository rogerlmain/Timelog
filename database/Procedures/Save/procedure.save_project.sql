start transaction;

drop procedure if exists save_project;

delimiter ??

create procedure save_project (
    project_id	integer,
    client_id	integer,
	project_name varchar (50),
	project_code varchar (5),
    project_description text,
    deleted boolean
) begin

    if ((project_id is null) or (project_id = 0)) then
    
		if (not deleted) then 
        
			insert into projects (
                client_id,
				`name`,
				`code`,
				`description`
			) values (
                client_id,
				project_name,
				project_code,
				project_description
			);
            
		end if;

		select last_insert_id () into project_id;
        
	else
    
		update projects set
			client_id 		= coalesce (client_id, projects.client_id), 
			`name` 			= coalesce (project_name, projects.name), 
			`code` 			= coalesce (project_code, projects.code),
			`description` 	= coalesce (project_description, projects.description), 
			last_updated 	= current_timestamp()
		where
			id = project_id;
                
	end if;

	call get_project_by_id (project_id);
    
end??