import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import { is_object } from "classes/common";

import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";
import TeamSelectorGadget from "client/pages/gadgets/selectors/team.selector.gadget";
import ProjectsModel from "models/projects";
import ProjectForm from "pages/forms/project.form";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import { globals } from "types/globals";
import { ProjectData } from "types/datatypes";
import Database from "client/classes/database";
import EyecandyForm from "client/controls/forms/eyecandy.form";


interface ProjectsPageState extends DefaultState {

	client_list: any;
	project_list: any;

	selected_client: number;
	selected_project: number;

	project_data: ProjectData;

}// ProjectsPageState;


export default class ProjectsPage extends BaseControl<DefaultProps, ProjectsPageState> {

	private project_form: React.RefObject<ProjectForm> = React.createRef ();
	private team_selector: React.RefObject<TeamSelectorGadget> = React.createRef ();


	private load_projects () {
		return new Promise ((resolve, reject) => {
			try {
				ProjectsModel.fetch_by_client (this.state.selected_client, (data: Object) => this.setState ({ project_list: data }, resolve));
			} catch (except) {
				reject (except.getMessage ());
			}// try;
		});
	}// load_projects;


	private load_project () {
		ProjectsModel.fetch_by_id (this.state.selected_project, (data: any) => {
			this.setState ({ project_data: data });
		});
	}// load_project;


	/********


	private reset_form (callback: any) {
		if (this.project_loaded ()) return this.setState ({ project_loaded: false }, () => {
			this.team_selector.current.reset ();
			callback ();
		});
		callback ();
	}// reset_form;


	/********/


	public state: ProjectsPageState = {

		client_list: null,
		project_list: null,

		selected_client: null,
		selected_project: null,

		project_data: null,

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
						headerSelectable={true}

						selectedClient={this.state.selected_client}
						selectedProject={this.state.selected_project}

						onClientChange={(event: BaseSyntheticEvent) => this.setState ({ selected_client: event.target.value }) }
						onProjectChange={(event: BaseSyntheticEvent) => this.setState ({ selected_project: event.target.value })}>

					</ProjectSelectorGadget>
				</div>

				{common.isset (this.state.selected_client) && <EyecandyForm table="projects" action="details" idField="project_id" idValue={this.state.selected_project}>
					<ProjectForm clientId={this.state.selected_client} onSave={(data: ProjectData) => this.setState ({ project_data: data })} />
				</EyecandyForm>}

			</div>

		);
	}// render;


}// ProjectsPage;