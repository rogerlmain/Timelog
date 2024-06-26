start transaction;

drop procedure if exists save_offshore_token;

delimiter ??

create procedure save_offshore_token (
    company_id integer,
    `type` integer,
    offshore_id varchar(255),
    token varchar(255)
) begin

	insert into offshore_tokens values (
		null,
		company_id,
        `type`,
        offshore_id,
		token,
		false,
		now(),
		now()
	);
    
    select last_insert_id () as offshore_token_id;

end??