start transaction;


create table projects (

	id integer primary key not null unique auto_increment,
	client_id int not null,
	`name` varchar (50) not null,
	code varchar (5) not null,
	`description` varchar (255) default null,
	date_created datetime not null default current_timestamp,
	last_updated datetime not null default current_timestamp,

	unique key client_name_combo (client_id, `name`)
	
);


commit;