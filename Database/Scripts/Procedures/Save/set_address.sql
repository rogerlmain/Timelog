start transaction;

drop procedure if exists save_address;

delimiter ??

create procedure save_address (

	address_id integer,
	company_id integer,
	street_address varchar (128) ,
	additional varchar (128) ,
	city varchar (64) ,
	state_id integer,
	country_id integer,
	postcode varchar (16)

) begin

    if (address_id is null) then
    
		insert into addresses values (
			address_id,
			company_id,
			street_address,
			additional,
			city,
			state_id,
			country_id,
			postcode,
			now(),
			now()
		);

		select last_insert_id () as address_id;
        
	else
    
		update accounts as acc set
 			adr.address_id = coalesce (address_id, adr.address_id),
			adr.company_id = coalesce (company_id, adr.company_id),
			adr.street_address = coalesce (street_address, adr.street_address),
			adr.additional = coalesce (additional, adr.additional),
			adr.city = coalesce (city, adr.city),
			adr.state_id = coalesce (state_id, adr.state_id),
            adr.country_id = coalesce (country_id, adr.country_id),
            adr.postcode = coalesce (postcode, adr.postcode)
		where
			adr.id = address_id;
    
		select address_id;

	end if;

end ??