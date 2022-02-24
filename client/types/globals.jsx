import * as common from "classes/common";


const default_settings = {
	animation_delay: 500,
	animation_speed: 500, //1750
}// default_settings;


const settings_cookie = () => {
	let settings = common.get_cookie ("settings");
	if (common.is_null (settings)) return default_settings;
	return JSON.parse (settings);
}// settings_cookie;


export const globals = {

	debugging: true,

	main: null,
	clients_page: null,
	projects_page: null,

	current_account: null,

	settings: ((() => {

		let settings = settings_cookie ();

		return {
			animation_delay: settings.animation_delay,
			animation_speed: settings.animation_speed
		}

	})())/* settings */,

	set_setting: (name, value) => {
		common.set_cookie ("settings", JSON.stringify (globals.settings));

		// fetch (to set user preferences in the database - later)

	}// set_setting;

}// globals;