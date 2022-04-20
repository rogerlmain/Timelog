import * as common from "classes/common";

import LocalStorage from "classes/local.storage";

import { default_settings, setting_types } from "classes/types/constants";


const store_name = "settings";


export default class Settings extends LocalStorage {

	static get (setting_id) {
		let settings = this.get_all ("settings");
		if (common.is_null (settings)) return null;
		return settings [setting_id];
	}// get;

	static animation_speed (value = null) { 
		if (common.is_null (value)) return Settings.get (setting_types.animation_speed) ?? default_settings.animation_speed;
		Settings.set_item (store_name, setting_types.animation_speed, value);
	};

}// Settings;