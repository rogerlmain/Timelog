import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import { is_object } from "classes/common";

import ProjectSelectorGadget from "pages/gadgets/project.selector.gadget";
import TeamSelectorGadget from "pages/gadgets/team.selector.gadget";
import ProjectsModel from "models/projects";
import ProjectForm from "pages/forms/project.form";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import { globals } from "types/globals";
import { ProjectData } from "types/datatypes";
import Database from "client/classes/database";


interface ProjectsPageState extends DefaultState {

	client_list: any;
	project_list: any;

	selected_client: number;
	selected_project: number;

	project_loading: boolean;
	project_data: ProjectData;

}// ProjectsPageState;


export default class ProjectsPage extends BaseControl<DefaultProps, ProjectsPageState> {

	private project_form: React.RefObject<ProjectForm> = React.createRef ();
	private team_selector: React.RefObject<TeamSelectorGadget> = React.createRef ();


	private project_loaded = () => is_object (this.state.selected_project);


	private load_clients () {
		return new Promise ((resolve, reject) => {
			try {
				Database.fetch_data ("clients", { action: "list" }).then ((data: any) => this.setState ({ client_list: data }, resolve));
			} catch (except) {
				reject (except.getMessage ());
			}// try;
		});
	}// load_clients;

	private load_projects (callback: Function = null) {
		ProjectsModel.fetch_by_client (this.state.selected_client, (data: Object) => {
			this.setState ({ projects: data }, () => {
				this.setState ({ projects_loaded: true }, callback);
			});
		});
	}// load_projects;


	private load_project () {
		ProjectsModel.fetch_by_id (this.state.selected_project, (data: any) => {
			this.setState ({ 
				project_loading: false,
				project_data: data 
			});
		});
	}// load_project;


	/********/


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

		project_loading: false,
		project_data: null,

	}// state;


	public constructor (props: DefaultProps) {
		super (props);
		globals.projects_page = this;
	}// constructor;


	public async getSnapshotBeforeUpdate (old_props: DefaultProps, old_state: ProjectsPageState) {
		if (common.is_null (this.state.client_list)) {
			await this.load_clients ();
		}
	}// getSnapshotBeforeUpdate;


	public render () {
		return (

			<div id="project_page" className="top-center-container">

				<div className="project-select-form">

					<link rel="stylesheet" href="/resources/styles/pages/projects.css" />

					<ProjectSelectorGadget id="project_selector" parent={this} 

						clients={this.state.client_list} 
						projects={this.state.project_list}
						
						selectedClient={this.state.selected_client}
						selectedProject={this.state.selected_project}

						onClientChange={() => { this.reset_form (() => { this.setState ({ client_selected: true }) }) }}
						onProjectChange={(event: BaseSyntheticEvent) => this.setState ({ 
							project_loading: true,
							selected_project: event.target.value
						})}>
					</ProjectSelectorGadget>

				</div>

				{common.isset (this.state.selected_client) && <div style={{ marginTop: "2em" }}>
					<ProjectForm projectData={this.state.project_data} onSave={(data: ProjectData) => this.setState ({ project_data: data })} />
				</div>}

			</div>

		);
	}// render;


}// ProjectsPage;