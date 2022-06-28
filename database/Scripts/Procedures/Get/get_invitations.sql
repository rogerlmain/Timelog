start transaction;

drop procedure if exists get_invitations;

delimiter ??

create procedure get_invitations (
	invitation_id	integer,
	company_id		integer,
	invitee_email	varchar (320)
) begin

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
	where
		(invitation_id = inv.id) or
		((invitation_id is null) and (
			((company_id = inv.company_id) or (company_id is null)) and
			((invitee_email = inv.invitee_email) or (invitee_email is null))
		));
	
end??