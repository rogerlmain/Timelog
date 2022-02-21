
import React, { BaseSyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";
import ProjectsModel from "models/projects";
import ProjectForm from "pages/forms/project.form";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import { globals } from "types/globals";
import { ProjectData } from "types/datatypes";
import { isset } from "client/classes/common";


interface ProjectsPageState extends DefaultState {

	client_list: any;
	project_list: any;

	selected_client: number;
	selected_project: number;

	project_data: ProjectData;

	updating: boolean;

}// ProjectsPageState;


export default class ProjectsPage extends BaseControl<DefaultProps, ProjectsPageState> {

	public state: ProjectsPageState = {

		client_list: null,
		project_list: null,

		selected_client: null,
		selected_project: null,

		project_data: null,

		updating: false

	}// state;


	public constructor (props: DefaultProps) {
		super (props);
		globals.projects_page = this;
	}// constructor;


	public render () {
		return (

			<div id="project_page" className="top-center-container row-spaced">

				<link rel="stylesheet" href="/resources/styles/pages/projects.css" />

				<div className="project-select-form">
					<ProjectSelectorGadget id="project_selector" parent={this} 

						hasHeader={true}
						headerText="New project"
						headerSelectable={true}

						selectedClient={this.state.selected_client}
						selectedProject={this.state.selected_project}

						onClientChange={(event: BaseSyntheticEvent) => this.setState ({ 
							selected_client: event.target.value,
							selected_project: 0,
							project_data: null
						})}

						onProjectChange={(event: BaseSyntheticEvent) => this.setState ({ 
							updating: true,
							selected_project: parseInt (event.target.value)
						})}>

					</ProjectSelectorGadget>
				</div>	

				{isset (this.state.selected_client) && <EyecandyPanel id="project_panel" eyecandyVisible={this.state.updating} eyecandyText="Loading..." 

					onEyecandy={() => {
						if (this.state.updating) ProjectsModel.fetch_by_id (this.state.selected_project).then ((data: ProjectData) => this.setState ({
							project_data: data,
							updating: false
						}));
					}}>

					<ProjectForm clientId={this.state.selected_client} formData={this.state.project_data} onSave={(data: ProjectData) => this.setState ({ project_data: data })} />
					
				</EyecandyPanel>}

			</div>

		);
	}// render;


}// ProjectsPage;