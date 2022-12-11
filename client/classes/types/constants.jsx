import React from "react";
//import { toggled } from "client/classes/storage/options.storage";


/********/


export const access_token = "EAAAENzB7zMQb2M5FW6MpbnIMXfvwLdonwGI9XxqtkwT86LvxuWpW4N_SyI67cjJ";

export const application_id = "sandbox-sq0idb-i9_IjjiYVUfBsBoNCFh9LA";
export const location_id = "RMPCInc";

export const tracing = false;

export const space = " ";
export const blank = "";
export const empty = blank;
export const empty_cell = <div style={{ width: "1px", height: "1px "}} />;

export const comma = ",";
export const underscore = "_";
export const dash = "-";
export const asterisk = "*";
export const minus = dash;

export const hidden_zindex = -1;	// zIndex to put unseen items behind the page
export const visible_zindex = 1;


/********/


export const stores = {
	clients: "clients",
	projects: "projects",
}// stores;


export const ranges = {
	start	: "start",
	end		: "end",
}// ranges;


/**** Alignments ****/


export const vertical_alignment = {
	top: "flex-start",
	middle: "center",
	center: "center",
	bottom: "flex-end",
	stretch: "stretch",
}// vertical_alignment;


export const horizontal_alignment = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
	stretch: "stretch",
}// horizontal_alignment;


/**** Money ****/


export const currency_symbol = {
	dollars	: "$",
	pounds	: "£",
	euro	: "€",
	yen		: "¥",
}// currency_symbol;


export const currencies = {
	dollars	: 1,
	pounds	: 2,
	euro	: 3,
	yen		: 4,
}// currencies;


/**** Dates ****/


export const date_formats = {
	full_date				: "w, MMMM d, yyyy",
	full_datetime			: "w, MMMM d, yyyy - H:mm ap",
	timestamp				: "H:mm ap",
	database_date			: "yyyy-MM-dd",
	database_timestamp		: "yyyy-MM-dd HH:mm:ss",
	detailed_datetime		: "w, MMMM ad yyyy, H:mm:ss ap",
	short_detailed_datetime	: "w, MMMM ad yyyy, H:mm ap",
	us_datetime				: "MM-dd-yyyy H:mm ap",
	report_datetime			: "w d, H:mm ap",
}// date_formats;


export const date_rounding = {
	down	: -1,
	off		: 0,
	up		: 1
}// date_rounding;


/**** Images ****/


export const eyecandy_images = {
	small: "resources/images/indicators/small.gif",
	medium: "resources/images/indicators/medium.gif"
}// eyecandy_images;


export const credit_card_images = {
	amex		: "resources/images/credit_cards/amex.png",
	visa		: "resources/images/credit_cards/visa.png",
	mastercard	: "resources/images/credit_cards/mastercard.png",
	discover	: "resources/images/credit_cards/discover.png",
	jcb			: "resources/images/credit_cards/jcb.png",
	unionpay	: "resources/images/credit_cards/unionpay.png"
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


export const account_type_names = {
	deadbeat	: "Demonstration",
	freelance	: "Freelance",
	company		: "Company",
	corporate	: "Corporate",
	enterprise	: "Enterprise",
}// account_type_names;


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


/********/


export let text_highlights = {
	error: { color: "red" },
	warning: { color: "#D86500" },
}// text_highlights;


/**** Local Settings Objects ****/


export const credential_fields = {
	account_id			: "account_id",
	account_type		: "account_type",
	administrator_type	: "administrator_type",
	avatar				: "avatar",
	square_id			: "square_id",
	company_id			: "company_id",
	email_address		: "email_address",
	first_name			: "first_name",
	last_name			: "last_name",
	friendly_name		: "friendly_name",
}// credential_fields;


export const setting_types = {
	animation_speed: 1
}// setting_types;


export const granularity_types = {
	hourly		: 1,
	quarterly	: 2,
	minutely	: 3,
	truetime	: 4,
}// granularity_types;


export const permissions = {
	admin	: 1,
	purchase: 2,
}// permissions;


export const data_errors ={
	duplicate: "ER_DUP_ENTRY",
}// data_errors;


/**** Default Settings and Options ****/


export const default_settings = {
	animation_speed: 1000, // 500,
}// default_settings;


export const globals = {
	main: null,
	master: null,
}// globals;


