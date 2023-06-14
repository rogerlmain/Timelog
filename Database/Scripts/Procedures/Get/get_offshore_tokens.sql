start transaction;

drop procedure if exists get_offshore_tokens;

delimiter ??

create procedure get_offshore_tokens (company_id integer) begin

	select 
		oft.id as token_id,
        oft.offshore_id,
        oft.`type`,
		oft.token
	from 
		offshore_tokens as oft
	where
		oft.company_id = company_id;

end??

