import * as constants from "classes/types/constants";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";
import ToggleSwitch from "controls/toggle.switch";

import OptionsStorage from "client/classes/storage/options.storage";

import { get_key, is_null, isset, not_set } from "classes/common";
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

		let key_name = get_key (constants.option_types, this.props.option);
		let current_value = OptionsStorage [key_name] (this.context.company_id);

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
		let index = 1;

		if (isset (this.props.values)) {
			for (let value of this.props.values) {
				if (is_null (result)) result = new Array ();
				result.push (<option key={`${this.props.id}_${index++}`}>{value}</option>);
			}// for;
		}// if;

		if (isset (this.props.children)) {
			if (is_null (result)) result = new Array ();
			this.props.children.map (child => result.push (<option key={`${this.props.id}_${index++}`}>{child.props.children}</option>));
		}// if;

		return result;

	}// option_items;


	/********/


	componentDidMount () { 
		if (not_set (this.props.id)) throw "ToggleOption requires an ID";
		this.setState ({ value: this.props.value ?? OptionsStorage.get (this.props.option) });
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ value: new_props.value });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {

		if (is_null (this.props.id)) throw "ToggleOption requires an ID";
		if (is_null (this.props.option)) throw `ToggleOption "${id}" requires an option`;

		let id = `${this.props.id}_toggle_option`;

		return <Container>
			<label htmlFor={id}>{this.props.title}</label>
			<ToggleSwitch id={id} value={this.state.value - 1} singleStep={true} onChange={this.change_handler}>{this.option_items ()}</ToggleSwitch>
		</Container>

	}// render;

}// ToggleOption;

