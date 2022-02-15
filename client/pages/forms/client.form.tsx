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
	status: string;
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

		this.setState ({ status: "Saving..." }, () => Database.save_data ("clients", form_data).then ((data: any) => {
			this.execute (this.props.onSave, data).then (() => this.setState ({ status: null }));
		}));

	}// save_client;


	private delete_client (event: BaseSyntheticEvent) {

		event.preventDefault ();

		if (!confirm (`Delete ${this.client_data ("name")}.\nAre you sure?`)) return false;

		let form_data = new FormData (this.client_form.current);

		form_data.append ("action", "save");
		form_data.append ("deleted", "true");
		form_data.append ("client_id", this.client_data ("client_id"));

		this.setState ({ status: `Deleting ${this.client_data ("name")}...` }, () => Database.save_data ("clients", form_data).then (data => {
			this.execute (this.props.onDelete, data).then (() => this.setState ({ status: null }));
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
		status: null,
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
			<div style={{ display: "contents" }}>

				<form id="client_form" ref={this.client_form}>

					<input type="hidden" id="client_id" name="client_id" value={client_id || constants.blank} />

					<div className={"two-column-grid"}>

						<label htmlFor="client_name">Client Name</label>
						<input type="text" id="client_name" name="client_name" defaultValue={this.client_data ("name") || constants.blank} required={true} 
							onBlur={this.save_client.bind (this)}>
						</input>

						<label htmlFor="client_description">Description</label>
						<textarea  id="client_description" name="client_description" defaultValue={this.client_data ("description")}  placeholder="(optional)" 
							onBlur={this.save_client.bind (this)}>
						</textarea>

						{editing && <button className="double-column" onClick={this.delete_client.bind (this)} style={{ marginTop: "1em" }}>Delete</button>}

					</div>
					
				</form>

				<div className="button-bar">
					<SmallProgressMeter visible={common.isset (this.state.status)} alignment={LeftHand}>{this.state.status}</SmallProgressMeter>
				</div>

			</div>
		);
	}// render;

}// ClientForm;

