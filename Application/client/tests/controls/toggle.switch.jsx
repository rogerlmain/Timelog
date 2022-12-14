import "classes/types/prototypes";
import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import ToggleSwitch from "client/controls/toggle.switch";


export default class Test extends BaseControl {


	render () { 
		return <div className="borderline">
			<ToggleSwitch id={this.props.id} value={"First"}

				onChange={value => alert (value)}>

				<option value="First">First</option>
				<option value="Second">Second</option>
				<option value="Third">Third</option>
				<option value="Fourth">Fourth</option>

			</ToggleSwitch>
		</div>
	}// render;


}// Test;