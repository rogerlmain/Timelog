import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";

import LoadList from "client/controls/lists/load.list";
import FadePanel from "client/controls/panels/fade.panel";
import ClientSelector from "client/controls/selectors/client.selector";

import Container from "client/controls/container";

import { isset, integer_value, nested_value, not_set, debugging } from "client/classes/common";
import { page_names } from "client/master";

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

		if (debugging (false)) console.log (`${props.id} object created`);

	}// constructor;


	/********/


	// client_selected = () => { return nested_value (this.client_selector.current, "client_selected") }
	// project_selected = () => { return ((this.state.project_id > 0) || (OptionsStorage.single_project () && this.client_selected ())) }

	
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

				onChange={event => {

					let client_id = integer_value (event.target.value);

					this.setState ({ 
						client_id: client_id,
						project_data: ProjectStorage.get_by_client (client_id),
					}, () => this.execute (this.props.onClientChange, event))
					
				}}>

			</ClientSelector>
			
			<Container visible={multiple_projects}>

				<FadePanel visible={isset (this.state.client_id)}>
					<label htmlFor={`${this.props.id}_load_list`}>Project</label>
				</FadePanel>

				<LoadList id={this.props.id} label="Project"

					listHeader={this.props.headerSelectable ? "New project" : "Select a project"}
					headerSelectable={this.props.headerSelectable}

					dataIdField="project_id" dataTextField="name" data={this.state.project_data} selectedItem={this.state.project_id}
					newButtonPage={(this.props.newButton && isset (this.state.cliend_id)) ? page_names.projects : null} 
					
					disabled={not_set (this.state.client_id) && (!single_client)}

					onChange={event => this.setState ({ project_id: integer_value (event.target.value) }), event => this.execute (this.props.onProjectChange, event)}>

				</LoadList>
			</Container>

		</div>
	}// render;

}// ProjectSelector;