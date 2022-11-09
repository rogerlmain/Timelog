start transaction;

drop procedure if exists get_logging_by_company;
drop procedure if exists get_active_logging_by_company;

delimiter ??

create procedure get_active_logging_by_company (company_id integer)
begin

	select 
    
		lgg.id as log_id,
        acc.id as account_id,
        clt.id as client_id,
        prj.id as project_id,
        clt.`name` as client_name,
        prj.`name` as project_name,
        
		acc.last_name,
        acc.first_name,
        acc.friendly_name,
        acc.email_address,
        acc.avatar,
        
        clt.`name` as client_name,
        
        lgg.start_time,
        (select sum(time_to_sec(timediff(log.end_time, log.start_time))) from logging as log where project_id = prj.id) as total_time,
        lgg.notes
        
	from 
		logging as lgg
	join
		accounts as acc
	on
		(acc.id = lgg.account_id)
	join
		company_accounts as cac
	on	
		(cac.account_id = acc.id)
	join
		companies as cpy
	on
		(cpy.id = cac.company_id)
	join
		clients as clt
	on 
		(clt.id = lgg.client_id)
	join
		projects as prj
	on
		(prj.id = lgg.project_id)
	where 
		(cpy.id = company_id) and
        (lgg.end_time is null)
	order by
		lgg.start_time desc;

end??

delimiter ;

commit;