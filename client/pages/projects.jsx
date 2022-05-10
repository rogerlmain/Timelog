import React from "react";

import Projects from "classes/storage/projects";
import Options from "classes/storage/options";

import Container from "controls/container";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";

import ProjectsModel from "models/projects";

import ProjectForm from "forms/project.form";

import { isset, nested_value, not_set, not_empty } from "classes/common";

import "client/resources/styles/pages/projects.css";


export const project_limit_options = {
	"1": 1,
	"5": 5,
	"10": 10,
	"50": 50,
	"Unlimited": 0,
}// project_limit_options;


export default class ProjectsPage extends BaseControl {


	project_selector = React.createRef ();


	state = {

		client_list: null,
		project_list: null,

		selected_client: null,
		selected_project: null,

		project_data: null,

		updating: false

	}// state;


	static defaultProps = { id: "projects_page" }


	/********/


	update_project_list = () => {
		if (isset (this.project_selector.current)) this.project_selector.current.reload_projects ();

	//	if (not_null (this.state.selected_client)) Projects.get_all (this.state.selected_client).then (data => this.setState ({ project_list: data })) 
	}


	componentDidMount = this.update_project_list;


	render () {

		let limit = Options.project_limit ();
		let option_value = Object.values (project_limit_options) [limit - 1];
		let can_create = ((limit > 1) && (not_set (this.state.project_list) || (this.state.project_list.length < option_value) || (option_value == 0)));

		return <div id={this.props.id} className="top-center-container row-spaced">

			<div className="project-select-form">
				<ProjectSelectorGadget id="project_selector" ref={this.project_selector} parent={this} 

					hasHeader={true}
					headerSelectable={can_create}
					headerText={can_create ? "New project" : "Select a project"}

					selectedClient={this.state.selected_client}
					selectedProject={this.state.selected_project}

					onClientChange={(event) => this.setState ({
						selected_client: event.target.value,
						selected_project: 0,
						project_data: null,
						updating: isset (this.state.selected_project),
					})}

					onProjectChange={(event) => this.setState ({ 
						selected_project: parseInt (event.target.value),
						updating: true,
					})}>

				</ProjectSelectorGadget>
			</div>	

			<Container condition={isset (this.state.selected_client)}>
				<EyecandyPanel id="project_panel" eyecandyVisible={this.state.updating} text="Loading..." 

					onEyecandy={() => {
						if (this.state.updating) ProjectsModel.fetch_by_id (this.state.selected_project).then ((data) => this.setState ({
							project_data: not_empty (data) ? data : null,
							updating: false,
						}));
					}}>

					<ProjectForm clientId={this.state.selected_client} formData={this.state.project_data} 
						onSave={(data) => this.setState ({ project_data: data })} parent={this}>
					</ProjectForm>
					
				</EyecandyPanel>
			</Container>

		</div>
	}// render;


}// ProjectsPage;