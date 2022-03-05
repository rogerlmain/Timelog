start transaction;

drop procedure if exists get_clients;

delimiter ??

create procedure get_clients (account_id int) begin

	select
		id as client_id,
		`name`,
        `description`
	from
		clients
	where
		(clients.company_id = (select company_id from accounts where id = account_id)) and
        (not clients.deleted);
        
end??

delimiter ;

commit;