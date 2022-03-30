import React from "react";
import BaseControl from "controls/abstract/base.control"

import { coalesce, isset, zero_value } from "classes/common";


const header_value = -1;


export default class SelectList extends BaseControl {


	static defaultProps = {

		data: null,

		idField: null,
		textField: null,

		headerText: null,
		headerSelectable: false,
		hasHeader: false,

		value: null,

		onChange: null

	}// defaultProps;

    
	state = { selected_value: 0 }


	list = React.createRef ();


	header_visible () {
		let result = (
			(isset (this.props.headerText) || (this.props.hasHeader)) && 
			((this.state.selected_value == 0) || (this.props.headerSelectable))
		);
		return result;
	}// headser_visible;


	componentDidMount () {
		this.setState ({ selected_value: zero_value (this.props.value) });
	}// componentDidUpdate;


	shouldComponentUpdate (new_props) {
		if (this.props.value != new_props.value) {
			this.setState ({ selected_value: zero_value (new_props.value) });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


    render () {

		let selectedValue = coalesce (this.state.selected_value, this.props.value, header_value);

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
				{this.select_options (this.props.data, this.props.idField, this.props.textField)}

            </select>
        );

    }// render;

}// SelectList;


