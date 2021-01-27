import { settings } from "cluster";
import * as common from "components/classes/common";


interface settingsInterface {
	animation_delay: number,
	animation_speed: number
}// animation_speed;


const default_settings: settingsInterface = {
	animation_delay: 500,
	animation_speed: 2000
}// default_settings;


const settings_cookie = (): settingsInterface => {
	let settings = common.get_cookie ("settings");
	if (common.is_null (settings)) return default_settings;
	return JSON.parse (settings);
}// settings_cookie;


export const globals = {

	main_page: null,
	home_page: null,

	settings: ((() => {

		let settings = settings_cookie ();

		return {
			animation_delay: settings.animation_delay,
			animation_speed: settings.animation_speed
		}

	})())/* settings */,

	set_setting: (name: string, value: any) => {
		globals.settings [name] = value;
		common.set_cookie ("settings", JSON.stringify (globals.settings));

		// fetch (to set user preferneces in the database - later)

	}// set_setting;

}// globals;