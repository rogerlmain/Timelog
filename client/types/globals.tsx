import { Main } from "client/main";
import { AccountData } from "types/datatypes";

import * as common from "classes/common";

import MasterPanel from "client/master";
import ClientsPage from "pages/clients";
import ProjectsPage from "pages/projects";


/********/


interface SettingsInterface {
	animation_delay: number,
	animation_speed: number
}// animation_speed;


interface GlobalsInterface {

	main: Main,
	master_panel: MasterPanel,
	clients_page: ClientsPage,
	projects_page: ProjectsPage,

	current_account: AccountData,

	settings: SettingsInterface,
	set_setting: Function

}// GlobalsInterface;


/********/


const default_settings: SettingsInterface = {
	animation_delay: 500,
	animation_speed: 500, //1750
}// default_settings;


const settings_cookie = (): SettingsInterface => {
	let settings = common.get_cookie ("settings");
	if (common.is_null (settings)) return default_settings;
	return JSON.parse (settings);
}// settings_cookie;


export const globals: GlobalsInterface = {

	main: null,
	master_panel: null,
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

	set_setting: (name: string, value: any) => {
		globals.settings [name] = value;
		common.set_cookie ("settings", JSON.stringify (globals.settings));

		// fetch (to set user preferences in the database - later)

	}// set_setting;

}// globals;