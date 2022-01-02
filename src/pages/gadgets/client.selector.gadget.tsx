import React, { BaseSyntheticEvent } from "react";

import * as common from "classes/common";
import BaseControl, { DefaultProps } from "controls/base.control";

import Database from "classes/database";

import SelectList from "controls/select.list";
import FadePanel from "controls/panels/fade.panel";


interface ClientSelectorProperties extends DefaultProps {

	id: string;

	onLoad?: Function;
	onClientChange?: Function;

}// ClientSelectorProps;


interface ClientSelectorState {

	clients: any;

	client_list_loaded: boolean;
	client_selected: boolean;

}// ClientSelectorState;


export default class ClientSelecterGadget extends BaseControl<ClientSelectorProperties, ClientSelectorState> {

 	private client_list: React.RefObject<SelectList> = React.createRef ();

 	private client_selector_id: string = null;


	private load_clients () {
		Database.fetch_data ("clients", { action: "list" }).then ((data: any) => {
			this.setState ({ clients: data }, () => {
				this.setState ({ client_list_loaded: true }, () => this.execute (this.props.onLoad));
			});
		});
	}// load_clients;


	private client_change_handler (event: BaseSyntheticEvent) {
		this.setState ({ client_selected: true });
		this.execute (this.props.onClientChange, event);
	}// client_change_handler;


 	/********/


	public props: ClientSelectorProperties;

	public state: ClientSelectorState = {
		client_list_loaded: false,
		client_selected: false,
		clients: null
	}// state;


	public constructor (props: any) {
		super (props);
		this.client_selector_id = `${this.props.id}_selecter`;
	}// constructor;


	public getSnapshotBeforeUpdate (old_props: ClientSelectorProperties, old_state: ClientSelectorState) {
		if (this.is_updated (this.state.clients, old_state.clients) || common.is_null (this.state.clients)) this.load_clients ();
		return true;
	}// componentDidMount;


	public render () {
		return (
			<form id={this.props.id}>
				<div className="client-selecter-form">
					<div style={{ display: "contents" }}>
						<FadePanel visible={this.state.client_list_loaded}>

							<label htmlFor={this.client_selector_id}>Client</label>

							<SelectList id={this.client_selector_id} ref={this.client_list}
								data={this.state.clients} id_field="client_id" text_field="name"
								onChange={(event: BaseSyntheticEvent) => this.client_change_handler (event)}>
								<option value={0} style={{ fontStyle: "italic" }}>New</option>
							</SelectList>

						</FadePanel>
					</div>
				</div>
			</form>
		);
	}// render;

}// ClientSelecterGadget;