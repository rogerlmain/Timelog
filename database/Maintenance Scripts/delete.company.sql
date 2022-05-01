update companies set address_id = null where id > 2;

delete from addresses where id > 2;
delete from company_accounts where company_id > 2;
delete from options where company_id > 2;
delete from company_cards where company_id > 2;
delete from companies where id > 2;

select * from company_cards;
select * from company_accounts;
select * from addresses;

select * from companies;