start transaction;

drop procedure if exists get_offshore_accounts;
drop procedure if exists get_offshore_accounts_by_company;

delimiter ??

create procedure get_offshore_accounts_by_company (company_id integer) begin

	select 
        ofa.`type`,
        ofa.offshore_id,
		ofa.token_id,
        ofa.repository,
        ofa.
	from 
		offshore_accounts as ofa
	where
		ofa.company_id = company_id;

end??