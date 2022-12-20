	start transaction;

drop procedure if exists save_invitation;
drop procedure if exists set_invitation;

delimiter ??

create procedure save_invitation (
	invite_id			integer,
    company_id			integer,
	host_id				integer,
	invitee_first_name	varchar (45),
	invitee_last_name	varchar (45),
	invitee_email		varchar (320),
	invitee_account_id	integer
) begin

	if (invite_id is null) then
    
		insert into invitations (
			company_id,
			host_id,
			invitee_first_name,
            invitee_last_name,
			invitee_email,
			invitee_account_id,
			date_created,
			last_updated
		) values (
			company_id,
			host_id,
			invitee_first_name,
            invitee_last_name,
			invitee_email,
			invitee_account_id,
			now(),
			now()
		);
        
        select last_insert_id() into invite_id;
        
    else
    
		update invitations as inv set 
			invitee_account_id = coalesce (invitee_account_id, inv.invitee_account_id),
			last_updated = now()
		where inv.id = invite_id;
    
    end if;

	call get_invitation_by_id (invite_id);

end??

