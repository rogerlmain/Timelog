import "types/prototypes";


export const setting_types = {
	animation_speed: 1
}// setting_types;


// Order is important - do not rearrange or insert - append only
// index correlates to database option code.
export const option_types = {
	granularity		: "granularity",
	start_rounding	: "start_rounding",
	end_rounding	: "end_rounding"
}// option_types;


export const default_settings = {
	animation_speed: 500
}// default_settings;


export const default_options = {
	granularity: 1,
	rounding: Date.rounding.off
}// default_options;


export const globals = {

	debugging: true,

	main: null,
	clients_page: null,
	projects_page: null,

}// globals;


/********/


export const record_key = (record, item) => {
	let result = Object.keys (record).indexOf (item) + 1;
	return result;
}// record_key;


export const option_key = (option_type) => { 
	let result = record_key (option_types, option_type);
	return result;
}// option_key;