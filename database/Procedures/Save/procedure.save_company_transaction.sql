start transaction;

drop procedure if exists save_company_transaction;

delimiter ??

create procedure save_company_transaction (
    account_id		integer,
    company_id		integer,
    product_id 		integer,
    product_type	enum ("item", "package"),
    transaction_id	varchar (192),
	card_id			varchar (64)
) begin

	insert into company_transactions values (
		null,
		account_id		integer,
		company_id		integer,
		product_id 		integer,
		product_type	enum ("item", "package"),
		transaction_id	varchar (192),
		card_id			varchar (64),
		null
	);
    
    select last_insert_id ();

end;

delimiter ;

commit;
