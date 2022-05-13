import * as common from "classes/common";

import React from "react";
import BaseControl from "controls/abstract/base.control"

import { get_values } from "classes/common";


const header_value = -1;


export default class SelectList extends BaseControl {


	state = { selected_value: 0 }

	list = React.createRef ();


	static defaultProps = {

		id: null,
		data: null,

		idField: null,
		textField: null,

		headerText: null,
		headerSelectable: false,
		hasHeader: false,

		value: null,

		onChange: null

	}// defaultProps;

    
	/********/


	header_visible () {
		let result = (
			(common.isset (this.props.headerText) || (this.props.hasHeader)) && 
			((this.state.selected_value == 0) || (this.props.headerSelectable))
		);
		return result;
	}// headser_visible;


	select_options () {

		if (common.is_null (this.props.data)) return null;

		let is_array = Array.isArray (this.props.data);
		let option_list = is_array ? this.props.data : (common.is_object (this.props.data) ? get_values (this.props.data) : null);

		let result = option_list.map (item => {

			let text_field = common.is_function (this.props.textField) ? this.props.textField (item) : item [this.props.textField];
			let key = is_array ? item [this.props.idField] : common.get_key (this.props.data, item);

			return <option value={key} key={key}>{text_field}</option>

		});
		return result;
	}// select_options;


	/********/


	componentDidMount () {
		this.setState ({ selected_value: common.zero_value (this.props.value) });
	}// componentDidUpdate;


	shouldComponentUpdate (new_props) {
		if (this.props.value != new_props.value) {
			this.setState ({ selected_value: common.zero_value (new_props.value) });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


    render () {

		let selectedValue = common.coalesce (this.state.selected_value, this.props.value, header_value);

        return (
            <select id={this.props.id} name={this.props.id} ref={this.list} value={selectedValue} className={this.props.className} style={this.props.style}

 				onChange={(event) => {
					let value = parseInt (event.target.value);
					this.setState ({ selected_value: value }, () => this.execute (this.props.onChange, event));
					return true;
				}}>


				{this.header_visible () &&
				
					<option key="placeholder" style={{ fontStyle: "italic" }} value={header_value}>{this.props.headerText}</option>}

				{this.props.children}
				{this.select_options (this.props.data, this.props.textField, this.props.idField)}

            </select>
        );

    }// render;
	
	
}// SelectList;


