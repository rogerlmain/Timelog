start transaction;

drop table if exists company_accounts;

create table company_accounts (
	id			integer primary key not null auto_increment,
    account_id	integer not null,
    company_id 	integer not null,
    
    foreign key (account_id) references accounts (id),
    foreign key (company_id) references companies (id)
);

commit;