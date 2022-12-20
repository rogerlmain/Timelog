start transaction;

drop procedure if exists get_account;
drop procedure if exists get_account_by_id;

delimiter ??

create procedure get_account_by_id (account_id integer) begin

	select
		acc.id as account_id,
		acc.first_name,
        acc.last_name,
        concat(acc.first_name, ' ', acc.last_name) as full_name,
        coalesce(acc.friendly_name, acc.first_name) as friendly_name,
        acc.email_address,
        acc.account_type,
        acc.administrator_type,
		acc.memo,
		unix_timestamp(acc.date_created) as date_created,
		unix_timestamp(acc.last_updated) as last_updated
	from
		accounts as acc
	where
		(acc.id = account_id);
	
end??

delimiter ;

commit;