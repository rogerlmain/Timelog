import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import ToggleSwitch from "controls/toggle.switch";

import Options from "classes/storage/options";


export default class ToggleOption extends BaseControl {


	state = { value: null }


	static defaultProps = {
		id: null,
		option: null,
		parent: null,
		values: null,
		value: 0,
		onPaymentConfirmed: null
	}/* defaultProps */;


	/********/


	change_handler = new_value => {

		let current_value = Options [this.props.option] ();

		this.state.value = new_value + 1;

		if (this.state.value > current_value) {
			this.props.parent.setState ({ 
				cc_form: { 
					onSubmit: () => this.props.onPaymentConfirmed (this.state.value),
					onCancel: () => this.setState ({ value: current_value })
				}/* cc_form */
			});
			return true;
		}// if;

	}// change_handler;


	/********/


	option_items () {

		let result = null;
		let index = 0;

		for (let value of this.props.values) {
			if (common.is_null (result)) result = new Array ();
			result.push (<option key={`${this.props.id}_${index}`}>{value}</option>);
		}// for;
		return result;
	}// option_items;


	/********/


	componentDidMount () { 
		if (common.not_set (this.props.id)) throw "ToggleOption requires an ID";
		this.setState ({ value: Options [this.props.option] () });
	}// componentDidMount;


	render () {
		return <div className="one-piece-form">
			<label htmlFor="granularity_setting">Granularity</label>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
				<ToggleSwitch id="granularity" value={this.state.value - 1} singleStep={true} onChange={this.change_handler}>{this.option_items ()}</ToggleSwitch>
			</div>
		</div>
	}// render;

}// ToggleOption;

