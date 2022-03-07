start transaction;

drop procedure if exists get_options;

delimiter ??

create procedure get_options (company_id int) begin

	select
		`code` as id,
        `value`
	from
		`options`
	where
		(`options`.company_id = company_id)
	order by
		`code`;

end??

