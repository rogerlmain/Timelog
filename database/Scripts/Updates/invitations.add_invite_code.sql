alter table invitations add column invite_code varchar(80) after host_id;
select * from invitations;
