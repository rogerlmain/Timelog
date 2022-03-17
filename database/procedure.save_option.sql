start transaction;

drop procedure if exists save_option;

delimiter ??

create procedure save_option (
	company_id int,
	option_code varchar(32),
	option_value varchar(16)
) begin

	declare account_option_id int;
	
	select
		opt.id into account_option_id
	from
		`options` as opt
	where
		(opt.company_id = company_id) and
		(opt.`code` = option_code);
		
	if (account_option_id is null) then
	
		insert into `options` (
			company_id, 
			`code`,
			`value`
		) values (
			company_id,
			option_code,
			option_value
		);
		
		select last_insert_id() into account_option_id;
		
	else
	
		update `options` as opt set
			opt.`value` = coalesce (option_value, opt.`value`),
			opt.last_updated = current_timestamp()
		where
			opt.id = account_option_id;
	
	end if;

	call get_options (company_id);

end??