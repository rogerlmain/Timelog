
import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";
import ProjectsModel from "models/projects";
import ProjectForm from "forms/project.form";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import { isset } from "classes/common";

import "client/resources/styles/pages/projects.css";


export default class ProjectsPage extends BaseControl {

	static defaultProps = { id: "projects_page" }


	state = {

		client_list: null,
		project_list: null,

		selected_client: null,
		selected_project: null,

		project_data: null,

		updating: false

	}// state;


	render () {
		return (

			<div id={this.props.id} className="top-center-container row-spaced">

				<div className="project-select-form">
					<ProjectSelectorGadget id="project_selector" parent={this} 

						hasHeader={true}
						headerText="New project"
						headerSelectable={true}

						selectedClient={this.state.selected_client}
						selectedProject={this.state.selected_project}

						onClientChange={(event) => this.setState ({ 
							selected_client: event.target.value,
							selected_project: 0,
							project_data: null
						})}

						onProjectChange={(event) => this.setState ({ 
							updating: true,
							selected_project: parseInt (event.target.value)
						})}>

					</ProjectSelectorGadget>
				</div>	

				{isset (this.state.selected_client) && <EyecandyPanel id="project_panel" eyecandyVisible={this.state.updating} eyecandyText="Loading..." 

					onEyecandy={() => {
						if (this.state.updating) ProjectsModel.fetch_by_id (this.state.selected_project).then ((data) => this.setState ({
							project_data: data,
							updating: false
						}));
					}}>

					<ProjectForm clientId={this.state.selected_client} formData={this.state.project_data} onSave={(data) => this.setState ({ project_data: data })} />
					
				</EyecandyPanel>}

			</div>

		);
	}// render;


}// ProjectsPage;