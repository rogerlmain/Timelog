start transaction;

drop procedure if exists admin_reset_companies;

delimiter ??

create procedure admin_reset_companies (input_id integer) begin

	update addresses set company_id = null where (company_id > input_id);
    
    delete from addresses where company_id > input_id;
    delete from company_accounts where company_id > input_id;
    delete from company_cards where company_id > input_id;
    delete from `options` where company_id > input_id;
    
    
    delete from companies where id > input_id;

	select * from companies;
    
end??