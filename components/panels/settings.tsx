import React from "react";

import { globals } from "components/types/globals";

import BaseControl from "components/controls/base.control";


export default class SettingsPanel extends BaseControl<any> {


	public render () {
		return (
			<div className="two-piece-form">

				<label htmlFor="animation_delay">Animation Delay</label>
				<input type="text" id="animation_delay" value={globals.settings.animation_delay}
					onChange={(event) => {
						globals.set_setting ("animation_delay", parseInt (event.target.value));
					}}>
				</input>

				<label htmlFor="animation_speed">Animation Speed</label>
				<input type="text" id="animation_speed" value={globals.settings.animation_speed}
					onChange={(event) => {
						globals.set_setting ("animation_speed", parseInt (event.target.value));
					}}>
				</input>

			</div>
		);
	}// render;


}// SettingsPanel;