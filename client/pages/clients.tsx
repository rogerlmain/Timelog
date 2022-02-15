import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import ClientForm from "pages/forms/client.form";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import { globals } from "types/globals";

import EyecandyForm from "controls/forms/eyecandy.form";
import ClientSelectorGadget from "./gadgets/client.selector.gadget";
import Database from "client/classes/database";


interface ClientsPageState extends DefaultState {
	client_list: any,
	selected_client: number
}// ClientsPageState;


export default class ClientsPage extends BaseControl<DefaultProps, ClientsPageState> {


	private load_clients () {
		return new Promise ((resolve, reject) => {
			try {
				Database.fetch_data ("clients", { action: "list" }).then ((data: any) => this.setState ({ client_list: data }, resolve));
			} catch (except) {
				reject (except.getMessage ());
			}// try;
		});
	}// load_clients;


	/********/


	public state: ClientsPageState = {
		client_list: null,
		selected_client: null
	}// state;


	public constructor (props: DefaultProps) {
		super (props);
		globals.clients_page = this;
	}// constructor;


	public async getSnapshotBeforeUpdate (old_props: DefaultProps, old_state: ClientsPageState) {
		if (common.is_null (this.state.client_list)) await this.load_clients ();
	}// getSnapshotBeforeUpdate;


	public render () {
 		return (
			<div id="client_page" className="top-center-container row-spaced">

				<div className="two-column-grid">
					<ClientSelectorGadget id="client_selector" parent={this} 
					
						hasHeader={true} 
						headerSelectable={true}
						headerText="New client"

						clients={this.state.client_list} selectedClient={this.state.selected_client}
						onClientChange={(event: BaseSyntheticEvent) => this.setState ({ selected_client: event.target.value })}>

					</ClientSelectorGadget>
				</div>

				<EyecandyForm table="clients" action="details" idField="client_id" idValue={this.state.selected_client}>
					<ClientForm onDelete={async () => {
						this.setState ({ selected_client: null });
						await this.load_clients ();
					}} onSave={async () => await this.load_clients () } />
				</EyecandyForm>

			</div>
		);
	}// render;


}// ClientsPage;