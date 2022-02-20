import React, { SyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "./base.control"

import * as common from "classes/common";


interface SelectListProps extends DefaultProps {

	data?: Array<any>;
	idField?: string;
    textField?: string;

	headerText?: string;
	headerSelectable?: boolean;
	useHeader?: boolean;

	value?: number;

	onChange?: Function;

}// SelectListProps;


interface SelectListState extends DefaultState {
	selected_value: any;
}// SelectListState;


const placeholder_value = 0;
const header_value = -1;


export default class SelectList extends BaseControl<SelectListProps, SelectListState> {


	private header_visible () {

		let result = (
		
			(common.isset (this.props.headerText) || (this.props.useHeader)) && 
			((this.state.selected_value == 0) || (this.props.headerSelectable))
		
		) 

		return result;
	
	}


	public list: React.RefObject<HTMLSelectElement> = React.createRef ();


	/********/


	public static defaultProps: SelectListProps = {

		data: null,

		idField: null,
		textField: null,

		headerText: null,
		headerSelectable: false,
		useHeader: false,

		value: null,

		onChange: null

	}// defaultProps;

    
	public state: SelectListState = { selected_value: 0 }


	public componentDidUpdate () {
		if (common.not_set (this.state.selected_value)) this.state.selected_value = (this.props.value ?? placeholder_value);
	}// componentDidUpdate;


    public render () {

		let selectedValue = common.coalesce (this.state.selected_value, this.props.value, header_value);

        return (
            <select id={this.props.id} name={this.props.id} ref={this.list} value={selectedValue} className={this.props.className} style={this.props.style}

 				onChange={(event: SyntheticEvent) => {
					let value = parseInt ((event.target as HTMLSelectElement).value);
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


