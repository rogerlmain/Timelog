start transaction;

drop procedure if exists save_invitation;

delimiter ??

create procedure save_invitation (
    company_id			integer,
	inviter_id			integer,
	invitee				varchar (32),
	invitee_email		varchar (320),
	account_id			integer
) begin

	declare invitation_id int;
    
    select
		inv.id into account_invitation_id
	from
		invitations as inv
	where
		(inv.company_id = company_id) and
        (inv.invitee_email = invitee_email);
        
	if (invitation_id is null) then
    
		insert into invitations (
			company_id,
			inviter_id,
			invitee,
			invitee_email,
			account_id,
			date_created,
			last_updated
		) values (
			company_id,
			inviter_id,
			invitee,
			invitee_email,
			account_id,
			now(),
			now()
		);
        
        select last_insert_id() into invitation_id;
        
    else
    
		update invitations as inv set 
			account_id = coalesce (account_id, inv.account_id),
			last_updated = now()
		where inv.id = invitation_id;
    
    end if;

	call get_invitations (account_id);

end??

