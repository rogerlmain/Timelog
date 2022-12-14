start transaction;

drop procedure if exists report_by_company;
drop procedure if exists report_by_client;

delimiter ??

create procedure report_by_client (company_id integer) 
begin

	select
		log.client_id,
		log.project_id,
		cpy.`name` as company_name,
		clt.`name` as client_name,
		prj.`name` as project_name,    
		sec_to_time(sum(time_to_sec(log.end_time) - time_to_sec(log.start_time))) as total_time
	from
		logging as log
	join
		accounts as acc
	on
		acc.id = log.account_id
	join
		company_accounts as cac
	on
		cac.account_id = acc.id
	join
		companies as cpy
	on
		cpy.id = cac.company_id
	join
		clients as clt
	on
		clt.id = log.client_id
	join
		projects as prj
	on
		prj.id = log.project_id
	where
		cpy.id = company_id
	group by
		log.client_id,
		log.project_id,
		company_name,
		client_name,
		project_name
	order by
		company_name,
		client_name,
		project_name;
        
	end??
    
    delimiter ;
    
    commit;