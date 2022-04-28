import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";
import ToggleSwitch from "controls/toggle.switch";

import Options from "classes/storage/options";

import { MainContext } from "client/classes/types/contexts";


export default class ToggleOption extends BaseControl {


	state = { value: null }


	static contextType = MainContext;

	static defaultProps = {

		id: null,
		option: null,

		parent: null,
		title: null,

		billable: true,

		values: null,
		value: 0,

		onChange: null,
		onPaymentConfirmed: null
		
	}/* defaultProps */;


	/********/


	change_handler = new_value => {

		let key_name = common.get_key (constants.option_types, this.props.option);
		let current_value = Options [key_name] (this.context.company_id);

		this.state.value = new_value + 1;

		if (this.props.billable && (this.state.value > current_value)) {
			this.props.parent.setState ({ 
				cc_form: {
					option: this.props.option,
					value: this.state.value,
					onSubmit: () => this.props.onPaymentConfirmed (this.state.value),
					onCancel: () => this.setState ({ value: current_value })
				}/* cc_form */
			});
			return true;
		}// if;

		this.execute (this.props.onChange, new_value);

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
		this.setState ({ value: this.props.value ?? Options.get (this.props.option) });
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ value: new_props.value });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {

		if (common.is_null (this.props.id)) throw "ToggleOption requires an ID";
		if (common.is_null (this.props.option)) throw `ToggleOption "${id}" requires an option`;

		let id = `${this.props.id}_toggle_option`;

		return <Container contentsOnly={true}>
			<label htmlFor={id}>{this.props.title}</label>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
				<ToggleSwitch id={id} value={this.state.value - 1} singleStep={true} onChange={this.change_handler}>{this.option_items ()}</ToggleSwitch>
			</div>
		</Container>

	}// render;

}// ToggleOption;
