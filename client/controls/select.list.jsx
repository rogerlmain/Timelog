import * as common from "classes/common";

import React, { SyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "./base.control"

import { iData } from "client/types/datatypes";


const placeholder_value = 0;
const header_value = -1;


export default class SelectList extends BaseControl {


	header_visible () {

		let result = (
		
			(common.isset (this.props.headerText) || (this.props.useHeader)) && 
			((this.state.selected_value == 0) || (this.props.headerSelectable))
		
		) 

		return result;
	
	}


	list = React.createRef ();


	/********/


	static defaultProps = {

		data: null,

		idField: null,
		textField: null,

		headerText: null,
		headerSelectable: false,
		useHeader: false,

		value: null,

		onChange: null

	}// defaultProps;

    
	state = { selected_value: 0 }


	componentDidUpdate () {
		if (common.not_set (this.state.selected_value)) this.state.selected_value = (this.props.value ?? placeholder_value);
	}// componentDidUpdate;


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
				{this.select_options (this.props.data, this.props.idField, this.props.textField)}

            </select>
        );

    }// render;

}// SelectList;


