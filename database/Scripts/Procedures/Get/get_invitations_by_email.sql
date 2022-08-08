start transaction;

drop procedure if exists get_invitations_by_email;

delimiter ??

create procedure get_invitations_by_email (invitee_email varchar (320)) begin

	select
		inv.id as invite_id,
		inv.company_id,
		inv.host_id,
        cpy.name as company_name,
        coalesce(acc.friendly_name, concat(acc.first_name, ' ', acc.last_name)) as host_name,
		inv.invitee_name,
		inv.invitee_email,
		inv.invitee_account_id,
		unix_timestamp(inv.date_created) as date_created,
		unix_timestamp(inv.last_updated) as last_updated
	from
		invitations as inv
	left outer join
		companies as cpy
	on
		(cpy.id = inv.company_id)
	left outer join
		accounts as acc
	on
		(acc.id = inv.host_id)
	left outer join
		company_accounts as cac
	on
		(cac.account_id = inv.invitee_account_id)
	where 
		(invitee_email = inv.invitee_email) and
		(inv.invitee_account_id is null);
	
end??