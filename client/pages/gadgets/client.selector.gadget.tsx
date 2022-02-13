import React, { BaseSyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import SelectList from "controls/select.list";


interface ClientSelectorProps extends DefaultProps {

	id: string;

	hasHeader: boolean;
	headerSelectable: boolean;
	headerText: string;

	clients: any;

	selectedClient: number;

	onClientChange?: Function;

}// ClientSelectorProps;


export default class ClientSelectorGadget extends BaseControl<ClientSelectorProps, DefaultState> {


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

		clients: null,
		selectedClient: null,
		onClientChange: null
	}// defaultProps;


	public constructor (props: any) {
		super (props);
		this.client_selector_id = `${this.props.id}_selecter`;
	}// constructor;


	public render () {
		return (
			<div style={{ display: "contents" }}>

				<label htmlFor={this.client_selector_id}>Client</label>

				<SelectList id={this.client_selector_id} data={this.props.clients} value={this.props.selectedClient} 
				
					headerText={this.props.hasHeader ? this.props.headerText : null} headerSelectable={this.props.headerSelectable}
					idField="client_id" textField="name"

					onChange={(event: BaseSyntheticEvent) => this.client_change_handler (event)}>
				</SelectList>

			</div>
		);
	}// render;

}// ClientSelectorGadget;