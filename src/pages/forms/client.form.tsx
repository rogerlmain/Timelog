import * as common from "classes/common";
import * as constants from "types/constants";

import React, { SyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { ClientData } from "types/datatypes";

import Database from "classes/database";
import FadeButton from "controls/buttons/fade.button";
import { resourceUsage } from "process";


interface ClientFormProps extends DefaultProps {
	client_data: ClientData;
	onLoad?: any;
	onSave?: any;
}// ClientFormProps;


interface ClientFormState extends DefaultState {
	saved: boolean;
}// ClientFormState;


export default class ClientForm extends BaseControl<ClientFormProps, ClientFormState> {

	private client_form: React.RefObject<HTMLFormElement> = React.createRef ();


	/**** Prototype validation - possibly export to other forms ****/


	protected validate (form: React.RefObject<HTMLFormElement>): boolean {
		for (let item of form.current) {
			let field = item as HTMLInputElement;
			if (field.required && common.is_empty (field.value)) return false;
		};
		return true;
	}// validate;


	/********/


	private client_data (field: string) { return common.isset (this.props.client_data) ? this.props.client_data [field] : constants.blank }


	private save_client (event: SyntheticEvent) {

		if (this.state.saved) return;
		if (!this.validate (this.client_form)) return;

		let form_data = new FormData (this.client_form.current);

		form_data.append ("action", "save");
		Database.save_data ("clients", form_data).then (this.props.onSave);
		
	}// save_client;
	

	/********/


	public static defaultProps: ClientFormProps = {
		client_data: null,
		onLoad: null
	}// defaultProps;


	public state: ClientFormState = { 
		saved: false
	}// ClientFormState;


	public shouldComponentUpdate (next_props: Readonly<ClientFormProps>): boolean {
		this.setState ({ saved: common.same_object (this.props.client_data, next_props.client_data) });
		return true;
	}// shouldComponentUpdate;


	public render () {

		let client_id = this.client_data ("client_id");

		return (
			<form id="client_form" ref={this.client_form}>

				<div className="single-line-form">

					<input type="hidden" id="client_id" name="client_id" value={client_id} />

					<label htmlFor="client_name">Client Name</label>
					<input type="text" id="client_name" name="client_name" defaultValue={this.client_data ("name")} required={true} onBlur={this.save_client.bind (this)} />

					<label htmlFor="client_description">Description</label>
					<textarea />

					{common.not_empty (client_id) && <FadeButton visible={true /* set to this.changed (form_data) */}>Delete</FadeButton>}

				</div>
			</form>
		);
	}// render;

}// ClientForm;

