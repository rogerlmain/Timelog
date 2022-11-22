start transaction;

drop procedure if exists save_offshore_account;

delimiter ??

create procedure save_offshore_account (
    account_id integer,
    token_id integer,
    repository varchar(255),
    offshore_account varchar(255)
) begin

	declare offshore_account_id int;
    
    select
		oac.id
	from
		offshore_accounts as oac
	where
		(oac.account_id = account_id) and
        (oac.token_id = token_id) and
        (oac.repository = repository)
	into
		offshore_account_id;

	if (offshore_account_id is null) then
    
		insert into offshore_accounts values (
			null,
			account_id,
			token_id,
			repository,
			offshore_account,
			false,
			now(),
			now()
		);
    
		select last_insert_id ();
        
	else
    
		update offshore_accounts as oac set 
			oac.offshore_account = coalesce(offshore_account, oac.offshore_account)
		where
			(oac.account_id = account_id) and
			(oac.token_id = token_id) and
			(oac.repository = repository);
            
	end if;
	
end??