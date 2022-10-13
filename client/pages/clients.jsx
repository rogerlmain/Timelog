import React from "react";

import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import BaseControl from "client/controls/abstract/base.control";

import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ClientSelector from "client/controls/selectors/client.selector";
import ClientForm from "client/forms/client.form";

import { MasterContext } from "client/classes/types/contexts";
import { is_null, get_values, not_set } from "client/classes/common";


export const client_limit_options = {
	"1": 1,
	"5": 5,
	"10": 10,
	"50": 50,
	"Unlimited": 0,
}// client_limit_options;


export default class ClientsPage extends BaseControl {


	client_selector = React.createRef ();
	eyecandy_panel = React.createRef ();


	state = {
		client_list: null,
		client_data: null,
		selected_client: null,
		updating: false
	}// state;


	static contextType = MasterContext;
	static defaultProps = { id: "clients_page" }


	/********/


	render () {

		let limit = OptionsStorage.client_limit ();
		let option_value = get_values (client_limit_options) [limit - 1];
		let can_create = ((limit > 1) && (not_set (this.state.client_list) || (this.state.client_list.length < option_value) || (option_value == 0)));

		return <div id={this.props.id} className="top-centered row-spaced">

			<div className="one-piece-form">

				<ClientSelector id="client_selector" ref={this.client_selector} parent={this}
				
					headerSelectable={can_create}
					headerText={can_create ? "New client" : "Select a client"}

					selectedClient={this.state.selected_client}

					onChange={client_id => this.setState ({ 
						selected_client: client_id,
						updating: true
					})}>

				</ClientSelector>

			</div>

			<EyecandyPanel id="edit_client_panel" text="Loading..." ref={this.eyecandy_panel} eyecandyVisible={this.state.updating} 
			
				onEyecandy={() => ClientStorage.get_by_id (this.state.selected_client).then (data => this.setState ({ 
					client_data: data,
					updating: false,
				}))}>

				<ClientForm formData={this.state.client_data} parent={this} 

					disabled={(!can_create) && (is_null (this.state.client_data))}

					onSave={client => ClientStorage.get_by_company (CompanyStorage.active_company_id ()).then (data => {
						this.client_selector.current.setState ({ client_data: data }, () => this.setState ({ selected_client: client.client_id }));
					})}>

				</ClientForm>

			</EyecandyPanel>

		</div>
	}// render;


}// ClientsPage;