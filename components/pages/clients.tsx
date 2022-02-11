import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import ClientForm from "pages/forms/client.form";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import { globals } from "types/globals";

import EyecandyForm from "controls/forms/eyecandy.form";
import ClientSelectorGadget from "./gadgets/client.selector.gadget";


interface ClientsPageState extends DefaultState {
	selected_client: number

, eyecandy_text: string

}// ClientsPageState;


export default class ClientsPage extends BaseControl<DefaultProps, ClientsPageState> {


	public state: ClientsPageState = {
		selected_client: null

, eyecandy_text: "waiting..."

	}// state;


	public constructor (props: DefaultProps) {
		super (props);
		globals.clients_page = this;
	}// constructor;


	private client_selected () { return common.not_null (this.state.selected_client) }


	public render () {
 		return (
			<div id="client_page" className="top-center-container row-spaced">

				<div className="two-column-grid">
					<ClientSelectorGadget id="client_selector" parent={this} hasHeader={true} selectedClient={this.state.selected_client}
						onClientChange={(event: BaseSyntheticEvent) => this.setState ({ selected_client: event.target.value })}>
					</ClientSelectorGadget>
				</div>

				<EyecandyForm table="clients" action="details" idField="client_id" idValue={this.state.selected_client}>
					<ClientForm onDelete={() => this.setState ({ selected_client: null })} />
				</EyecandyForm>

			</div>
		);
	}// render;


}// ClientsPage;