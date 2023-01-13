-- insert into logging values (null, 101, 136, 162, null, 'Set up live debugging', 0, '2023-1-6 08:00:00', null);

delete from logging where id = 328;

update logging set notes = 'Update JRE for VMWare' where id = 448;

update logging set client_id = 136 where id = 447;
update logging set project_id = 162 where id = 447;

update logging set start_time = '2023-01-08 11:15:00' where id = 461;
update logging set end_time = '2023-01-11 20:45:00' where id = 466;

select * from logging order by id desc;
