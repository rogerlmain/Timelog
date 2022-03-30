start transaction;

drop procedure if exists get_client;
drop procedure if exists get_client_by_id;

delimiter ??

create procedure get_client_by_id (client_id int) begin

	select
		id as client_id,
        `name`,
        `description`
	from
		clients
	where
		(clients.id = client_id) and
		(not clients.deleted);
        
end??
    
	