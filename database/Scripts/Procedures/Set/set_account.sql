start transaction;

drop procedure if exists save_account;

delimiter ??

create procedure save_account (
    account_id int,
	first_name varchar (45),
    last_name varchar (45),
    friendly_name varchar (45),
    email_address varchar (255),
    `password` varchar (45),
    account_type int,
    avatar text
) begin

    if (account_id is null) then
    
		insert into accounts values (
			null,
			first_name,
			last_name,
			friendly_name,
			email_address,
			`password`,	--  to be encrypted
			account_type,
			0,
            avatar,
            null,
            now(),
            now()
		);

		select last_insert_id () as account_id;
        
	else
    
		update accounts as acc set
 			acc.first_name = coalesce (first_name, acc.first_name),
			acc.last_name = coalesce (last_name, acc.last_name),
			acc.friendly_name = coalesce (friendly_name, acc.friendly_name),
			acc.email_address = coalesce (email_address, acc.email_address),
			acc.password = coalesce (`password`, acc.password),	--  to be encrypted
			acc.account_type = coalesce (account_type, acc.account_type),
            acc.avatar = coalesce (avatar, acc.avatar),
            acc.last_updated = coalesce (now(), acc.last_updated)
		where
			acc.id = account_id;
    
		select account_id;

	end if;

end ??