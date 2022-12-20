start transaction;

drop procedure if exists get_options_by_company;

delimiter ??

create procedure get_options_by_company (company_id int) begin

	select
		`code` as id,
        `value`
	from
		`options`
	where
		(`options`.company_id = company_id)
	order by
		`code`;

end ??

