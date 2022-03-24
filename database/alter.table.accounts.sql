start transaction;

alter table accounts drop column company_id;

commit;