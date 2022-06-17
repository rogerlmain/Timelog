import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";

import Container from "client/controls/container";

import LoadList from "client/controls/lists/load.list";
import ExplodingPanel from "client/controls/panels/exploding.panel";
import FadePanel from "client/controls/panels/fade.panel";
import ClientSelector from "client/controls/selectors/client.selector";

import { isset, integer_value } from "classes/common";
import { master_pages } from "client/master";

import "client/resources/styles/gadgets/selector.gadget.css";


export default class ProjectSelector extends BaseControl {


	state = { client_id: null }


	static defaultProps = {

		id: null,
		selectedProject: null,

		onClientChange: null,
		onProjectChange: null,

		hasHeader: false,

	}// defaultProps;


	render () {

		let single_project = OptionsStorage.project_limit () == 1;

		return <div id={this.props.id} className="one-piece-form">

			<ClientSelector id="client_selector" clientId={this.state.client_id}
				hasHeader={this.props.hasHeader} headerSelectable={false} headerText="Select a client" 
				onChange={event => this.setState ({ 
					client_id: integer_value (event.target.value),
					project_id: null,
				}, () => this.execute (this.props.onClientChange, event))}>
			</ClientSelector>

			{ single_project ? <Container>
				<div>Project</div>
				<div>Default</div>
			</Container> : <LoadList id={this.props.id}

				label="Project"
				listHeader="Select a project"

				dataIdField="project_id"
				dataTextField="name"

				getData={() => { return isset (this.state.client_id) ? ProjectStorage.get_projects_by_client (this.state.client_id) : null }}
				
				newOptionPage={this.props.newOption? master_pages.projects.name : null} 
				selectedItem={this.props.selectedProject}
				visible={isset (this.state.client_id)}

				onChange={this.props.onProjectChange}>

			</LoadList>}

		</div>
	}// render;

}// ProjectSelector;