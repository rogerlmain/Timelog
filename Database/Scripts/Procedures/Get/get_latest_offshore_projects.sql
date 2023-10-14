start transaction;

drop procedure if exists get_latest_offshore_tasks;
drop procedure if exists get_latest_offshore_projects;


delimiter ??

create procedure get_latest_offshore_projects (client_id varchar (64))
begin

	select distinct
        itm.project_id,
		itm.type,
		itm.offshore_id,
		itm.token
	from 
		(
			select
				log.project_id,
                ost.type,
                ost.offshore_id,
                ost.token
			from
				logging as log
			join
				offshore_tokens as ost
			on
				ost.id = log.offshore_token_id
			where
				(log.client_id = client_id)
			order by
				log.start_time desc
		) as itm
	limit 10;


end??

delimiter ;

commit;