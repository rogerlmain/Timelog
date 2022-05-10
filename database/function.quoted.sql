start transaction;

drop function if exists quoted;

delimiter ??

create function quoted (value_string text) returns text no sql begin
 
	return concat ('"', value_string, '"');
	 
end??


commit;