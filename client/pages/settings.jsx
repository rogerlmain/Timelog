import React from "react";

import Settings from "classes/storage/settings";
import Options from "classes/storage/options";

import BaseControl from "controls/base.control";
import ToggleSwitch from "controls/toggle.switch";

import OptionsModel from "models/options";

import { option_types, globals } from "types/globals";

import "resources/styles/pages.css";


export default class SettingsPanel extends BaseControl {


	componentDidMount () {
		this.setState ({ granularity: Options.granularity () });
	}// componentDidMount;


	render () {
		return (
			<div className="one-piece-form">

				<div className="full-row section-header">User Settings</div>

				<label htmlFor="animation_speed">Animation Speed</label>
				<input type="text" id="animation_speed" defaultValue={Settings.animation_speed ()} style={{ textAlign: "right" }}
					onChange={(event) => {
						globals.set_setting ("animation_speed", parseInt (event.target.value));
						globals.master_panel.forceUpdate ();
					}}>
				</input>

				<div className="full-row section-header">Account Options</div>

				<label htmlFor="granularity_setting">Granularity</label>
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
					<ToggleSwitch id="granularity" speed={Settings.animation_speed ()} value={this.state.granularity} onChange={async data => {
						if (data.option <= this.state.granularity) return true;
						if (confirm ("It's gonna cost you - wanna pay?")) { // TO DO - BUILD AND LINK TO BILLING POPUP WINDOW
							await OptionsModel.save_option (option_types.granularity, data.option);
							return true; 
						}// if;
						return false;
					}}>

						<option>1 Hr</option>
						<option>15 Mins</option>
						<option>1 Min</option>
						<option>Truetime</option>

					</ToggleSwitch>
				</div>

			</div>
		);
	}// render;


}// SettingsPanel;
