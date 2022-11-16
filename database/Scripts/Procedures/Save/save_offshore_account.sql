start transaction;

drop procedure if exists save_offshore_account;

delimiter ??

create procedure save_offshore_account (
    account_id integer,
    offshore_token_id integer,
    offshore_account varchar(255)
) begin

	insert into offshore_accounts values (
		null,
		account_id,
        offshore_token_id,
		offshore_account,
		false,
		now(),
		now()
	);
    
    select last_insert_id ();

end??