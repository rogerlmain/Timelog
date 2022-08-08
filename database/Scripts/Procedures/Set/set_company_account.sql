start transaction;

drop procedure if exists save_company_account;
drop procedure if exists set_company_account;

delimiter ??

create procedure set_company_account (
	account_id	integer,
	company_id	integer,
    permissions	bigint
) begin

	declare company_account_id integer;
    
    select 
		cac.id into company_account_id
	from
		company_accounts as cac
	where
		(cac.account_id = account_id) and
        (cac.company_id = company_id);
        
	if (company_account_id is null) then
    
		insert into company_accounts values (
			null,
			account_id,
            company_id,
            permissions,
            now(),
            now()
		);
            
        select last_insert_id ();
        
    else

		update company_accounts as cac set permissions = coalesce(permissions, cac.permissions) where cac.id = company_account_id;
       
		select company_account_id;
    
    end if;

end??