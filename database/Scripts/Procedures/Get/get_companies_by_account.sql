start transaction;

drop procedure if exists get_companies_by_account;

delimiter ??

create procedure get_companies_by_account (account_id integer) begin

	select distinct
		cpy.id as company_id,
        cpy.`name` as company_name,
        cpy.address_id,
        adr.street_address,
        adr.additional,
        adr.city,
        adr.state_id,
        lks.long_name as state_name,
        adr.country_id,
        lkc.long_name as country_name,
        adr.postcode,

        if (permission (cac.permissions, 62), cpy.square_id, null) as square_id,

		cac.permissions

	from 
		company_accounts as cac
	join 
		companies cpy
	on
		cac.company_id = cpy.id
	join
		accounts as acc
	on
		acc.id = cac.account_id
	left outer join
		addresses as adr
	on
		cpy.address_id = adr.id
	left outer join
		lookups as lks
	on
		adr.state_id = lks.id
	left outer join
		lookups as lkc
	on
		adr.country_id = lkc.id
	where
		(acc.id = account_id) or
        (cpy.primary_contact_id = account_id) or
        (cpy.secondary_contact_id = account_id);

end ??

delimiter ;

commit;