start transaction;

insert into lookups values 
	(null, 40, 2, "ON", "Ontario", "Province", true, now(), now()),
	(null, 40, 2, "QC", "Quebec", "Province", true, now(), now()),
	(null, 40, 2, "NS", "Nova Scotia", "Province", true, now(), now()),
	(null, 40, 2, "NB", "New Brunswick", "Province", true, now(), now()),
	(null, 40, 2, "MB", "Manitoba", "Province", true, now(), now()),
	(null, 40, 2, "BC", "British Columbia", "Province", true, now(), now()),
	(null, 40, 2, "PE", "Prince Edward Island", "Province", true, now(), now()),
	(null, 40, 2, "SK", "Saskatchewan", "Province", true, now(), now()),
	(null, 40, 2, "AB", "Alberta", "Province", true, now(), now()),
	(null, 40, 2, "NL", "Newfoundland and Labrador", "Province", true, now(), now()),
	(null, 40, 2, "NT", "Northwest Territories", "Territory", true, now(), now()),
	(null, 40, 2, "YT", "Yukon", "Territory", true, now(), now()),
	(null, 40, 2, "NU", "Nunavut", "Territory", true, now(), now());

commit;

select * from lookups where reference_id = 40;