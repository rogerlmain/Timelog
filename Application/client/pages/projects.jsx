import React from "react";

import ProjectStorage from "client/classes/storage/project.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import BaseControl from "client/controls/abstract/base.control";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ProjectSelector from "client/controls/selectors/project.selector";

import ProjectForm from "client/forms/project.form";

import { vertical_alignment } from "client/classes/types/constants";
import { debug_state, isset, is_unlimited, jsonify } from "client/classes/common";
import { unlimited } from "client/classes/types/options";

import { MasterContext } from "client/classes/types/contexts";

import "resources/styles/pages/projects.css";


export const project_limit_options = {
	"1": 1,
	"5": 5,
	"10": 10,
	"50": 50,
	"Unlimited": unlimited,
}// project_limit_options;


export default class ProjectsPage extends BaseControl {


	project_selector = React.createRef ();


	state = {

		selected_client: null,
		selected_project: null,

		project_data: null,

		form_visible: false,
		updating: false,
		initialized: false,

	}// state;


	static contextType = MasterContext;


	static defaultProps = { id: "projects_page" }


	/********/


	update_projects = project_id => ProjectStorage.get_by_client (this.state.selected_client).then (data => {

		this.setState ({ 
			project_data: isset (project_id) ? ProjectStorage.get_by_id (project_id) : null,
			selected_project: project_id,
			updating: true,
		});

		this.project_selector.current.setState ({ 
			project_data: data,
			selected_project: project_id,
		});

	})/* update_projects */;


	/********/


	componentDidMount () { this.context.master_page.debug_state (this.state) }


	componentDidUpdate (props, state) {
		if (jsonify (this.state).matches (jsonify (state))) return true;
		this.context.master_page.debug_state (this.state);
	}/* componentDidMount */;


	render () {

		let project_data = this.project_selector.current?.state.project_data;
		let project_count = project_data?.key_length ();

		let can_create = (isset (this.state.selected_client) && ((OptionsStorage.project_slots (project_count) > 0) || is_unlimited (OptionsStorage.project_limit ())));

		return <div id={this.props.id} className="top-centered row-spaced">

			<div className="project-select-form">
				<ProjectSelector id="project_selector" ref={this.project_selector} parent={this} includeOffshoreAccounts={false} newClientButton={true}

					headerText={can_create ? "New project" : ((project_count > 1) ? "Select a project" : null)}
					headerSelectable={can_create} allowStatic={false}
/* 
					selectedClient={this.state.selected_client}
					selectedProject={this.state.selected_project}
 */
					onClientChange={client_id => this.setState ({
						selected_client: client_id,
						selected_project: null,
						updating: true,
					})}

					onProjectChange={project_id => this.setState ({ 
						selected_project: project_id,
						updating: true,
					})}>

				</ProjectSelector>
			</div>

			<EyecandyPanel id="project_panel" eyecandyVisible={this.state.updating} text="Loading..." vAlign={vertical_alignment.center}

				onEyecandy={() => ProjectStorage.get_by_id (this.state.selected_project).then (data => this.setState ({ 
					project_data: data,
					updating: false,
					initialized: true
				}))}>

				{(this.state.initialized && can_create) && <ProjectForm parent={this}

					formData={this.state.project_data} clientId={this.state.selected_client} 

					onSave={project => this.update_projects (project.project_id)}
					onDelete={() => this.update_projects (null)}>

				</ProjectForm>}
				
			</EyecandyPanel>

		</div>
	}// render;


}// ProjectsPage;