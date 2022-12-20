delete from logging where id = 328;

update logging set notes = '#4715 - DEFECT - Atlanta VMWARE 400 login issue' where id in (360);

update logging set client_id = 136 where id = 336;
update logging set project_id = 162 where id = 336;

update logging set start_time = '2022-11-20 10:15:00' where id = 360;

update logging set end_time = '2022-12-16 11:30:00' where id = 419;

select * from logging order by id desc;