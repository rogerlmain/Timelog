import { date_rounding } from "client/classes/types/constants";


export const toggled = {
	false	: 1,
	true	: 2,
}// toggled;


/********/


export const option_types = {
	granularity		: 1,
	start_rounding	: 2,
	end_rounding	: 3,
	client_limit	: 4,
	project_limit	: 5,
	billing_option	: 6,
	default_rate	: 7,
	rounding_option	: 8,
	editing_option	: 9,
}// option_types;


/********/


export const deadbeat_options = {
	granularity: 1,
	start_rounding: date_rounding.off,
	end_rounding: date_rounding.off,
	client_limit: 1,
	project_limit: 1,
	billing_option: toggled.false,
	rounding_option: toggled.false,
}// deadbeat_options;


export const freelance_options = {
	granularity: 2,
	start_rounding: date_rounding.off,
	end_rounding: date_rounding.off,
	client_limit: 5,
	project_limit: 5,
	billing_option: 2,
	billing_option: toggled.false,
	rounding_option: toggled.false,
}// freelance_options;


export const company_options = {
	granularity: 2,
	start_rounding: date_rounding.off,
	end_rounding: date_rounding.off,
	client_limit: 1,
	project_limit: 1,
	billing_option: 2,
	billing_option: toggled.false,
	rounding_option: toggled.false,
}// company_options;


export const corporate_options = {
	granularity: 3,
	start_rounding: date_rounding.off,
	end_rounding: date_rounding.off,
	client_limit: 1,
	project_limit: 1,
	billing_option: 2,
	billing_option: toggled.false,
	rounding_option: toggled.false,
}// corporate_options;


export const enterprise_options = {
	granularity: 4,
	start_rounding: date_rounding.off,
	end_rounding: date_rounding.off,
	client_limit: 1,
	project_limit: 1,
	billing_option: 2,
	billing_option: toggled.false,
	rounding_option: toggled.false,
}// enterprise_options;


