/********/


export const access_token = "EAAAENzB7zMQb2M5FW6MpbnIMXfvwLdonwGI9XxqtkwT86LvxuWpW4N_SyI67cjJ";

export const application_id = "sandbox-sq0idb-i9_IjjiYVUfBsBoNCFh9LA";
export const location_id = "RMPCInc";

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


/********/


export const stores = {
	clients: "clients"
}// stores;


/********/


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


/**** Dates ****/


export const date_formats = {
	full_date			: "w, MMMM d, yyyy",
	full_datetime		: "w, MMMM d, yyyy - H:mm ap",
	timestamp			: "H:mm ap",
	database_date		: "yyyy-MM-dd",
	database_timestamp	: "yyyy-MM-dd HH:mm"
}// date_formats;


export const date_rounding = {
	down	: -1,
	off		: 0,
	up		: 1
}// date_rounding;


/**** Images ****/


export const eyecandy_images = {
	small: "client/resources/images/indicators/small.gif",
	medium: "client/resources/images/indicators/medium.gif"
}// eyecandy_images;


export const credit_card_images = {
	amex		: "client/resources/images/credit_cards/amex.png",
	visa		: "client/resources/images/credit_cards/visa.png",
	mastercard	: "client/resources/images/credit_cards/mastercard.png",
	discover	: "client/resources/images/credit_cards/discover.png",
	jcb			: "client/resources/images/credit_cards/jcb.png",
	unionpay	: "client/resources/images/credit_cards/unionpay.png"
}// credit_card_images;


export const credit_card_masks = {
	amex	: "**** ****** *****",
	other	: "**** **** **** ****"
}// card_masks;


export const credit_card_names = {
	amex		: "American Express",
	visa		: "Visa",
	mastercard	: "Mastercard",
	discover	: "Discover",
	jcb			: "JCB",
	unionpay	: "UnionPay"
}// credit_card_names;


export const credit_card_types = {
	amex		: "amex",
	visa		: "visa",
	mastercard	: "mastercard",
	discover	: "discover",
	jcb			: "jcb",
	unionpay	: "unionpay",
	other		: "other"
}// credit_card_types;


/********/


export const account_types = {
	deadbeat	: 10,
	freelance	: 20,
	company		: 30,
	corporate	: 40,
	enterprise	: 50,
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
	animation_speed: 1
}// setting_types;


export const option_types = {
	granularity		: 1,
	start_rounding	: 2,
	end_rounding	: 3,
	client_limit	: 4,
	project_limit	: 5,
}// option_types;


/**** Default Settings and Options ****/


export const default_settings = {
	animation_speed: 500
}// default_settings;


export const default_options = {
	granularity: 1,
	start_rounding: date_rounding.off,
	end_rounding: date_rounding.off,
	client_limit: 1,
	project_limit: 1
}// default_options;


export const globals = {

	debugging: true,

	main: null,
	master: null,
	clients_page: null,
	projects_page: null,

}// globals;


