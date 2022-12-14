use timelog;

start transaction;

drop table if exists invitations;

create table invitations (

	id					integer primary key not null auto_increment,
    company_id			integer,
	host_id				integer,
	invitee_name		varchar (32),
	invitee_email		varchar (320),
	invitee_account_id	integer default null,
	date_created		datetime,
	last_updated		datetime,
    
    foreign key (company_id) references companies (id),
	foreign key (host_id) references accounts (id),
	foreign key (invitee_account_id) references accounts (id)
	
);

commit;
