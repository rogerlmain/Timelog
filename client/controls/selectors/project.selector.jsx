import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";

import LoadList from "client/controls/lists/load.list";
import FadePanel from "client/controls/panels/fade.panel";
import ClientSelector from "client/controls/selectors/client.selector";

import Container from "client/controls/container";

import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { isset, integer_value, debugging, not_set } from "client/classes/common";
import { page_names } from "client/master";

import "resources/styles/gadgets/selector.gadget.css";


export default class ProjectSelector extends BaseControl {


	client_selector = React.createRef ();


	state = { 
		project_data: null,
		selected_client_id: null,
		selected_project_id: null,
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

		this.state.selected_client_id = this.props.clientId;
		this.state.selected_project_id = this.props.projectId;

		if (debugging (false)) console.log (`${props.id} object created`);

	}// constructor;


	/*********/


	render () {

		let single_project = (OptionsStorage.project_limit () == 1);

		return <div id={this.props.id} className="one-piece-form">

			<ClientSelector id="client_selector" ref={this.client_selector} parent={this} newButton={this.props.newButton}

				hasHeader={this.props.hasHeader} 
				headerSelectable={false} 
				headerText="Select a client" 
				selectedClient={this.state.selected_client_id}

				onChange={client_id => {

					if ((this.state.selected_client_id == client_id) || not_set (client_id)) return;

					this.setState ({ selected_client_id: client_id }, () => ProjectStorage.get_by_client (client_id).then (data => this.setState ({ project_data: data }, () => {
						let project_id = (data.length == 1) ? data [0].project_id : null;
						if ((this.state.selected_project_id == project_id) || not_set (project_id)) return;
						this.setState ({ selected_project_id: project_id }, () => this.execute (this.props.onProjectChange, project_id));
					})));

				}}>

			</ClientSelector>

			<FadePanel id={`${this.props.id}_project_selector_label_fade_panel`} visible={isset (this.state.selected_client_id)}>
				<label htmlFor={`${this.props.id}_load_list`}>Project<Container visible={single_project}>:</Container></label>
			</FadePanel>
			
			<FadePanel id={`${this.props.id}_project_selector_fade_panel`} visible={isset (this.state.selected_client_id)}>
				<LoadList id={this.props.id} label="Project" 

					listHeader={this.props.headerSelectable ? "New project" : "Select a project"}
					headerSelectable={this.props.headerSelectable}

					dataIdField="project_id" dataTextField="name" data={this.state.project_data} selectedItem={this.state.selected_project_id}
					newButtonPage={this.props.newButton ? page_names.projects : null} 
					
					hAlign={horizontal_alignment.stretch} vAlign={vertical_alignment.center}

					onChange={event => {
						let project_id = integer_value (event.target.value);
						this.setState ({ selected_project_id: project_id }, () => this.execute (this.props.onProjectChange, project_id));
					}}>

				</LoadList>
			</FadePanel>

		</div>
	}// render;

}// ProjectSelector;