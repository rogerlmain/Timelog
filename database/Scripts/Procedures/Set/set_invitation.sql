start transaction;

drop procedure if exists save_invitation;
drop procedure if exists set_invitation;

delimiter ??

create procedure set_invitation (
    company_id			integer,
	host_id				integer,
	invitee_name		varchar (32),
	invitee_email		varchar (320),
	invitee_account_id	integer
) begin

	declare invitation_id int;
    
    select
		inv.id into invitation_id
	from
		invitations as inv
	where
		(inv.company_id = company_id) and
        (inv.invitee_email = invitee_email);
        
	if (invitation_id is null) then
    
		insert into invitations (
			company_id,
			host_id,
			invitee_name,
			invitee_email,
			invitee_account_id,
			date_created,
			last_updated
		) values (
			company_id,
			host_id,
			invitee_name,
			invitee_email,
			invitee_account_id,
			now(),
			now()
		);
        
        select last_insert_id() into invitation_id;
        
    else
    
		update invitations as inv set 
			invitee_account_id = coalesce (invitee_account_id, inv.invitee_account_id),
			last_updated = now()
		where inv.id = invitation_id;
    
    end if;

	call get_invitations (invitation_id, null, null);

end??

