start transaction;

drop table if exists company_transactions;

create table company_transactions (
	id 				integer primary key not null auto_increment,
    account_id		integer,
    company_id		integer,
    product_id 		integer,
    product_type	enum ("item", "package"),
    transaction_id	varchar (192),
	card_id			varchar (64),
    date_created	datetime default now(),
    
    foreign key (account_id) references accounts (id),
    foreign key (company_id) references companies (id)
);

commit;
