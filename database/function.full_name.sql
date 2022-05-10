start transaction;

drop function if exists full_name;

delimiter ??

create function full_name (account_id integer) returns varchar (255) reads sql data begin

	declare result varchar (91);

	select
		concat(first_name, ' ', last_name)
	into
		result
	from
		accounts
	where
		id = account_id;
		
	return result;
    
end??


commit;