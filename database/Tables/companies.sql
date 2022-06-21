start transaction;


drop table if exists companies;


create table companies (
	id						integer primary key not null auto_increment,
	name					varchar (64) not null,
	address_id				integer,
	primary_contact_id		integer not null,
	secondary_contact_id	integer,
	square_id				varchar (64),
	active					boolean default true,

	date_created			datetime not null default current_timestamp,
	last_updated			datetime not null default current_timestamp,

	unique key id_unique (id),
	unique key name_unique (name),

	foreign key (address_id) references addresses (id),
	foreign key (primary_contact_id) references accounts (id),
	foreign key (secondary_contact_id) references accounts (id)

);

commit;
