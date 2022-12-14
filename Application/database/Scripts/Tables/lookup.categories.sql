start transaction;

drop table if exists lookup_categories;

create table lookup_categories (
	id				integer not null primary key auto_increment,
    `description`	varchar (128)
);

commit;