export const vertical_alignment = {
	top: "flex-start",
	middle: "center",
	center: "center",
	bottom: "flex-end"
}// vertical_alignment;


export const horizontal_alignment = {
	left: "left",
	center: "center",
	right: "right"
}// horizontal_alignment;


/********/


export const debugging = true;


export const space = " ";
export const blank = "";
export const empty = blank;

export const comma = ",";
export const underscore = "_";
export const dash = "-";
export const asterisk = "*";
export const minus = dash;

export const hidden_zindex = -1;	// zIndex to put unseen items behind the page
export const visible_zindex = 1;



/**** Dates ****/


export const date_formats = {
	full_date			: "w, MMMM d, yyyy",
	full_datetime		: "w, MMMM d, yyyy - H:mm ap",
	timestamp			: "H:mm ap",
	database_date		: "yyyy-MM-dd",
	database_timestamp	: "yyyy-MM-dd HH:mm"
}// date_formats;


export const date_rounding = {
	down	: "down",
	off		: "off",
	up		: "up"
}// date_rounding;


/**** Images ****/


export const eyecandy_images = {
	small: "client/resources/images/data.indicator.gif"
}// eyecandy_images;


export const credit_card_images = {
	amex		: "client/resources/images/credit_cards/amex.png",
	visa		: "client/resources/images/credit_cards/visa.png",
	mastercard	: "client/resources/images/credit_cards/mastercard.png",
	discover	: "client/resources/images/credit_cards/discover.png",
	jcb			: "client/resources/images/credit_cards/jcb.png",
	unionpay	: "client/resources/images/credit_cards/unionpay.png"
}// credit_card_images;


/********/


export const account_types = {
	free		: {value: 10, title: "Free"},
	freelance	: {value: 20, title: "Freelance"},
	company		: {value: 30, title: "Company"},
	corporate	: {value: 40, title: "Corporate"},
	enterprise	: {value: 50, title: "Enterprise"}
}// account_types;


export const admin_types = {
	corporate: 1,
	programmer: 2
}// admin_types;


export const directions = {
	left: "left",
	right: "right",
	up: "up",
	down: "down"
}// directions;


export const signing_state = {
	signed_in: "signed_in",
	signed_out: "signed_out",
	pending: "pending",
	failed: "failed"
}// signing_state;


/********/


export let text_highlights = {
	error: { color: "red" },
	warning: { color: "#D86500" }
}// text_highlights;


/**** Local Settings Objects ****/


export const credential_types = {
	account_id			: "account_id",
	account_type		: "account_type",
	administrator_type	: "administrator_type",
	square_id			: "square_id",
	company_id			: "company_id",
	email_address		: "email_address",
	first_name			: "first_name",
	last_name			: "last_name",
	username			: "username"
}// credential_types;

export const setting_types = {
	animation_speed: "animation_speed"
}// setting_types;


export const option_types = {
	granularity		: "granularity",
	rounding		: "rounding",
	start_rounding	: "start_rounding",
	end_rounding	: "end_rounding"
}// option_types;


/**** Default Settings and Options ****/


export const default_settings = {
	animation_speed: 500
}// default_settings;


export const default_options = {
	granularity: 1,
	rounding: date_rounding.off
}// default_options;


export const globals = {

	debugging: true,

	main: null,
	master: null,
	clients_page: null,
	projects_page: null,

}// globals;


