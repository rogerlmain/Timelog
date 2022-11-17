start transaction;

drop procedure if exists save_offshore_token;

delimiter ??

create procedure save_offshore_token (
    company_id integer,
    offshore_type varchar(4),
    offshore_id varchar(255),
    offshore_token varchar(255)
) begin

	insert into offshore_tokens values (
		null,
		company_id,
        offshore_type,
        offshore_id,
		offshore_token,
		false,
		now(),
		now()
	);
    
    select last_insert_id ();

end??