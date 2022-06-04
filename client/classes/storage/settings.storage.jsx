import * as common from "classes/common";

import LocalStorage from "classes/local.storage";
import SettingsModel from "client/models/settings.model";

import { default_settings, setting_types } from "classes/types/constants";


const store_name = "settings";


export default class SettingsStorage extends LocalStorage {

	static get (setting_id) {
		let settings = this.get_all ("settings");
		if (common.is_null (settings)) return null;
		return settings [setting_id];
	}// get;

	static animation_speed (value = null) { 
		if (common.is_null (value)) return SettingsStorage.get (setting_types.animation_speed) ?? default_settings.animation_speed;
		SettingsStorage.set_item (store_name, setting_types.animation_speed, value);
		SettingsModel.save_setting (setting_types.animation_speed, value);
	}// animation_speed;

}// SettingsStorage;