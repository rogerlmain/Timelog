import React from "react";

import ProjectStorage from "client/classes/storage/project.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import BaseControl from "client/controls/abstract/base.control";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ProjectSelector from "client/controls/selectors/project.selector";

import ProjectForm from "client/forms/project.form";

import { vertical_alignment } from "client/classes/types/constants";
import { debug_state, isset, is_unlimited, jsonify, not_null } from "client/classes/common";
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
		});

		this.project_selector.current.setState ({ 
			project_data: data,
			selected_project: project_id,
		});

	})/* update_projects */;


	/********/


	render () {

		let project_data = this.project_selector.current?.state.project_data ?? null;
		let project_count = project_data?.key_length () ?? 0;

		let can_create = (isset (project_data) && (OptionsStorage.project_slots (project_count) > 0)) || is_unlimited (OptionsStorage.project_limit ());

		let header_text = can_create ? "New project" : ((project_count > 1) ? "Select a project" : null);

		return <div id={this.props.id} className="top-centered row-spaced">

			<div className="project-select-form">
				<ProjectSelector id="project_selector" ref={this.project_selector} parent={this} includeOffshoreAccounts={false} newClientButton={true}

					headerText={header_text} hasHeader={true}
					headerSelectable={can_create} allowStatic={false}

					onClientChange={client_id => this.setState ({ 
						selected_client: client_id, 
						selected_project: null,
					})}

					onProjectChange={project_id => this.setState ({ 
						selected_project: project_id,
						updating: (can_create || not_null (project_data)),
						initialized: true,
					})}>

				</ProjectSelector>
			</div>

			<EyecandyPanel id="project_panel" eyecandyVisible={this.state.updating} text="Loading..." vAlign={vertical_alignment.center}

				onEyecandy={() => ProjectStorage.get_by_id (this.state.selected_project).then (data => this.setState ({ 
					project_data: data,
					updating: false,
				}))}>

				{(this.state.initialized && (can_create || isset (this.state.selected_project))) && <ProjectForm parent={this}

					formData={this.state.project_data} clientId={this.state.selected_client} 

					onSave={project => this.update_projects (project.project_id)}
					onDelete={() => this.update_projects (null)}>

				</ProjectForm>}
				
			</EyecandyPanel>

		</div>
	}// render;


}// ProjectsPage;