import React from "react";

import BaseControl from "controls/base.control";
import ToggleSwitch from "controls/toggle.switch";

import AccountOptionsModel from "models/account.options";

import { globals } from "types/globals";
import { set_cookie } from "client/classes/common";



const current_account_granularity = 1;

const options = {
	granularity: 1
}



export default class SettingsPanel extends BaseControl {


	componentDidMount () {
		this.setState ({ granularity: current_account_granularity /* this.current_account.permissions [permission.granularity] */ });
	}// componentDidMount;


	render () {
		return (
			<div className="one-piece-form popup-window-form">

				<label htmlFor="animation_speed">Animation Speed</label>
				<input type="text" id="animation_speed" defaultValue={globals.settings.animation_speed}
					onChange={(event) => {
						globals.set_setting ("animation_speed", parseInt (event.target.value));
						globals.master_panel.forceUpdate ();
					}}>
				</input>

				<label htmlFor="granularity_setting">Granularity</label>
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
					<ToggleSwitch id="granularity" speed={200} value={this.state.granularity} onChange={async data => {
						if ((data.option > current_account_granularity) && !confirm ("It's gonna cost you - wanna pay?")) return false;
						set_cookie ("permissions", await AccountOptionsModel.save_option (options.granularity, data.option));
						return true;
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