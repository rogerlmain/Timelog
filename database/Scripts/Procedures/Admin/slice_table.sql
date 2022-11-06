start transaction;

drop procedure if exists slice_table;
drop procedure if exists admin_slice_table;

delimiter ??

create procedure admin_slice_table (tablename varchar(255), record_index integer) begin

	declare result integer;
    
    set @output = null;

	call admin_execute_statement (concat ("delete from ", tablename, " where id >= ", record_index));
	call admin_execute_statement (concat ("alter table ", tablename, " auto_increment = ", record_index));

end??

delimiter ;

commit;