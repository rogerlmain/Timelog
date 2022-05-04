import * as common from "classes/common";
import * as constants from "client/classes/types/constants";

import React from "react";

import FormControl from "controls/form.control";
import Container from "controls/container";

import FadePanel from "controls/panels/fade.panel";

import Clients from "classes/storage/clients";

import ClientModel from "models/clients";

import { RightHand, SmallProgressMeter } from "controls/progress.meter";
import { MainContext } from "classes/types/contexts";


export default class ClientForm extends FormControl {


	static contextType = MainContext;


	static defaultProps = {
		disabled: false,
		formData: null,
		onLoad: null,
		onSave: null,
		onDelete: null
	}// defaultProps;


	client_form = React.createRef ();


	state = { 
		status: null,
		saved: false
	}// ClientFormState;


	/********/


	client_data (field) { return common.isset (this.props.formData) ? this.props.formData [field] : null }


	save_client () {

		if (this.state.saved) return;
		if (!this.validate (this.client_form)) return;

		let form_data = new FormData (this.client_form.current);

		form_data.append ("action", "save");
		form_data.append ("company_id", this.context.company_id);

		this.setState ({ status: "Saving..." }, () => ClientModel.save_client (form_data).then (data => {
			this.execute (this.props.onSave, data).then (() => {
				
				Clients.set_client (data);
				
				this.props.parent.setState ({ 
					client_data: data,
					selected_client: data.client_id
				}, () => {
					this.props.parent.load_client_list ();
					this.setState ({ status: null });
				});
				
			});
		}));

	}// save_client;


	delete_client () {

		event.preventDefault ();

		if (!confirm (`Delete ${this.client_data ("name")}.\nAre you sure?`)) return false;

		let form_data = new FormData (this.client_form.current);

		form_data.append ("action", "save");
		form_data.append ("deleted", "true");
		form_data.append ("client_id", this.client_data ("client_id"));

		this.setState ({ status: `Deleting ${this.client_data ("name")}...` }, () => ClientModel.save_client (form_data).then (data => {
			this.execute (this.props.onDelete, data).then (() => this.setState ({ status: null }));
		}));

		return false;

	}// delete;
 

	/********/


	shouldComponentUpdate (next_props) {
		if (this.props.formData != next_props.formData) {
			this.setState ({ saved: common.matching_objects (this.props.formData, next_props.formData) });
			return false;
		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {

		let client_id = this.client_data ("client_id");

		return <Container>

			<form id="client_form" ref={this.client_form}>

				<input type="hidden" id="client_id" name="client_id" value={client_id || constants.blank} />

				<div className="two-column-grid">

					<label htmlFor="client_name">Client Name</label>
					<input type="text" id="client_name" name="client_name" 
						defaultValue={this.client_data ("name") || constants.blank} 
						required={true} disabled={this.props.disabled}
						onBlur={this.save_client.bind (this)}>
					</input>

					<label htmlFor="client_description">Description</label>
					<textarea  id="client_description" name="client_description" style={{ width: "24em", height: "12em"}}
						defaultValue={this.client_data ("description")}  
						placeholder="(optional)" disabled={this.props.disabled}
						onBlur={this.save_client.bind (this)}>
					</textarea>

				</div>
				
			</form>

			<div className="horizontally-spaced-out vertically-center" style={{ marginTop: "1em" }}>

				<SmallProgressMeter id="client_progress_meter" visible={common.isset (this.state.status)} 
					alignment={constants.horizontal_alignment.right}>
					{/* {this.state.status} */}
					Doing shit
				</SmallProgressMeter>

				<FadePanel id="edit_options_panel" visible={common.isset (client_id)}>
					<button className="double-column" onClick={this.delete_client.bind (this)}>Delete</button>
				</FadePanel>

			</div>

		</Container>
		
	}// render;

}// ClientForm;