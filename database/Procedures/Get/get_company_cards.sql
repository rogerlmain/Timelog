start transaction;

drop procedure if exists get_company_cards;

delimiter ??

create procedure get_company_cards (company_id integer) begin

	select
        cds.card_type,
		cds.last_few,
        cds.expiration,
        cds.square_id
	from
		company_cards as cds
	where
        (cds.company_id = company_id);

end ??

delimiter ;

commit;