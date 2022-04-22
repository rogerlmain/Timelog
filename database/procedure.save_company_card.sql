start transaction;

drop procedure if exists save_company_card;

delimiter ??

create procedure save_company_card (
    company_id		integer,
	last_few		integer,
	expiration		integer,
	card_type		varchar (16)
) begin


	declare card_id integer;


	select 
		id into card_id
    from 
		company_cards as ccs
	where
		(ccs.company_id = company_id) and
		(ccs.last_few = last_few) and
		(ccs.expiration = expiration) and
		(ccs.card_type = card_type);


	if (card_id is null) then
    
		insert into company_cards (
			company_id,
			last_few,
			expiration,
			card_type
		) values (
			company_id,
			last_few,
			expiration,
			card_type
		);
            
        select last_insert_id () into card_id;
        
    else
    
		update company_cards as ccs set 
			company_id = coalesce (company_id, css.company_id),
			last_few = coalesce (last_few, css.last_few),
			expiration = coalesce (expiration, css.expiration),
			card_type = coalesce (card_type, css.card_type)
		where
			id = card_id;

    end if;

	select card_id;
    
end??