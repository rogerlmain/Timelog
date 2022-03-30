import * as common from "classes/common";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import Container from "controls/container";

import SelectList from "controls/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import ClientsModel from "client/models/clients";

import { MainContext } from "client/classes/types/contexts";


export default class ClientSelectorGadget extends BaseControl {


	static contextType = MainContext;


 	/********/


	 state = { 
		clients: null ,
		client_selected: false,
	}// state;


	static defaultProps = {

		id: "client_selector",

		hasHeader: false,
		headerSelectable: false,
		headerText: null,

		selectedClient: null,
		onClientChange: null

	}// defaultProps;


	constructor (props) {
		super (props);
		this.client_selector_id = `${this.props.id}_selecter`;
	}// constructor;


	componentDidMount () {
		ClientsModel.fetch_by_company (this.context.company_id).then (data => this.setState ({ clients: data }));
	}// componentDidMount;


	componentDidUpdate () {
		if (this.context.company_id != this.state.company_id) {
			ClientsModel.fetch_by_company (this.context.company_id).then (data => this.setState ({
				company_id: this.context.company_id,
				clients: data 
			}));
		}// if;
	}// componentDidUpdate;


	render () {
		return (
			<Container>

				<label htmlFor={this.client_selector_id}>Client ({this.state.company_id})</label>

				<EyecandyPanel id={`${this.client_selector_id}_eyecandy_panel`} eyecandyText="Loading..." eyecandyVisible={common.is_null (this.state.clients)}>
					<SelectList id={this.client_selector_id} data={this.state.clients} value={this.props.selectedClient}
					
						hasHeader={this.props.hasHeader}

						headerText={this.props.hasHeader ? this.props.headerText : null} 
						headerSelectable={this.props.headerSelectable}

						idField="client_id" textField="name"

						onChange={event => {
							this.setState ({ client_selected: true });
							this.execute (this.props.onClientChange, event);							
						}}>

					</SelectList>
				</EyecandyPanel>

			</Container>
		);
	}// render;

}// ClientSelectorGadget;