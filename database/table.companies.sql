start transaction;


drop table if exists companies;


create table companies (
	id						integer primary key not null auto_increment,
	name					varchar (64) not null,
	date_registered			datetime not null default current_timestamp,
	primary_contact_id		int not null,
	secondary_contact_id	int default null,
	date_created			datetime not null default current_timestamp,
	last_updated			datetime not null default current_timestamp,

	unique key id_unique (id),
	unique key name_unique (name),

	foreign key (address_id) references addresses (id),
	foreign key (primary_contact_id) references accounts (id),
	foreign key (secondary_contact_id) references accounts (id)

);

commit;
