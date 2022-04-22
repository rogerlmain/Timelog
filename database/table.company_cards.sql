start transaction;

drop table if exists company_cards;

create table company_cards (
	id				integer primary key not null auto_increment,
    company_id		integer,
	last_few		integer,
	expiration		integer,
	card_type		varchar (16),
	date_created	datetime,
	last_updated	datetime,
    
    foreign key (company_id) references companies (id)
);

commit;
