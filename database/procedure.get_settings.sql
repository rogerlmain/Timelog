start transaction;

drop procedure if exists get_settings;

delimiter ??

create procedure get_settings (account_id int) begin

	select
		`code` as id,
        `value`
	from
		settings
	where
		(settings.account_id = account_id)
	order by
		`code`;

end??

