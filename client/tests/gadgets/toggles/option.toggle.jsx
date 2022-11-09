import "classes/types/prototypes";
import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import OptionsStorage from "client/classes/storage/options.storage";
import OptionToggle from "client/gadgets/toggles/option.toggle";

import { option_types } from "client/classes/types/options";
import { date_rounding } from "client/classes/types/constants";


export default class OptionToggleTest extends BaseControl {


	render () { 
		return <div className="borderline" style={{ zIndex: 10, backgroundColor: "white" }}>
			<OptionToggle id="granularity" title="Granularity" values={["30 Mins", "15 Mins", "1 Min", "Truetime"]} value={OptionsStorage.granularity ()}
				option={option_types.granularity} parent={this} 
				onPaymentConfirmed={selected_option => {
					this.set_option (option_types.granularity, selected_option).then (() => this.setState ({
						start_rounding: date_rounding.off,
						end_rounding: date_rounding.off,
						granularity: selected_option
					}));
				}}>
			</OptionToggle>
		</div>
	}// render;


}// OptionToggleTest;