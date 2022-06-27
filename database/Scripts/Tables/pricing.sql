start transaction;


drop table if exists pricing;


create table pricing (
	id integer primary key not null auto_increment,
	code integer not null,
	value integer not null,
	price integer not null
);


commit;