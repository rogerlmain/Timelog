import * as common from "classes/common";
import * as constants from "types/constants";

import { DefaultProps, DefaultState } from "controls/base.control";
import { ClientData } from "types/datatypes";
import { LeftHand, SmallProgressMeter } from "controls/progress.meter";

import React, { SyntheticEvent } from "react";
import FormControl from "controls/form.control";

import Database from "classes/database";
import ExplodingPanel from "controls/panels/exploding.panel";


interface ClientFormProps extends DefaultProps {

	clientData: ClientData;

	onLoad?: any;
	onSave?: any;

}// ClientFormProps;


interface ClientFormState extends DefaultState {
	saving: boolean;
	saved: boolean;
}// ClientFormState;


export default class ClientForm extends FormControl<ClientFormProps, ClientFormState> {

	private client_form: React.RefObject<HTMLFormElement> = React.createRef ();


	/********/


	private client_data (field: string) { return common.isset (this.props.clientData) ? this.props.clientData [field] : constants.blank }


	private save_client () {

		if (this.state.saved) return;
		if (!this.validate (this.client_form)) return;

		let form_data = new FormData (this.client_form.current);

		form_data.append ("action", "save");

		this.setState ({ saving: true }, () => Database.save_data ("clients", form_data).then (data => {
			this.execute (this.props.onSave, data).then (() => this.setState ({ saving: false }));
		}));

	}// save_client;
	

	/********/


	public static defaultProps: ClientFormProps = {

		clientData: null,
		
		onLoad: null,
		onSave: null

	}// defaultProps;


	public state: ClientFormState = { 
		saving: false,
		saved: false
	}// ClientFormState;


	public shouldComponentUpdate (next_props: Readonly<ClientFormProps>): boolean {
		this.setState ({ saved: common.same_object (this.props.clientData, next_props.clientData) });
		return true;
	}// shouldComponentUpdate;


	public render () {

		let client_id = this.client_data ("client_id");

		return (

			<div style={{ border: "solid 1px green" }}>

				<form id="client_form" ref={this.client_form}>

					<input type="hidden" id="client_id" name="client_id" value={client_id} />

					<div className="three-column-grid">

						<label htmlFor="client_name">Client Name</label>
						<input type="text" id="client_name" name="client_name" defaultValue={this.client_data ("name")} required={true} onBlur={this.save_client.bind (this)} />
						<ExplodingPanel id="delete_button_panel"><button>Delete</button></ExplodingPanel>

						<label htmlFor="client_description">Description</label>
						<textarea  id="client_description" name="client_description" defaultValue={this.client_data ("description")} className="double-column" onBlur={this.save_client.bind (this)} />

					</div>
				</form>

				<div className="middle-right-container">
					<SmallProgressMeter visible={this.state.saving} alignment={LeftHand}>Saving...</SmallProgressMeter>
				</div>

			</div>
		);
	}// render;

}// ClientForm;

