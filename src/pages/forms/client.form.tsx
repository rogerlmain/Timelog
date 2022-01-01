import * as common from "classes/common";
import * as constants from "types/constants";

import React, { SyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import { ClientData } from "types/datatypes";

import Database from "classes/database";
import FadeButton from "controls/buttons/fade.button";


interface ClientFormProps extends DefaultProps {
	client_data: ClientData;
	onLoad?: Function;
}// ClientFormProps;


interface ClientFormState extends DefaultState {
	saved: boolean;
}// ClientFormState;


export default class ClientForm extends BaseControl<ClientFormProps, ClientFormState> {

	private client_form: React.RefObject<HTMLFormElement> = React.createRef ();


	private client_data (field: string) { return common.isset (this.props.client_data) ? this.props.client_data [field] : constants.blank }


	private save_client (event: SyntheticEvent) {
		if (this.state.saved) return;

		let form_data = new FormData (this.client_form.current);

		form_data.append ("action", "save");
		Database.save_data ("clients", form_data).then (index => this.setState ({ client_id: index }));
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
		return (
			<form id="client_form" ref={this.client_form}>

				<div className="one-piece-form">

					<label htmlFor="client_name">Client Name</label>
					
					<input type="hidden" id="client_id" name="client_id" value={this.client_data ("client_id")} />

					<input type="text" id="client_name" name="client_name" defaultValue={this.client_data ("name")}
						onBlur={event => this.save_client (event)} onChange={event => {

let x = event;

						}}>
					</input>

					<FadeButton visible={true /* set to this.changed (form_data) */}>Save</FadeButton>
					<FadeButton visible={true /* set to this.changed (form_data) */}>Delete</FadeButton>

				</div>
			</form>
		);
	}// render;

}// ClientForm;

