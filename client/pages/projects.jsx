import React from "react";

import ProjectStorage from "client/classes/storage/project.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import Container from "client/controls/container";

import BaseControl from "client/controls/abstract/base.control";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ProjectSelector from "client/controls/selectors/project.selector";

import ProjectForm from "client/forms/project.form";

import { numeric_value, not_null, not_set, get_values, nested_value } from "client/classes/common";
import { MasterContext } from "client/classes/types/contexts";

import "resources/styles/pages/projects.css";


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

		form_visible: false,
		updating: false,

	}// state;


	static contextType = MasterContext;


	static defaultProps = { id: "projects_page" }


	/********/


	componentDidMount = () => this.setState ({ form_visible: nested_value (this.project_selector.current, "client_selected") });


	shouldComponentUpdate (new_props, new_state) {

		let client_selected = nested_value (this.project_selector.current, "client_selected");

		if (new_state.form_visible != client_selected) {
			this.setState ({ form_visible: client_selected });
			return false;
		}// if;

		return true;
	}// shouldComponentUpdate;


	render () {

		let limit = OptionsStorage.project_limit ();
		let option_value = get_values (project_limit_options) [limit - 1];
		let can_create = ((limit > 1) && (not_set (this.state.project_list) || (this.state.project_list.length < option_value) || (option_value == 0)));

		return <div id={this.props.id} className="top-centered row-spaced">

			<div className="project-select-form">
				<ProjectSelector id="project_selector" ref={this.project_selector} parent={this}

					hasHeader={true}

					headerSelectable={can_create}

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

				</ProjectSelector>
			</div>	

			<EyecandyPanel id="project_panel" eyecandyVisible={this.state.updating} text="Loading..." 

				onEyecandy={async () => {

					let data = null;

					if (this.state.selected_project > 0) data = await ProjectStorage.get_by_id (this.state.selected_project);
					
					this.setState ({ 
						project_data: data,
						updating: false,
					});
				
				}}>

				<Container visible={this.state.form_visible}>
					<ProjectForm formData={this.state.project_data} parent={this} clientId={this.state.selected_client} 
						onSave={() => this.project_selector.current.setState ({ projects_loading: true })}>
					</ProjectForm>
				</Container>
				
			</EyecandyPanel>

		</div>
	}// render;


}// ProjectsPage;