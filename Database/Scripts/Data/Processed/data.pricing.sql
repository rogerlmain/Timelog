truncate pricing;

insert into pricing (`code`, `value`, price) values
    (1, 2, 299),
    (1, 3, 599),
    (1, 4, 999),

    (4, 2, 999),
    (4, 3, 1999),
    (4, 4, 2999),
    (4, 5, 3999),
	
    (5, 2, 999),
    (5, 3, 1999),
    (5, 4, 2999),
    (5, 5, 3999),
    
    (6, 2, 1999),
    (8, 2, 299);
    
select * from pricing;