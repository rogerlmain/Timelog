start transaction;

drop procedure if exists get_account;
drop procedure if exists get_account_by_id;

delimiter ??

create procedure get_account_by_id (account_id integer) begin

	select
		acc.id as account_id,
        acc.company_id,
		acc.first_name,
        acc.last_name,
        coalesce(acc.username, concat(acc.first_name, ' ', acc.last_name)) as username,
        acc.email_address,
        acc.account_type,
        acc.administrator_type
	from
		accounts as acc
	where
		(acc.id = account_id);
	
end??

delimiter ;

commit;