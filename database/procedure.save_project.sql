start transaction;

drop procedure if exists save_project;

delimiter ??

create procedure save_project (
    client_id int,
    project_id int,
	project_name varchar (50),
    `description` text,
    deleted boolean
) begin

    if ((project_id is null) or (project_id = 0)) then
    
		if (not deleted) then 
        
			insert into projects (
				client_id,
				`name`,
				`description`
			) values (
				client_id,
				project_name,
				`description`
			);
            
		end if;

		select last_insert_id () into project_id;
        
        call get_project (project_id);
    
	else
    
		if (deleted) then
        
			update projects set deleted = true where projects.id = project_id;
            
		else
        
			update projects set
				client_id = client_id,
				`name` = project_name,
				`description` = `description`,
				last_updated = current_timestamp()
			where
				id = project_id;
                
		end if;
    
		select project_id;

	end if;

end??