start transaction;

drop procedure if exists save_setting;

delimiter ??

create procedure save_setting (
	account_id int,
    setting_code int,
    setting_value int
) begin

	declare account_setting_id int;
    
    select
		stg.id into account_setting_id
	from
		settings as stg
	where
		(stg.account_id = account_id) and
        (stg.`code` = setting_code);
        
	if (account_setting_id is null) then
    
		insert into settings (
			account_id, 
            `code`,
            `value`
		) values (
			account_id,
			setting_code,
            setting_value
		);
        
        select last_insert_id() into account_setting_id;
        
    else
    
		update settings as stg set
            stg.`value` = coalesce (setting_value, stg.`value`),
            stg.last_updated = current_timestamp()
		where
			stg.id = account_setting_id;
    
    end if;

	call get_settings (account_id);

end??

