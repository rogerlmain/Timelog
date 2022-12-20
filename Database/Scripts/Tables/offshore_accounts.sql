drop table if exists offshore_accounts;

create table offshore_accounts (

	id integer not null auto_increment primary key,
    account_id integer,
    offshore_token_id integer,
    offshore_account varchar(255),
    deleted boolean default false,
    date_created datetime default now(),
    last_updated datetime default now(),

	constraint fk_offshore_to_token foreign key (offshore_token_id) references offshore_tokens (id),
    constraint fk_offshore_to_account foreign key (account_id) references accounts (id)
    
);

select * from offshore_accounts;
