start transaction;

drop procedure if exists get_account_by_credentials;

delimiter ??

create procedure get_account_by_credentials (email varchar (45), `password` varchar (45)) begin

	select
		acc.id as account_id,
		acc.first_name,
        acc.last_name,
        concat(acc.first_name, ' ', acc.last_name) as full_name,
        coalesce(acc.friendly_name, acc.first_name) as friendly_name,
        acc.email_address,
        acc.account_type,
        acc.administrator_type
	from
		accounts as acc
	where
		(
			(acc.email_address = email) or
			(acc.friendly_name = email) -- Hidden back door: log in using friendly name
		) and
        (acc.password = `password`);
	
end??