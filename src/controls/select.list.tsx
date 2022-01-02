import React, { SyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "./base.control"

import * as common from "classes/common";


interface SelectListProps extends DefaultProps {

	data?: Array<any>;
	id_field?: string;
    text_field?: string;

	header_text?: string;
	
	use_header?: boolean;
	value?: number;

	onChange?: Function;

}// SelectListProps;


interface SelectListState extends DefaultState {
	selected_value: any;
}// SelectListState;


const placeholder_value = 0;
const header_value = -1;


export default class SelectList extends BaseControl<SelectListProps, SelectListState> {


	public list: React.RefObject<HTMLSelectElement> = React.createRef ();


	/********/


	public static defaultProps: SelectListProps = {
		data: null,
		id_field: null,
		text_field: null,
		header_text: null,
		use_header: false,
		value: null,
		onChange: null
	}// defaultProps;

    
	public state: SelectListState = {
		selected_value: null
	}// state;


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

				{this.props.use_header && <option key="placeholder" value={header_value} disabled={true} hidden={!this.props.use_header || (selectedValue != placeholder_value)}>{this.props.header_text}</option>}
				{this.props.children}
				{this.select_options (this.props.data, this.props.id_field, this.props.text_field)}

            </select>
        );

    }// render;

}// SelectList;
