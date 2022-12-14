start transaction;

alter table lookups
	add column `description` varchar(64) default null,
    add column date_created datetime default now(),
    add column last_updated datetime default now();
    
update lookups set `description` = "State / Territory" where id in (10, 189);
update lookups set `description` = "Province / Territory" where id in (32);

commit;