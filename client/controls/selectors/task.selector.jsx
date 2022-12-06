import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";

import LoadList from "client/controls/lists/load.list";
import FadePanel from "client/controls/panels/fade.panel";

import ProjectSelector from "client/controls/selectors/project.selector";

import Container from "client/controls/container";

import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { isset, integer_value, debugging, not_set } from "client/classes/common";
import { page_names } from "client/master";

import "resources/styles/gadgets/selector.gadget.css";
import DropDownList from "../lists/drop.down.list";


export default class TaskSelector extends BaseControl {


	client_selector = React.createRef ();


	state = { 
		client_list: null,
		project_data: null,
		selected_client_id: null,
		selected_project_id: null,
	}// state;


	static defaultProps = {

		id: null,

		selectedClient: null,
		selectedProject: null,

		onClientChange: null,
		onProjectChange: null,

		hasHeader: false,
		headerSelectable: false,

		includeOffshoreAccounts: true,

		headerText: "Select a project",

	}// defaultProps;


	render = () => <div className="borderline one-piece-form">
	
		<ProjectSelector id="project_selector" ref={this.selector} parent={this} newButton={true} embedded={true}

			clientId={this.props.selectedClient} projectId={this.props.selectedProject}

			hasHeader={true} 
			headerSelectable={false} 

			onClientChange={client_id => this.setState ({ current_entry: {...this.state.current_entry, client_id: client_id } })}
			onProjectChange={project_id => this.setState ({ current_entry: {...this.state.current_entry, project_id: project_id } })}>

		</ProjectSelector>

		{(this.state.current_entry?.project_id > 0) ? <Container>
			<label htmlFor={`${this.props.id}_task_list`}>Task</label>
			<DropDownList id={`${this.props.id}_task_list`} style={{ width: "100%" }} />
		</Container> : null}

	</div>


}// TaskSelector;