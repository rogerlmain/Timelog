start transaction;

alter table logging add column billed bit after notes;

select * from logging;

commit;