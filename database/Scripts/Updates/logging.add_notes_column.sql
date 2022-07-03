start transaction;

alter table logging add column notes text after project_id;

select * from logging;

commit;
#rollback;