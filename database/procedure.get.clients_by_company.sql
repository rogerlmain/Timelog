start transaction;

drop procedure if exists get_clients;
drop procedure if exists get_clients_by_company;

delimiter ??

create procedure get_clients_by_company (company_id int) begin

	select
		id as client_id,
		`name`,
        `description`
	from
		clients
	where
		(clients.company_id = company_id) and
        (not clients.deleted)
	order by
		clients.`name`;
        
end??

delimiter ;

commit;