start transaction;

drop procedure if exists slice_table;

delimiter ??

create procedure slice_table (tablename varchar(255), record_index integer) begin

	declare result integer;
    
    set @output = null;

	call execute_statement (concat ("delete from ", tablename, " where id >= ", record_index));
	call execute_statement (concat ("alter table ", tablename, " auto_increment = ", record_index));

end??

delimiter ;

commit;