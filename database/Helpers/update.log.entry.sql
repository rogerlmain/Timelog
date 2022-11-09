update logging set 
-- 	notes = '#105 Finish teamster report' -- ,
	start_time = '2022-11-08 07:00:00',
	end_time = '2022-11-08 09:00:00' 
where 
	id = 309;

select * from logging order by id desc;
