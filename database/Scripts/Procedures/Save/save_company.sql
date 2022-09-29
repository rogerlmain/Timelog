start transaction;

drop procedure if exists save_company;

delimiter ??

create procedure save_company (
	company_id				integer,
	company_name			varchar (64),
	company_description		text,
	address_id				integer,
	primary_contact_id		integer,
	secondary_contact_id	integer,
	square_id				varchar (64)
) begin

	if ((company_id is null) or (company_id = 0)) then
    
		insert into companies (
			`name`,
            `description`,
			address_id,
			primary_contact_id,
			secondary_contact_id,
			square_id
		) values (
			company_name,
            company_description,
			address_id,
			primary_contact_id,
			secondary_contact_id,
			square_id
		);
            
        select last_insert_id () as company_id;
        
    else
    
		update companies as cpy set 
			id = coalesce (company_id, cpy.id),
			`name` = coalesce (company_name, cpy.name),
            `description` = coalesce (company_description, cpy.description),
			address_id = coalesce (address_id, cpy.address_id),
			primary_contact_id = coalesce (primary_contact_id, cpy.primary_contact_id),
			secondary_contact_id = coalesce (secondary_contact_id, cpy.secondary_contact_id),
			square_id = coalesce (square_id, cpy.square_id)
		where
			id = company_id;

		select company_id;
    
    end if;

end??