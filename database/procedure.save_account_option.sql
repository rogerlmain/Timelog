start transaction;

drop procedure if exists save_account_option;

delimiter ??

create procedure save_account_option (
	account_id int,
    option_id int,
    option_value int
) begin

	declare account_option_id int;
    
    select
		aop.id into account_option_id
	from
		account_options as aop
	where
		(aop.account_id = account_id) and
        (aop.option_id = option_id);
        
	if (account_option_id is null) then
    
		insert into account_options (
			account_id, 
            option_id,
            `value`,
            renewal_date
		) values (
			account_id,
			option_id,
            option_value,
            now()
		);
        
        select last_insert_id() into account_option_id;
        
    else
    
		update account_options as aop set
            aop.`value` = coalesce (option_value, aop.`value`),
            aop.renewal_date = coalesce (now(), aop.renewal_date)
		where
			aop.id = account_option_id;
    
    end if;

	call get_account_options (account_id);

end??

