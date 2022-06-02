import React from "react";

import ProjectStorage from "classes/storage/project.storage";
import OptionStorage from "classes/storage/option.storage";

import Container from "controls/container";

import BaseControl from "controls/abstract/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";

import ProjectForm from "forms/project.form";

import { numeric_value, not_null, not_set, get_values } from "classes/common";
import { MasterContext } from "client/classes/types/contexts";

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


	static contextType = MasterContext;


	static defaultProps = { id: "projects_page" }


	/********/


	render () {

		let limit = OptionStorage.project_limit ();
		let option_value = get_values (project_limit_options) [limit - 1];
		let can_create = ((limit > 1) && (not_set (this.state.project_list) || (this.state.project_list.length < option_value) || (option_value == 0)));

		return <div id={this.props.id} className="top-center-container row-spaced">

			<div className="project-select-form">
				<ProjectSelectorGadget id="project_selector" ref={this.project_selector} parent={this} newOption={false}

					hasHeader={true}
					headerSelectable={can_create}
					headerText={can_create ? "New project" : "Select a project"}

					selectedClient={this.state.selected_client}
					selectedProject={this.state.selected_project}

					onClientChange={(event) => this.setState ({
						selected_client: numeric_value (event.target.value),
						selected_project: null,
						updating: true,
					})}

					onProjectChange={(event) => this.setState ({ 
						selected_project: numeric_value (event.target.value),
						updating: true,
					})}>

				</ProjectSelectorGadget>
			</div>	

			<EyecandyPanel id="project_panel" eyecandyVisible={this.state.updating} text="Loading..." 

				onEyecandy={async () => {

					let data = null;

					if (this.state.selected_project > 0) data = await ProjectStorage.get_by_project_id (this.context.company_id, this.state.selected_project);
					
					this.setState ({ 
						project_data: data,
						updating: false,
					});
				
				}}>

				<Container visible={not_null (this.state.selected_client)}>
					<ProjectForm formData={this.state.project_data} parent={this} clientId={this.state.selected_client} 
						onSave={() => this.project_selector.current.setState ({ projects_loading: true })}>
					</ProjectForm>
				</Container>
				
			</EyecandyPanel>

		</div>
	}// render;


}// ProjectsPage;