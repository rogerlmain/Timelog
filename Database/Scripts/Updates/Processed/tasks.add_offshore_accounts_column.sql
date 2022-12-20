alter table tasks drop foreign key fk_task_to_account;
alter table tasks drop foreign key fk_task_to_status;

alter table tasks drop column task_type_id;
alter table tasks drop column assignee_id;
alter table tasks drop column status_id;
alter table tasks drop column `name`;
alter table tasks drop column `description`;

alter table tasks add column offshore_accounts varchar (2048) after project_id;

drop table task_status_type;

