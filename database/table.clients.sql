start transaction;

create table clients (

	id 				integer primary key not null auto_increment,
	company_id		int default null,
	name			varchar (64) not null,
	description		varchar (255) default '',
	date_created	datetime not null default current_timestamp,
	last_updated	datetime not null default current_timestamp,
	deleted			boolean not null default false,

	foreign key (company_id) references companies (id)

);

commit;
