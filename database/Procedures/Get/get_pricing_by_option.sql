start transaction;

drop procedure if exists get_pricing_by_option;

delimiter ??

create procedure get_pricing_by_option (
	code integer,
	code_value integer
)
BEGIN

	select
		id as price_id,
		price
	from
		pricing
	where
		(pricing.code = code) and
		(pricing.value = code_value);

end??