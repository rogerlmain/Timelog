drop table if exists offshore_tokens;

create table offshore_tokens (

	id integer not null auto_increment primary key,
    company_id integer,
    offshore_type varchar(4),
    offshore_token varchar(255),
    deleted boolean default false,
    date_created datetime default now(),
    last_updated datetime default now(),

    constraint fk_offshore_to_company foreign key (company_id) references companies (id)

);

select * from offshore_tokens;