import * as constants from "client/classes/types/constants";
import * as common from "classes/common";

import React from "react";

import Options from "classes/storage/options";
import Clients from "classes/storage/clients";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import ClientSelectorGadget from "pages/gadgets/selectors/client.selector.gadget";

import ClientForm from "forms/client.form";
import ClientModel from "models/clients";


import { is_null, get_values } from "classes/common";

export const client_limit_options = {
	"1": 1,
	"5": 5,
	"10": 10,
	"50": 50,
	"Unlimited": 0,
}// client_limit_options;


export default class ClientsPage extends BaseControl {


	state = {
		client_list: null,
		client_data: null,
		selected_client: null,
		updating: false
	}// state;


	static defaultProps = { id: "clients_page" }


	/********/


	update_client_list = () => { Clients.get_by_company (this.context.company_id).then (data => this.setState ({ client_list: data })) }
	

	componentDidMount = this.update_client_list;


	render () {

		let limit = Options.client_limit ();
		let option_value = get_values (client_limit_options) [limit - 1];
		let can_create = ((limit > 1) && (common.not_set (this.state.client_list) || (this.state.client_list.length < option_value) || (option_value == 0)));

 		return <div id={this.props.id} className="top-center-container row-spaced">

			<div className="two-column-grid">
				<ClientSelectorGadget id="client_selector" parent={this} companyId={this.props.companyId}
				
					hasHeader={true} 
					headerSelectable={can_create}
					headerText={can_create ? "New client" : "Select a client"}

					selectedClient={this.state.selected_client}

					onClientChange={(event) => this.setState ({ 
						selected_client: event.target.value,
						updating: true 
					})}>

				</ClientSelectorGadget>
			</div>

			<EyecandyPanel id="edit_client_panel" text="Loading..." eyecandyVisible={this.state.updating} 
			
				onEyecandy={() => {
					if (this.state.updating) {

						if (is_null (this.state.selected_client)) return this.setState ({
							client_data: null,
							updating: false
						});

						ClientModel.fetch_by_id (this.state.selected_client).then (data => this.setState ({
							client_data: data,
							updating: false
						}));

					}// if;
				}}>

				<ClientForm formData={this.state.client_data} parent={this} disabled={(!can_create) && (is_null (this.state.client_data))} />

			</EyecandyPanel>

		</div>
	}// render;


}// ClientsPage;