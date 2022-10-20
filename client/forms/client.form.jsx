import React from "react";

import FormControl from "client/controls/form.control";
import FadePanel from "client/controls/panels/fade.panel";

import ClientStorage from "client/classes/storage/client.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import ClientModel from "client/classes/models/client.model";

import RateSubform from "client/forms/subforms/rate.subform";

import { blank } from "client/classes/types/constants";
import { isset } from "client/classes/common";
import { SmallProgressMeter } from "client/controls/progress.meter";
import { MasterContext } from "client/classes/types/contexts";


import "resources/styles/forms.css";


export default class ClientForm extends FormControl {


	client_form = React.createRef ();

	state = { 
		status: null,
		handler: null,
	}/* state */


	/********/


	static contextType = MasterContext;


	static defaultProps = {

		disabled: false,

		formData: null,
		parent: null,

		onLoad: null,
		onSave: null,
		onDelete: null

	}// defaultProps;


	/********/


	client_data = (field) => { return isset (this.props.formData) ? this.props.formData [field] : null }


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
 

	save_client = event => {

		event.preventDefault ();

		if (!this.validate (this.client_form)) return;

		let form_data = new FormData (this.client_form.current);
		let rate = form_data.get ("billing_rate");

		form_data.set ("company_id", this.context.company_id);
		form_data.set ("billing_rate", rate ?? 0);

		this.setState ({ 
			status: "Saving",
			handler: () => ClientStorage.save_client (form_data).then (data => this.props.parent.setState ({ 
				client_data: data,
				selected_client: data.client_id,
			}, () => this.execute (this.props.onSave, data).then (() => this.setState ({ handler: null }))))
		}, this.setState ({ status: "Saving..." }));

	}// save_client;


	/********/


	render () {

		let client_id = this.client_data ("client_id");
		let billing_option = OptionsStorage.can_bill ();

		return <div>

			<form id="client_form" ref={this.client_form}>

				<input type="hidden" id="client_id" name="client_id" value={client_id || blank} />

				<div className={billing_option ? "billing-option-form" : "one-piece-form"}>

					<label htmlFor="client_name">Client Name</label>
					<input type="expando" id="client_name" name="client_name"
						defaultValue={this.client_data ("name") ?? blank} 
						required={true} disabled={this.props.disabled}>
					</input>

					<RateSubform clientId={client_id} />

					<label htmlFor="client_description">Description</label>
					<textarea id="client_description" name="client_description"
						style={{ gridColumn: (billing_option ? "2/-1" : null) }}
						defaultValue={this.client_data ("description")}  
						placeholder="(optional)" disabled={this.props.disabled}>
					</textarea>

					<div style={{ gridColumn: "2/-1" }}>
						<div className="horizontally-spaced-out vertically-centered with-headspace">

							<SmallProgressMeter id="client_progress_meter" visible={isset (this.state.handler)} 
								handler={this.state.handler}>
								{this.state.status}
							</SmallProgressMeter>

							<div className="button-panel">
								<FadePanel id="delete_button_panel" visible={isset (client_id)}>
									{isset (client_id) && <button className="double-column" onClick={this.delete_client}>Delete</button>}
								</FadePanel>
								<button onClick={this.save_client}>Save</button>
							</div>

						</div>
					</div>

				</div>
				
			</form>

		</div>
		
	}// render;

}// ClientForm;