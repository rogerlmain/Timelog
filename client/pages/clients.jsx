import React from "react";

import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import BaseControl from "client/controls/abstract/base.control";

import FadePanel from "client/controls/panels/fade.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ClientSelector from "client/controls/selectors/client.selector";
import ClientForm from "client/forms/client.form";

import { MasterContext } from "client/classes/types/contexts";
import { is_unlimited, isset, get_keys } from "client/classes/common";
import { client_slots, unlimited } from "client/classes/types/options";


export const client_limit_options = {
	"1": 1,
	"5": 5,
	"10": 10,
	"50": 50,
	"Unlimited": unlimited,
}// client_limit_options;


export default class ClientsPage extends BaseControl {


	client_selector = React.createRef ();
	eyecandy_panel = React.createRef ();


	state = {
		client_data: null,
		selected_client: null,
		updating: false
	}// state;


	static contextType = MasterContext;
	static defaultProps = { id: "clients_page" }


	/********/


	componentDidMount () {
		
		if (OptionsStorage.client_limit () > 1) return;

		ClientStorage.get_by_company (CompanyStorage.active_company_id ()).then (data => {

			let client = data [Object.keys (data) [0]];

			this.setState ({ 
				client_data: client,
				selected_client: client.client_id,
			});

		});

	}// componentDidMount;


	render () {

		let client_limit = OptionsStorage.client_limit ();

		let client_data = this.client_selector.current?.state.client_data;
		let client_count = get_keys (client_data)?.length ?? 0;

		let can_create = (((client_slots [client_limit - 1] - client_count) > 0) || is_unlimited (client_limit));

		return <div id={this.props.id} className="top-centered row-spaced">

			<div className="one-piece-form">

				<ClientSelector id="client_selector" ref={this.client_selector} parent={this}
				
					headerSelectable={can_create}
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

				{(isset (this.state.selected_client) || can_create) && <ClientForm formData={this.state.client_data} parent={this} 
					onSave={client => ClientStorage.get_by_company (CompanyStorage.active_company_id ()).then (data => {
						this.client_selector.current?.setState ({ client_data: data }, () => this.setState ({ selected_client: client.client_id }));
					})}>
				</ClientForm>}

			</EyecandyPanel>

		</div>
	}// render;


}// ClientsPage;