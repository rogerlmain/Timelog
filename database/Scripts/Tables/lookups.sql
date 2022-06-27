start transaction;

drop table if exists lookups;

create table lookups (
	id				integer not null primary key auto_increment,
    reference_id	integer,	-- optional, depending on the lookup
    category_id		integer not null,
    short_name		varchar (40) not null,
    long_name		varchar (128),
    
    foreign key (category_id) references lookup_categories (id)
);

commit;