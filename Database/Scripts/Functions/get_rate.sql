start transaction;

drop function if exists get_rate;

delimiter ;;

create function get_rate (project_id integer) returns integer deterministic
begin

	declare result integer;
    
    select
		coalesce (prj.billing_rate, clt.billing_rate, (select 
			`value` as billing_rate 
		from 
			options
		where
			(company_id = cpy.id) and
			(code = 7) -- code for default rate: see client/classes/constants.jsx | option_types.default_rate
		))
	into
		result
	from
		projects as prj
	join
		clients as clt
	on
		prj.client_id = clt.id
	join
		companies as cpy
	on
		clt.company_id = cpy.id
	where
		prj.id = project_id;
    
	return result;
    
end;;

delimiter ;