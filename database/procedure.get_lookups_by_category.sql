start transaction;

drop procedure if exists get_lookups_by_category;

delimiter ??

create procedure get_lookups_by_category (category_id integer) begin

	select
		id,
        reference_id,
        short_name,
        long_name
	from
		lookups
	where
		lookups.category_id = category_id;
        
end??

delimiter ;

commit;