start transaction;

drop procedure if exists save_client;

delimiter ??

create procedure save_client (
	client_id int,
    company_id int,
	client_name varchar (64), 
    client_description varchar (255),
    deleted boolean
) begin

	if ((client_id is null) or (client_id = 0)) then
    
		if (not deleted) then
    
			insert into clients (
				company_id, 
				`name`, 
				`description`
			) values (
				company_id,
				client_name, 
				client_description
			);
            
		end if;
        
        select last_insert_id () into client_id;
        
    else
    
		if (deleted) then
        
			update clients set deleted = true where clients.id = client_id;
            
		else
        
			update clients set 
				company_id 		= coalesce (company_id, clients.company_id),
				`name`			= coalesce (client_name, clients.name),
				`description`	= coalesce (client_description, clients.description),
				last_updated 	= coalesce (current_timestamp(), clients.last_updated)
			where
				id = client_id;

        end if;
    
    end if;

	call get_client_by_id (client_id);
    
end??