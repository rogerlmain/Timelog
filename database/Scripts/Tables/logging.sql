start transaction;


drop table if exists entries;
drop table if exists logging;


create table logging (

	id integer primary key unique not null auto_increment,
	account_id	int not null,
    client_id	int,
	project_id	int,
	start_time	datetime not null,
	end_time	datetime default null,

	foreign key (account_id) references accounts (id),
    foreign key (client_id) references clients (id),
	foreign key (project_id) references projects (id)

);


commit;
