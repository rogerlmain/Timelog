import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";

import BaseControl from "client/controls/abstract/base.control";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ClientSelector from "client/controls/selectors/client.selector";

import ClientForm from "client/forms/client.form";

import { MasterContext } from "client/classes/types/contexts";

import { is_null, get_values, not_set, numeric_value } from "client/classes/common";


export const client_limit_options = {
	"1": 1,
	"5": 5,
	"10": 10,
	"50": 50,
	"Unlimited": 0,
}// client_limit_options;


export default class ClientsPage extends BaseControl {


	client_selector = React.createRef ();


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

					onChange={(event) => this.setState ({ 
						selected_client: numeric_value (event.target.value),
						updating: true 
					})}>

				</ClientSelector>

			</div>

			<EyecandyPanel id="edit_client_panel" text="Loading..." eyecandyVisible={this.state.updating} 
			
				onEyecandy={async () => {

					let data = null;

					if (this.state.selected_client > 0) data = await ClientStorage.get_by_id (this.state.selected_client);
					
					this.setState ({ 
						client_data: data,
						updating: false,
					});

				}}>

				<ClientForm formData={this.state.client_data} parent={this} disabled={(!can_create) && (is_null (this.state.client_data))}
					onSave={() => this.client_selector.current.setState ({ clients_loading: true })}>
				</ClientForm>

			</EyecandyPanel>

		</div>
	}// render;


}// ClientsPage;