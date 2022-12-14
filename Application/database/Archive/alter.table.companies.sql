start transaction;

alter table companies add column address_id integer after `name`;
alter table companies add constraint foreign key (address_id) references addresses (id);

commit;
