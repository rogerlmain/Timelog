alter table offshore_accounts add column repository varchar(255) after token_id;

select * from offshore_accounts;