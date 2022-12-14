start transaction;

drop procedure if exists get_invitations;
drop procedure if exists get_invitations_by_id;
drop procedure if exists get_invitation_by_id;

delimiter ??

create procedure get_invitation_by_id (invitation_id integer) begin

	select
		inv.id as invite_id,
		inv.company_id,
		inv.host_id,
        cpy.name as company_name,
        coalesce(acc.friendly_name, concat(acc.first_name, ' ', acc.last_name)) as host_name,
		inv.invitee_first_name,
		inv.invitee_last_name,
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
	where
		(invitation_id = inv.id);
	
end??