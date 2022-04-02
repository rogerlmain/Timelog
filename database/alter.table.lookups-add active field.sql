start transaction;

alter table lookups add column `active` boolean default true after `description`;
update lookups set `active` = false where id in (
	1,   17,  34,  37,  40,  44,  45,  
    57,  75,  81,  82,  86,  93,  99, 
    101, 102, 123, 147, 164, 168, 173, 
    194, 195, 197, 199
);

commit;
