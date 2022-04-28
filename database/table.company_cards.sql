start transaction;

drop table if exists company_cards;

create table company_cards (
	id				integer primary key not null auto_increment,
    company_id		integer,
	last_few		integer,
	expiration		integer,
	card_type		varchar (16),
    square_id		varchar (64),
	date_created	datetime default now(),
	last_updated	datetime default now(),
    
    foreign key (company_id) references companies (id)
);

commit;
