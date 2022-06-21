start transaction;


drop table if exists companies;


create table options (
	id						integer primary key not null auto_increment,
	company_id				integer not null,
	code					integer not null,
	value					integer not null,

	date_created			datetime not null default current_timestamp,
	last_updated			datetime not null default current_timestamp,

	unique key id_unique (id),
	unique key name_unique (name),

	foreign key (company_id) references companies (id)
);

commit;
