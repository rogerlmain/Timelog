start transaction;

drop procedure if exists set_permissions;

delimiter ??

create procedure set_permissions (
	company_id integer,
    account_id integer,
	permission bigint
) begin

	update company_accounts as cac set 
		permissions = permission
	where
		(cac.company_id = company_id) and
		(cac.account_id = account_id);
    
end ??

delimiter ;

commit;