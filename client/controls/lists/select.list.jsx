import React from "react";
import BaseControl from "client/controls/abstract/base.control"

import { isset, is_function, is_null, is_object } from "client/classes/common";


const header_value = -1;


export default class SelectList extends BaseControl {


	state = { selected_value: null }

	list = React.createRef ();


	static defaultProps = {

		id: null,
		data: null,

		idField: null,
		textField: null,

		header: null,
		headerSelectable: false,

		disabled: false,

		selectedValue: null,

		onChange: null

	}// defaultProps;

    
	/********/


	header_visible () {
		let result = isset (this.props.header) && ((this.state.selected_value == 0) || (this.props.headerSelectable));
		return result;
	}// headser_visible;


	select_options () {

		if (is_null (this.props.data)) return null;

		let is_array = Array.isArray (this.props.data);
		let option_list = is_array ? this.props.data : (is_object (this.props.data) ? this.props.data?.get_values () : null);

		let result = option_list.map (item => {

			let text_field = is_function (this.props.textField) ? this.props.textField (item) : item [this.props.textField];
			let value = is_array ? item [this.props.idField] : this.props.data?.get_key (item);

			return <option value={value} key={value}>{text_field}</option>

		});
		return result;
	}// select_options;


	/********/


	componentDidMount () {
		this.setState ({ selected_value: (this.props.selectedValue ?? 0) });
	}// componentDidUpdate;


	shouldComponentUpdate (new_props) {
		if (new_props.selectedValue != this.props.selectedValue) return !!this.setState ({ selected_value: (new_props.selectedValue ?? 0) });
		return true;
	}// shouldComponentUpdate;


    render () {

		let selected_value = this.state.selected_value ?? this.props.selectedValue ?? header_value;

        return <select id={this.props.id} name={this.props.id} ref={this.list} value={selected_value} disabled={this.props.disabled}
			
			className={this.props.className} style={this.props.style}

			onChange={event => this.setState ({ selected_value: event.target.value }, () => this.execute (this.props.onChange, event))}>

			{this.header_visible () && <option key="placeholder" style={{ fontStyle: "italic" }} value={header_value}>{this.props.header}</option>}

			{this.props.children}
			{this.select_options (this.props.data, this.props.textField, this.props.idField)}

		</select>

    }// render;
	
	
}// SelectList;


