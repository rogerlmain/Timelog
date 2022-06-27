start transaction;

drop procedure if exists admin_reset_accounts;

delimiter ??

create procedure admin_reset_accounts (input_id integer) begin

	delete from company_accounts where account_id > 75;
	delete from accounts where id > 75;

	select * from accounts;
    
end??