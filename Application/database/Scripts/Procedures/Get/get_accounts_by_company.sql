start transaction;

drop procedure if exists get_accounts_by_company;

delimiter ??

create procedure get_accounts_by_company (company_id integer)
begin

	select 
		acc.id as account_id,
		acc.first_name,
        acc.last_name,
        acc.friendly_name,
        concat(acc.first_name, ' ', acc.last_name) as full_name,
        acc.email_address,
        acc.account_type,
        acc.administrator_type,
        cac.permissions,
        cac.date_created
	from
		accounts as acc
	join
		company_accounts as cac
	on
		cac.account_id = acc.id
	join
		companies as cpy
	on
		cpy.id = cac.company_id
	where
		cpy.id = company_id
	order by
		last_name,
        first_name;

end ??

delimiter ;

commit;