start transaction;

drop procedure if exists get_invitations;

delimiter ??

create procedure get_invitations (
	invitation_id	integer,
	company_id		integer,
	invitee_email	varchar (320)
) begin

	select
		inv.company_id,
		inv.inviter_id,
		inv.invitee,
		inv.invitee_email,
		inv.account_id,
		inv.date_created,
		inv.last_updated
	from
		invitations as inv
	where
		(invitation_id = inv.id) or
		((invitation_id is null) and (
			((company_id = inv.company_id) or (company_id is null)) and
			((invitee_email = inv.invitee_email) or (invitee_email is null))
		));
	
end??