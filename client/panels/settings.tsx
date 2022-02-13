import React from "react";

import { globals } from "client/types/globals";

import BaseControl from "client/controls/base.control";


export default class SettingsPanel extends BaseControl<any> {


	public render () {
		return (
			<div className="two-piece-form popup-window-form">

				<label htmlFor="animation_delay">Animation Delay</label>
				<input type="text" id="animation_delay" defaultValue={globals.settings.animation_delay}
					onChange={(event) => {
						globals.set_setting ("animation_delay", parseInt (event.target.value));
						globals.main_page.forceUpdate ();
					}}>
				</input>

				<label htmlFor="animation_speed">Animation Speed</label>
				<input type="text" id="animation_speed" defaultValue={globals.settings.animation_speed}
					onChange={(event) => {
						globals.set_setting ("animation_speed", parseInt (event.target.value));
						globals.main_page.forceUpdate ();
					}}>
				</input>

			</div>
		);
	}// render;


}// SettingsPanel;