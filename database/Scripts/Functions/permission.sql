start transaction;

drop function if exists permission;
drop function if exists permissions;

delimiter ??

create function `permission` (

	permissions bigint unsigned,
	`index` integer

) returns boolean reads sql data begin

	if ((permissions & (1 << `index`) > 0) || (permissions & (1 << 63) > 0)) then 
		return true; 
	end if;

	return false;

end ??

delimiter ;

commit;