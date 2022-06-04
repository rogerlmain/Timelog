import * as common from "client/classes/common";
import * as constants from "client/classes/types/constants";

import React from "react";

import FormControl from "controls/form.control";
import Container from "controls/container";
import CurrencyInput from "client/controls/inputs/currency.input";

import FadePanel from "controls/panels/fade.panel";

import ClientStorage from "client/classes/storage/client.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import ClientModel from "models/client.model";

import { SmallProgressMeter } from "controls/progress.meter";
import { MainContext } from "classes/types/contexts";


import "client/resources/styles/forms.css";


export default class ClientForm extends FormControl {


	static contextType = MainContext;


	static defaultProps = {

		disabled: false,

		formData: null,
		parent: null,

		onLoad: null,
		onSave: null,
		onDelete: null

	}// defaultProps;


	client_form = React.createRef ();


	state = { status: null }


	client_data = (field) => { return common.isset (this.props.formData) ? this.props.formData [field] : null }


	delete_client = event => {

		let client_id = this.client_data ("client_id");

		event.preventDefault ();

		if (!confirm (`Delete ${this.client_data ("name")}.\nAre you sure?`)) return false;

		this.setState ({ status: `Deleting ${this.client_data ("name")}...` }, () => ClientModel.delete_client (client_id).then (data => {

			ClientStorage.remove_client (client_id);

			this.execute (this.props.onDelete, data).then (() => this.props.parent.setState ({ 
				client_data: null,
				selected_client: null,
				updating: true,
			}, () => {
				this.props.parent.update_client_list ();
				this.setState ({ status: null });
			}));

		}));

		return false;

	}/* delete */;
 

	save_client = () => {

		if (!this.validate (this.client_form)) return;

		let form_data = new FormData (this.client_form.current);

		form_data.append ("action", "save");
		form_data.append ("company_id", this.context.company_id);

		this.setState ({ status: "Saving..." }, () => ClientStorage.save_client (this.context.company_id, form_data).then (data => {
			this.props.parent.setState ({ 
				client_data: data,
				selected_client: data.client_id,
			}, () => {
				this.execute (this.props.onSave, data).then (() => this.setState ({ status: null }));
			});
		}));

	}// save_client;


	/********/


	render () {

		let client_id = this.client_data ("client_id");
		let billing_option = OptionsStorage.can_bill ();

		return <Container>

			<form id="client_form" ref={this.client_form}>

				<input type="hidden" id="client_id" name="client_id" value={client_id || constants.blank} />

				<div className={billing_option ? "billing-option-form" : "one-piece-form"}>

					<label htmlFor="client_name">Client Name</label>
					
					<input type="text" id="client_name" name="client_name" 
						defaultValue={this.client_data ("name") ?? constants.blank} 
						required={true} disabled={this.props.disabled}
						onBlur={this.save_client.bind (this)}>
					</input>

					<Container visible={billing_option}>
						<label htmlFor="billing_rate" style={{ marginLeft: "1em" }}>Rate</label>
						<CurrencyInput id="billing_rate" className="rate-field" maxLength={3}
							defaultValue={this.client_data ("billing_rate") ?? "0"}
							disabled={this.props.disabled}
							onBlur={this.save_client}>
						</CurrencyInput>
					</Container>

					<label htmlFor="client_description">Description</label>
					<textarea id="client_description" name="client_description" 
						style={{
							width: "100%",
							gridColumn: (billing_option ? "2 / -1" : null),
						}}
						defaultValue={this.client_data ("description")}  
						placeholder="(optional)" disabled={this.props.disabled}
						onBlur={this.save_client.bind (this)}>
					</textarea>

				</div>
				
			</form>

			<div className="horizontally-spaced-out vertically-centered" style={{ marginTop: "1em" }}>

				<SmallProgressMeter id="client_progress_meter" visible={common.isset (this.state.status)} 
					alignment={constants.horizontal_alignment.right}>
					{this.state.status}
				</SmallProgressMeter>

				<FadePanel id="delete_button_panel" visible={common.isset (client_id)}>
					<button className="double-column" onClick={this.delete_client}>Delete</button>
				</FadePanel>

			</div>

		</Container>
		
	}// render;

}// ClientForm;