start transaction;

delimiter ??

create procedure get_account_options (account_id int) begin

	select
		option_id,
        `value`,
        renewal_date
	from
		account_options as aop
	where
		(aop.account_id = account_id)
	order by
		option_id;

end??

