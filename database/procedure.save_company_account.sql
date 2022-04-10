start transaction;

drop procedure if exists save_company_account;

delimiter ??

create procedure save_company_account (
	account_id	integer,
	company_id	integer
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
            company_id
		);
            
        select last_insert_id ();
        
    else

		select company_account_id;
    
    end if;

end??