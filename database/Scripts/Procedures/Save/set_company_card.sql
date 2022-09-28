start transaction;

drop procedure if exists save_company_card;

delimiter ??

create procedure save_company_card (
    company_id		integer,
	last_few		integer,
	expiration		integer,
	card_type		varchar (16),
    square_id		varchar (64)
) begin


	declare card_id integer;


	select 
		id into card_id
    from 
		company_cards as ccs
	where
		(ccs.square_id = square_id);


	if (card_id is null) then
    
		insert into company_cards (
			company_id,
			last_few,
			expiration,
			card_type,
            square_id
		) values (
			company_id,
			last_few,
			expiration,
			card_type,
            square_id
		);
            
        select last_insert_id () into card_id;
        
    else
    
		update company_cards as ccs set 
			company_id = coalesce (company_id, ccs.company_id),
			last_few = coalesce (last_few, ccs.last_few),
			expiration = coalesce (expiration, ccs.expiration),
			card_type = coalesce (card_type, ccs.card_type),
            square_id = coalesce (square_id, ccs.square_id),
            last_updated = now()
		where
			id = card_id;

    end if;

	select card_id;
    
end??