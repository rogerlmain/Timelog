import * as common from "classes/common";
import * as constants from "types/constants";

import { DefaultState } from "controls/base.control";
import { ClientData } from "types/datatypes";
import { LeftHand, SmallProgressMeter } from "controls/progress.meter";

import React, { BaseSyntheticEvent } from "react";
import FormControl, { FormControlProps } from "controls/form.control";

import Database from "classes/database";


interface ClientFormProps extends FormControlProps {

	formData: ClientData;

	onLoad?: any;
	onSave?: any;
	onDelete: any;

}// ClientFormProps;


interface ClientFormState extends DefaultState {
	saving: boolean;
	saved: boolean;
}// ClientFormState;


export default class ClientForm extends FormControl<ClientFormProps, ClientFormState> {

	private client_form: React.RefObject<HTMLFormElement> = React.createRef ();


	/********/


	private client_data (field: string) { return common.isset (this.props.formData) ? this.props.formData [field] : null }


	private save_client () {

		if (this.state.saved) return;
		if (!this.validate (this.client_form)) return;

		let form_data = new FormData (this.client_form.current);

		form_data.append ("action", "save");

		this.setState ({ saving: true }, () => Database.save_data ("clients", form_data).then (data => {
			this.execute (this.props.onSave, data).then (() => this.setState ({ saving: false }));
		}));

	}// save_client;


	private delete_client (event: BaseSyntheticEvent) {

		event.preventDefault ();

		if (!confirm (`Delete ${this.client_data ("name")}.\nAre you sure?`)) return false;

		let form_data = new FormData ();

		form_data.append ("action", "save");
		form_data.append ("deleted", "true");
		form_data.append ("client_id", this.client_data ("client_id"));

		this.setState ({ saving: true }, () => Database.save_data ("clients", form_data).then (data => {
			this.execute (this.props.onDelete, data).then (() => this.setState ({ saving: false }));
		}));

		return false;

	}// delete;
 

	/********/


	public static defaultProps: ClientFormProps = {
		formData: null,
		onLoad: null,
		onSave: null,
		onDelete: null
	}// defaultProps;


	public state: ClientFormState = { 
		saving: false,
		saved: false
	}// ClientFormState;


	public shouldComponentUpdate (next_props: Readonly<ClientFormProps>): boolean {
		this.setState ({ saved: common.same_object (this.props.formData, next_props.formData) });
		return true;
	}// shouldComponentUpdate;


	public render () {

		let client_id = this.client_data ("client_id");
		let editing = common.isset (client_id);

		return (

			<div style={{ border: "solid 1px green" }}>

				<form id="client_form" ref={this.client_form}>

					<input type="hidden" id="client_id" name="client_id" value={client_id || constants.blank} />

					<div className="three-column-grid outlined">

						<label htmlFor="client_name">Client Name</label>
						<input type="text" id="client_name" name="client_name" defaultValue={this.client_data ("name") || constants.blank} required={true} 
							style={editing ? {} : { gridColumn: "span 2" }}
							onBlur={this.save_client.bind (this)}>
						</input>

						{editing && <button onClick={this.delete_client.bind (this)}>Delete</button>}

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

