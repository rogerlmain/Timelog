import React from "react";
import BaseControl from "client/controls/base.control";

import { globals } from "types/globals";


export default class SettingsPanel extends BaseControl {


	render () {
		return (
			<div className="one-piece-form popup-window-form">


				{/*  DEPRECATED - NOT CURRENTLY IN USE  */}

				<label htmlFor="animation_delay">Animation Delay</label>
				<input type="text" id="animation_delay" defaultValue={globals.settings.animation_delay}
					onChange={(event) => {
						globals.set_setting ("animation_delay", parseInt (event.target.value));
						globals.master_panel.forceUpdate ();
					}}>
				</input>

				{/*  END  */}


				<label htmlFor="animation_speed">Animation Speed</label>
				<input type="text" id="animation_speed" defaultValue={globals.settings.animation_speed}
					onChange={(event) => {
						globals.set_setting ("animation_speed", parseInt (event.target.value));
						globals.master_panel.forceUpdate ();
					}}>
				</input>

			</div>
		);
	}// render;


}// SettingsPanel;