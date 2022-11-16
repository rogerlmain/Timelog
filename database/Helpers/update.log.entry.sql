delete from logging where id = 328;

update logging set notes = '#34 - Git integration' where id = 343;

update logging set client_id = 136 where id = 336;
update logging set project_id = 162 where id = 336;

update logging set start_time = '2022-11-14 7:00:00' where id = 340;
update logging set end_time = '2022-11-14 7:00:00' where id = 339;

select * from logging order by id desc;