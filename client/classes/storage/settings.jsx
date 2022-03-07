import LocalStorage from "classes/local.storage";
import { default_settings, setting_types } from "types/globals";
import { is_null, not_set } from "classes/common";


export default class Settings extends LocalStorage {

	static get (setting_id) {
		let settings = this.get_all ("settings");
		if (is_null (settings)) return null;
		for (let setting of settings) {
			if (not_set (setting)) continue;
			if (setting.id == setting_id) return setting.value;
		}// for;
		return null;
	}// get;

	static animation_speed = () => { 
		let result = Settings.get (setting_types.animation_speed) ?? default_settings.animation_speed;
		return result;
	};

}// Settings;