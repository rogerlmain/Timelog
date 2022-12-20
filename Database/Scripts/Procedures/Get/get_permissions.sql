start transaction;

drop procedure if exists get_permissions;

delimiter ??

create procedure get_permissions (company_id integer, account_id integer) begin

	select permissions from 
		company_accounts as cac
	where
		(cac.company_id = company_id) and
		(cac.account_id = account_id);
	
end??

delimiter ;

commit;