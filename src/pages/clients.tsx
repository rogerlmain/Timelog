import React, { BaseSyntheticEvent } from "react";

import ClientSelecterGadget from "pages/gadgets/client.selector.gadget";
import TeamSelectorGadget from "pages/gadgets/team.selector.gadget";
// import ClientsModel from "models/clients";
import ClientForm from "pages/forms/client.form";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import { globals } from "types/globals";
import Database from "classes/database";


interface ClientsPageState extends DefaultState {

	client_list_loaded: boolean;

	client_selected: boolean;
	client_accounts: any;

	client_loading: boolean;
	client_data: any;

	selected_client: number;

}// ClientsPageState;


export default class ClientsPage extends BaseControl<DefaultProps, ClientsPageState> {

	private team_selector: React.RefObject<TeamSelectorGadget> = React.createRef ();


	/********/


	public state: ClientsPageState = {

		client_list_loaded: false,

		client_selected: false,
		client_accounts: null,

		client_loading: false,
		client_data: null,

		selected_client: 0

	}// state;


	public constructor (props: DefaultProps) {
		super (props);
		globals.clients_page = this;
	}// constructor;


	public render () {

 		return (

 			<div id="client_page" className="top-center-container row-spaced">

				<ClientSelecterGadget id="client_selecter" parent={this}
					onClientChange={(event: BaseSyntheticEvent) => this.setState ({ 
						client_loading: true,
						selected_client: event.target.value
					})}>
				</ClientSelecterGadget>

				<EyecandyPanel visible={true} eyecandyActive={this.state.client_loading} 
					afterShowingEyecandy={() => {
						if (this.state.selected_client == 0) return this.setState ({ client_data: null }, () => this.setState ({ client_loading: false }));
						Database.fetch_row ("clients", { 
							action: "details",
							client_id: this.state.selected_client 
						}).then (data => {
							this.setState ({ client_data: data }, () => this.setState ({ client_loading: false }))
						})
					}}>
					<ClientForm client_data={this.state.client_data} />
				</EyecandyPanel>

		 	</div>

 		);
	}// render;


}// ClientsPage;