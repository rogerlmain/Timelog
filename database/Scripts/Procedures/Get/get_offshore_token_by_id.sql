start transaction;

drop procedure if exists get_offshore_token_by_id;

delimiter ??

create procedure get_offshore_token_by_id (token_id integer) begin

	select 
		oft.id as offshore_token_id,
        oft.`type`,
        oft.offshore_id,
		oft.token
	from 
		offshore_tokens as oft
	where
		oft.id = token_id;

end??

