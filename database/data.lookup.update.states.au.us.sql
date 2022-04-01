start transaction;

update lookups set `description` = "State" where (id >= 200) and (id <= 262);
update lookups set `description` = "Territory" where id in (205, 212, 241, 249, 255, 257);
update lookups set `description` = "District" where id in (209);

commit;