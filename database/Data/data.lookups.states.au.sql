start transaction;

insert into lookups values 
	(null, 13, 2, "ACT", "Australian Capital Territory", "Territory", true, now(), now()),
	(null, 13, 2, "NSW", "New South Wales", "State", true, now(), now()),
	(null, 13, 2, "NT", "Northern Territory", "Territory", true, now(), now()),
	(null, 13, 2, "QLD", "Queensland", "State", true, now(), now()),
	(null, 13, 2, "SA", "South Australia", "State", true, now(), now()),
	(null, 13, 2, "TAS", "Tasmania", "State", true, now(), now()),
	(null, 13, 2, "VIC", "Victoria", "State", true, now(), now()),
	(null, 13, 2, "WA", "Western Australia", "State", true, now(), now());

commit;

select * from lookups where reference_id = 13;