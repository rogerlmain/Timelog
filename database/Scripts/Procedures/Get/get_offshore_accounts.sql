start transaction;

drop procedure if exists get_offshore_accounts;

delimiter ??

create procedure get_offshore_accounts (company_id integer) begin

	select 
        oft.offshore_type,
        oft.offshore_id,
		oft.offshore_token
	from 
		offshore_tokens as oft
	where
		oft.company_id = company_id;

end??