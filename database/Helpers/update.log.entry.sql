delete from logging where id = 328;

update logging set notes = '#122 & #123' where id = 323;
update logging set start_time = '2022-11-11 9:00:00' where id = 327;
update logging set end_time = null where id = 327;

select * from logging order by id desc;


