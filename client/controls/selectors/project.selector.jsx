import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";

import Container from "client/controls/container";

import LoadList from "client/controls/lists/load.list";
import ClientSelector from "client/controls/selectors/client.selector";

import { isset, integer_value, nested_value, not_set } from "client/classes/common";
import { page_names } from "client/master";
import { tracing } from "client/classes/types/constants";

import "resources/styles/gadgets/selector.gadget.css";


export default class ProjectSelector extends BaseControl {


	client_selector = React.createRef ();


	state = { 
		client_id: null,
		project_id: null,
	}// state;


	static defaultProps = {

		id: null,
		selectedProject: null,

		clientId: null,
		projectId: null,

		onClientChange: null,
		onProjectChange: null,

		hasHeader: false,
		headerSelectable: false,

		headerText: "Select a project",

	}// defaultProps;


	constructor (props) {

		super (props);

		this.state.client_id = this.props.clientId;
		this.state.project_id = this.props.projectId;

//		if (tracing) 
		console.log (`${props.id} object created`);

	}// constructor;


	/********/


	client_selected = () => { return nested_value (this.client_selector.current, "client_selected") }
	project_selected = () => { return ((this.state.project_id > 0) || (OptionsStorage.single_project () && this.client_selected ())) }

	
	/********/


	render () {

		let single_client = (OptionsStorage.client_limit () == 1);
		let multiple_projects = (OptionsStorage.project_limit () > 1);

		return <div id={this.props.id} className="one-piece-form">

			<ClientSelector id="client_selector" ref={this.client_selector} parent={this} newButton={this.props.newButton}

				hasHeader={this.props.hasHeader} 
				headerSelectable={false} 
				headerText="Select a client" 

				selectedClient={this.state.client_id}

				onChange={event => this.setState ({ 
					client_id: integer_value (event.target.value),
					project_id: null,
				}, () => this.execute (this.props.onClientChange, event))}>

			</ClientSelector>

			
			<Container visible={multiple_projects}>
				<LoadList id={this.props.id}

					label="Project"

					listHeader={this.props.headerSelectable ? "New project" : "Select a project"}
					headerSelectable={this.props.headerSelectable}

					dataIdField="project_id"
					dataTextField="name"

					data={isset (this.state.client_id) ? ProjectStorage.get_projects_by_client (this.state.client_id) : null}
					
					newButtonPage={(this.props.newButton && isset (this.state.cliend_id)) ? page_names.projects : null} 
					selectedItem={this.state.project_id}

					style={{ width: "100%" }}
					disabled={not_set (this.state.client_id) && (!single_client)}

					onChange={event => this.setState ({ project_id: integer_value (event.target.value) }, () => this.execute (this.props.onProjectChange, event))}>

				</LoadList>
			</Container>

		</div>
	}// render;

}// ProjectSelector;