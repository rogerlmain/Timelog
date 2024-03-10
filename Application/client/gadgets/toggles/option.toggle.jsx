import * as constants from "client/classes/types/constants";

import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import ToggleSwitch from "client/controls/toggle.switch";

import CompanyStorage from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import { is_null, isset, not_set } from "client/classes/common";
import { MasterContext } from "client/classes/types/contexts";
import { option_types } from "client/classes/types/options";


export default class OptionToggle extends BaseControl {

	toggle_switch = React.createRef ();

	state = { 
		index: 0,
		value: null 
	}/* state */

	static contextType = MasterContext;

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

	constructor (props) {
		super (props);
		this.state.value = props.value ?? OptionsStorage.get (this.props.option);
	}// constructor;


	change_handler = new_value => {

		let key_name = option_types?.get_key (this.props.option);
		let current_value = OptionsStorage [key_name] (CompanyStorage.active_company_id ());

		this.state.value = new_value;

		// if (this.props.billable && (this.toggle_switch.current.option_index (this.state.value) > this.toggle_switch.current.option_index (current_value))) {
		// 	this.props.parent.setState ({ 
		// 		cc_form: {
		// 			option: this.props.option,
		// 			value: this.state.value,
		// 			onSubmit: () => this.props.onPaymentConfirmed (this.state.value),
		// 			onCancel: () => this.setState ({ value: current_value })
		// 		}/* cc_form */
		// 	});
		// 	return true;
		// }// if;

		this.props.onPaymentConfirmed (this.state.value);

		this.execute (this.props.onChange, new_value);

	}// change_handler;


	/********/


	option_items () {

		let result = null;
		let index = 1;

		if (isset (this.props.children)) {
			if (is_null (result)) result = new Array ();
			this.props.children.map (child => result.push (child));
		}// if;

		if (isset (this.props.values)) {
			for (let value of this.props.values) {
				if (is_null (result)) result = new Array ();
				result.push (<option key={`${this.props.id}_${index++}`} value={this.props.values.indexOf (value)}>{value}</option>);
			}// for;
		}// if;

		return result;

	}// option_items;


	/********/


	componentDidMount () { 
		if (not_set (this.props.id)) throw "OptionToggle requires an ID";
	}// componentDidMount;


	shouldComponentUpdate (new_props) {
		if (new_props.value != this.props.value) {
			this.setState ({ value: new_props.value });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {

		if (is_null (this.props.id)) throw "OptionToggle requires an ID";
		if (is_null (this.props.option)) throw `OptionToggle "${id}" requires an option`;

		let id = `${this.props.id}_toggle_option`;

		return <Container>
			<label htmlFor={id}>{this.props.title}</label>
			<ToggleSwitch id={id} ref={this.toggle_switch} value={this.state.value} singleStep={true} onChange={this.change_handler.bind (this)}>{this.option_items ()}</ToggleSwitch>
		</Container>

	}// render;

}// OptionToggle;

