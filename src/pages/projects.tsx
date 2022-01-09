import React, { BaseSyntheticEvent } from "react";

import { is_object } from "classes/common";

import ProjectSelectorGadget from "pages/gadgets/project.selector.gadget";
import TeamSelectorGadget from "pages/gadgets/team.selector.gadget";
import ProjectsModel from "models/projects";
import ProjectForm from "pages/forms/project.form";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import { globals } from "types/globals";
import { ProjectData } from "types/datatypes";


interface ProjectsPageState extends DefaultState {

	client_selected: boolean;

	project_loading: boolean;
	project_data: ProjectData;

	selected_project: number;

}// ProjectsPageState;


export default class ProjectsPage extends BaseControl<DefaultProps, ProjectsPageState> {

	private project_form: React.RefObject<ProjectForm> = React.createRef ();
	private team_selector: React.RefObject<TeamSelectorGadget> = React.createRef ();


	private project_loaded = () => is_object (this.state.selected_project);


	private fetch_project () {
		ProjectsModel.fetch_by_id (this.state.selected_project, (data: any) => {
			this.setState ({ 
				project_loading: false,
				project_data: data 
			});
		});
	}// fetch_project;


	private reset_form (callback: any) {
		if (this.project_loaded ()) return this.setState ({ project_loaded: false }, () => {
			this.team_selector.current.reset ();
			callback ();
		});
		callback ();
	}// reset_form;


	/********/


	public state: ProjectsPageState = {
		client_selected: false,
		project_loading: false,
		project_data: null,
		selected_project: null
	}// state;


	public constructor (props: DefaultProps) {
		super (props);
		globals.projects_page = this;
	}// constructor;


	public render () {
		return (

			<div id="project_page" className="top-center-container">

				<div className="project-select-form">

					<link rel="stylesheet" href="/resources/styles/pages/projects.css" />

					<ProjectSelectorGadget id="project_selector" parent={this}
						onClientChange={() => { this.reset_form (() => { this.setState ({ client_selected: true }) }) }}
						onProjectChange={(event: BaseSyntheticEvent) => this.setState ({ 
							project_loading: true,
							selected_project: event.target.value
						})}>
					</ProjectSelectorGadget>

				</div>

				<div style={{ marginTop: "2em" }}>
					<EyecandyPanel visible={true} eyecandyActive={this.state.project_loading} afterShowingEyecandy={() => this.fetch_project ()}>
						<ProjectForm projectData={this.state.project_data} onSave={(data: ProjectData) => this.setState ({ project_data: data })} />
					</EyecandyPanel>
				</div>

			</div>

		);
	}// render;


}// ProjectsPage;