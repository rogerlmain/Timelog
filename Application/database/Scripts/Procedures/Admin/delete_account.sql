start transaction;

drop procedure if exists admin_delete_account;

delimiter ??

create procedure admin_delete_account (account_id integer) begin

	set @company_id = (
		select 
			company_id 
		from 
			company_accounts as cac 
		where 
			(cac.account_id = account_id) and
			(cac.company_id not in (select company_id from company_accounts acc where acc.account_id <> account_id))
	);

	delete from company_accounts as cac where cac.account_id = account_id;
	delete from settings as stg where stg.account_id = account_id;
	delete from logging as log where log.account_id = account_id;

	if (@company_id is not null) then 
		delete from `options` where company_id = @company_id;
		delete from companies where id = @company_id;
	end if;
    
	delete from accounts where id = account_id;
	delete from invitations where host_id = account_id;

	select * from accounts;
    
end??