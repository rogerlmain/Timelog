import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import SelectList from "controls/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import ClientsModel from "client/models/clients";
import { ClientData } from "client/types/datatypes";


interface ClientSelectorProps extends DefaultProps {

	id: string;

	hasHeader: boolean;
	headerSelectable: boolean;
	headerText: string;

	selectedClient: number;

	onClientChange?: Function;

}// ClientSelectorProps;


interface ClientSelectorState extends DefaultState { 
	clients: ClientData [],
	client_selected: boolean
}// ClientSelectorState;


export default class ClientSelectorGadget extends BaseControl<ClientSelectorProps, ClientSelectorState> {


 	private client_selector_id: string = null;


	private client_change_handler (event: BaseSyntheticEvent) {
		this.setState ({ client_selected: true });
		this.execute (this.props.onClientChange, event);
	}// client_change_handler;


 	/********/


	public static defaultProps: ClientSelectorProps = {
		id: "client_selector",

		hasHeader: false,
		headerSelectable: false,
		headerText: null,

		selectedClient: null,
		onClientChange: null
	}// defaultProps;


	public state: ClientSelectorState = { 
		clients: null ,
		client_selected: false
	}// ClientSelectorState;


	public constructor (props: any) {
		super (props);
		this.client_selector_id = `${this.props.id}_selecter`;
	}// constructor;


	public componentDidMount (): void {
		ClientsModel.fetch_all ().then ((data: ClientData []) => this.setState ({ clients: data }));
	}// componentDidMount;


	public render () {
		return (
			<div style={{ display: "contents" }}>

				<label htmlFor={this.client_selector_id}>Client</label>

				<EyecandyPanel id={`${this.client_selector_id}_eyecandy_panel`} eyecandyText="Loading..." eyecandyVisible={common.is_null (this.state.clients)}>
					<SelectList id={this.client_selector_id} data={this.state.clients} value={this.props.selectedClient} 
					
						useHeader={this.props.hasHeader}

						headerText={this.props.hasHeader ? this.props.headerText : null} 
						headerSelectable={this.props.headerSelectable}

						idField="client_id" textField="name"

						onChange={(event: BaseSyntheticEvent) => this.client_change_handler (event)}>

					</SelectList>
				</EyecandyPanel>

			</div>
		);
	}// render;

}// ClientSelectorGadget;