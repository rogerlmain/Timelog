export enum vertical_alignment {
	top = "flex-start",
	middle = "center",
	center = "center",
	bottom = "flex-end"
}// vertical_alignment;


export enum horizontal_alignment {
	left = "left",
	center = "center",
	right = "right"
}// horizontal_alignment;


/********/


export interface account_type_object {
	title: string;
	value: number;
}// account_type_object;


export interface account_type {
	free: account_type_object;
	freelance: account_type_object;
	company: account_type_object;
	corporate: account_type_object;
	enterprise: account_type_object;
}// account_type;


/********/


export const debugging = true;


export const space = " ";
export const blank = "";
export const empty = blank;

export const comma = ",";
export const underscore = "_";

export const hidden_zindex = -1;	// zIndex to put unseen items behind the page
export const fade_zindex = 5;
export const popup_zindex = 10;


/********/


export const account_types: account_type = {
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


export const menu_items = {

	clients: "Clients",
	projects: "Projects",
	// team: "Team",
	tasks: "Tasks",
	// logging: "Logging",
	// history: "History",
	// account: "Account",

	map: function (method: any): any {
		if (method == null) return null;
		return Object.entries (this).map ((item) => {
			let key = (item.length >= 1) ? item [0] : null;
			let value = (item.length >=2) ? item [1] : null;
			if ((key == null) || (value == null) || (value instanceof Function)) return null;
			return method (key, value);
		});
	}// map;
	
}// menu_items;


/********/


export let text_highlights = {
	error: { color: "red" },
	warning: { color: "#D86500" }
}// text_highlights;