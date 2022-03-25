start transaction;

drop procedure if exists get_account_by_credentials;

delimiter ??

create procedure get_account_by_credentials (
	username varchar (45), 
    `password` varchar (45)
) begin

	select
		acc.id as account_id,
		acc.first_name,
        acc.last_name,
        coalesce(acc.username, concat(acc.first_name, ' ', acc.last_name)) as username,
        acc.email_address,
        acc.account_type,
        acc.administrator_type,
        acc.square_id
	from
		accounts as acc
	where
		(acc.username = username) or (acc.email_address = username) and
        (acc.password = `password`);
	
end??

delimiter ;

commit;