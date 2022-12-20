start transaction;

drop procedure if exists set_billing;

delimiter ??

create procedure set_billing (
	log_id	integer, 
    billed		bit
) begin

	update logging as log set
		billed = coalesce(billed, log.billed)
	where
		id = log_id;
        
	select 
		id as log_id,
		billed 
	from logging where id = log_id;

end??