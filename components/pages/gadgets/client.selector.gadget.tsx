import React, { BaseSyntheticEvent } from "react";

import * as common from "classes/common";
import BaseControl, { DefaultProps } from "controls/base.control";

import Database from "classes/database";

import SelectList from "controls/select.list";


interface ClientSelectorProps extends DefaultProps {

	id: string;
	header: string;

	hasHeader: boolean;
	headerSelectable: boolean;

	selectedClient: number;

	onLoad?: Function;
	onClientChange?: Function;

}// ClientSelectorProps;


interface ClientSelectorState {

	clients: any;
	
	selected_client: number;

}// ClientSelectorState;


export default class ClientSelectorGadget extends BaseControl<ClientSelectorProps, ClientSelectorState> {

 	private client_list: React.RefObject<SelectList> = React.createRef ();

 	private client_selector_id: string = null;


	private load_clients () {
		return new Promise ((resolve, reject) => {
			Database.fetch_data ("clients", { action: "list" }).then ((data: any) => {
				this.setState ({ clients: data }, () => this.execute (this.props.onLoad).then (resolve).catch (reject));
			});
		});
	}// load_clients;


	private client_change_handler (event: BaseSyntheticEvent) {
		this.setState ({ client_selected: true });
		this.execute (this.props.onClientChange, event);
	}// client_change_handler;


 	/********/


	public static defaultProps: ClientSelectorProps = {
		id: "client_selector",
		header: null,
		hasHeader: false,
		headerSelectable: false,
		selectedClient: null,
		onLoad: null,
		onClientChange: null
	}// defaultProps;

	public state: ClientSelectorState = {
		selected_client: null,
		clients: null
	}// state;


	public constructor (props: any) {
		super (props);
		this.client_selector_id = `${this.props.id}_selecter`;
	}// constructor;


	public async getSnapshotBeforeUpdate (old_props: ClientSelectorProps, old_state: ClientSelectorState) {
		if (this.is_updated (this.state.clients, old_state.clients) || common.is_null (this.state.clients)) await this.load_clients ();
		if (this.props.selectedClient != this.state.selected_client) this.setState ({ selected_client: this.props.selectedClient });
		return true;
	}// componentDidMount;


	public render () {
		return (
			<div style={{ display: "contents" }}>

				<label htmlFor={this.client_selector_id}>Client</label>

				<SelectList id={this.client_selector_id} ref={this.client_list} value={this.state.selected_client}
					data={this.state.clients} id_field="client_id" text_field="name"
					onChange={(event: BaseSyntheticEvent) => this.client_change_handler (event)}>
					{(this.props.header || this.props.hasHeader) && <option value={0} style={{ fontStyle: "italic" }} disabled={this.props.headerSelectable}>{this.props.header}</option>}
				</SelectList>

			</div>
		);
	}// render;

}// ClientSelectorGadget;