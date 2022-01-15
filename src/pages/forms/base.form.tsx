import React, { BaseSyntheticEvent } from "react";

import * as common from "classes/common";

import ClientSelectorGadget from "pages/gadgets/client.selector.gadget";
import ClientForm from "pages/forms/client.form";

import EyecandyPanel from "controls/panels/eyecandy.panel";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import { globals } from "types/globals";
import Database from "classes/database";


interface ClientsPageState extends DefaultState {

	client_selected: boolean;
	client_accounts: any;

	client_data: any;

	selected_client: number;

test_index: number;
isseen: boolean;

}// ClientsPageState;


export default class ClientsPage extends BaseControl<DefaultProps, ClientsPageState> {


	public state: ClientsPageState = {

		client_selected: false,
		client_accounts: null,

		client_data: null,

		selected_client: 0

,test_index: 1
,isseen: true
	
	}// state;


	public constructor (props: DefaultProps) {
		super (props);
		globals.clients_page = this;
	}// constructor;


	public render () {


 		return (

 			<div id="client_page" className="top-center-container row-spaced">

				<div className="two-column-grid">
					<ClientSelectorGadget id="client_selector" parent={this} hasHeader={true}
						onClientChange={(event: BaseSyntheticEvent) => this.setState ({ selected_client: event.target.value })}>
					</ClientSelectorGadget>
				</div>


				<EyecandyPanel id="client_panel" eyecandyVisible={
					
					(()=>{

						let result = ((this.state.selected_client != 0) && (common.is_null (this.state.client_data) || (this.state.client_data.client_id != this.state.selected_client)));
						return result;

//						return this.state.client_data && (this.state.client_data.client_id != this.state.selected_client

					})()
				
				}
				afterEyecandy={() => {
					if (this.state.selected_client == 0) return this.setState ({ client_data: null });
					Database.fetch_row ("clients", { 
						action: "details",
						client_id: this.state.selected_client 
					}).then (data => this.setState ({ client_data: data })) }}>

					<ClientForm clientData={this.state.client_data} onSave={(data: Object) => this.setState ({ client_data: data })} />

				</EyecandyPanel>

		 	</div>

 		);
	}// render;


}// ClientsPage;