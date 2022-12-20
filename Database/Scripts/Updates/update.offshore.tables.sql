alter table offshore_tokens rename column offshore_type to `type`;
alter table offshore_tokens rename column offshore_token to token;

alter table offshore_accounts rename column offshore_token_id to token_id;

select * from offshore_accounts;
select * from offshore_tokens;