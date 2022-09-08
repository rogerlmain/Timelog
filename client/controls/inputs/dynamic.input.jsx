import * as constants from "client/classes/types/constants";
import * as common from "client/classes/common";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";


export const dynamic_input_classname = "dynamic-input";


export default class DynamicInput extends BaseControl {

	componentDidMount () {
		if (common.is_empty (this.props.id)) throw "DynamicInput control requires an ID";
	}// componentDidMount;


	render () {

		let properties = {...this.props};

		delete properties.value;
		delete properties.id;
		delete properties.name;
		delete properties.defaultValue;

		return <div key={this.props.value} className={dynamic_input_classname} onBlur={event => event.target.validate ()} onChange={event => event.target.validate ()}>
			<input type="text" id={this.props.id} name={common.isset (this.props.name) ? this.props.name : this.props.id} 
				defaultValue={this.props.value || constants.blank} {...properties}>
			</input>
		</div>

	}// render;

}// render;