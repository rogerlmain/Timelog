use bundion;


-- 	update logging set id = 507 where id = 506;
-- 	alter table logging auto_increment = 508;

-- 	insert into logging values (null, 101, 143, 179, null, 'General duties', 0, '2023-4-3 13:00:00', '2023-2-8 17:30:00');


delete from logging where id = 685;

update logging set notes = "Razia re: Maggie Naylor" where id = 759;

update logging set client_id = 136 where id = 499;
update logging set project_id = 179 where id in (659);

update logging set start_time = '2023-03-28 11:45:00' where id = 743;
update logging set end_time = '2023-03-31 07:45:00' where id = 769;

select * from logging order by id desc;