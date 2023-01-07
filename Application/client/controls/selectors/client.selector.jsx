import React from "react";

import ClientStorage from "client/classes/storage/client.storage";
import OffshoreModel from "client/classes/models/offshore.model";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import LoadList from "client/controls/lists/load.list";

import { debugging, not_set } from "client/classes/common";
import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { MasterContext } from "client/classes/types/contexts";
import { page_names } from "client/master";


export default class ClientSelector extends BaseControl {
	

	state = { client_data: null }


	client_list = React.createRef ();


	/*********/


	static contextType = MasterContext;


	static defaultProps = { 

		id: null,
		parent: null,
		
		newButton: false,

		selectedClientId: null,

		header: null,
		headerSelectable: false,

		inline: true,
		includeOffshoreAccounts: true,

		static: false,

		onChange: null,

	}// defaultProps;


	constructor (props) {
		super (props);
		if (debugging (false)) console.log (`${props.id} object created`);
	}// constructor;


	/*********/


	get_client_data = () => ClientStorage.get_by_company (this.context.company_id, this.props.includeOffshoreAccounts).then (data => {
		this.execute (this.props.onLoad, data).then (() => this.setState ({ 
			client_data: data.normalize () 
		}));
	})/* get_client_data */;


	/*********/


	componentDidMount = () => setTimeout (() => this.get_client_data (false), 1);


	shouldComponentUpdate (new_props, new_state, new_context) {
		if (new_context.company_id != this.context.company_id) this.get_client_data ();
		return true;
	}// shouldComponentUpdate;


	render () {

		let static_text = this.props.static || (Object.keys (this.state.client_data ?? []).length == 1) && not_set (this.props.header);

		return <Container>

			<label htmlFor={`${this.props.id}_load_list`} style={{ fontWeight: static_text ? "bold" : null }}>Client</label>

			<LoadList id={`${this.props.id}_load_list`} ref={this.client_list} static={static_text}

				dataIdField="client_id" data={this.state.client_data}

				newButtonPage={this.props.newButton ? page_names.clients : null}

				header={this.props.header} headerSelectable={this.props.headerSelectable} 
				selectedItem={this.props.selectedClientId}

				dataTextField={field => <div className="glyph-list-item">
					<div><img src={OffshoreModel.glyph_image (field)} className="list-glyph" /></div>
					<div>{field.name}</div>
				</div>}

				hAlign={horizontal_alignment.stretch} vAlign={vertical_alignment.center}

				onChange={event => {
					let client_id = event.currentTarget.getAttribute ("value");
					this.execute (this.props.onChange, client_id);
				}}>
				
			</LoadList>

		</Container>

	}// render;

}// ClientSelector;