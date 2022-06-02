start transaction;

drop table if exists addresses;

create table addresses (
	id				integer primary key not null auto_increment,
    company_id		integer,
    street_address	varchar (128),
    additional		varchar (128),
    city			varchar (64),
    state_id		integer,
    country_id		integer,
    postcode		varchar (16),
	date_created	datetime,
	last_updated	datetime,
    
    foreign key (company_id) references companies (id),
    foreign key (state_id) references lookups (id),
    foreign key (country_id) references lookups (id)
);

commit;