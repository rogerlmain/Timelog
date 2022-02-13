import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import ClientSelectorGadget from "pages/gadgets/client.selector.gadget";

import EyecandyPanel from "controls/panels/eyecandy.panel";
import EyecandyControl, { DefaultProps, DefaultState } from "controls/base.control";

import Database from "classes/database";
import FormControl from "controls/form.control";


interface EyecandyFormProps extends DefaultProps {

	table: string;
	action: string;

	idField: string;
	idValue: number;

	afterEyecandy: any;
	afterForm: any;

}// EyecandyFormProps;


interface EyecandyFormState extends DefaultState {
	fetching: boolean;
	responseData: object;
}// EyecandyFormState;


export default class EyecandyForm extends EyecandyControl<EyecandyFormProps, EyecandyFormState> {


	public static defaultProps: EyecandyFormProps = {
		table: null,
		action: null,

		idField: null,
		idValue: null,

		afterEyecandy: null,
		afterForm: null	
	}// defaultProps;


	public state: EyecandyFormState = {
		fetching: false,
		responseData: null		
	}// state;


	public componentDidUpdate(): void {
		this.setState ({ fetching: this.state.responseData ? (this.state.responseData [this.props.idField] != this.props.idValue) : common.isset (this.props.idValue) });
	}


	public render () {
 		return (

			<EyecandyPanel id="client_panel" eyecandyVisible={this.state.fetching}
				afterEyecandy={() => {
					Database.fetch_row (this.props.table, { 
						action: this.props.action,
						[this.props.idField]: this.props.idValue
					}).then (data => this.setState ({ responseData: data }, this.props.afterEyecandy)) 
				}}>

				{React.cloneElement (this.props.children, { formData: this.state.responseData })}

			</EyecandyPanel>

 		);
	}// render;


}// EyecandyForm;