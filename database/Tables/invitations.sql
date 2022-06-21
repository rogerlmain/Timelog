start transaction;

drop table if exists invitations;

create table invitations (
	id					integer primary key not null auto_increment,
    company_id			integer,
	inviter_id			integer,
	invitee				varchar (32),
	invitee_email		varchar (320),
	accepted_account_id	integer default null,
	date_created		datetime,
	last_updated		datetime,
    
    foreign key (company_id) references companies (id),
	foreign key (inviter_id) references accounts (id)
	foreign key (accepted_account_id) references accounts (id)
	
);

commit;