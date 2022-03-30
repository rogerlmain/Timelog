start transaction;

drop procedure if exists execute_statement ;

delimiter ??

create procedure execute_statement (query_string text) begin

	set @query_string = query_string;
    
    prepare statement from @query_string;
    execute statement;
    
end??

delimiter ;

commit;