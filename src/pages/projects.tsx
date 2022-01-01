import React, { BaseSyntheticEvent } from "react";

import ProjectSelecterGadget from "pages/gadgets/project.selector.gadget";
import TeamSelectorGadget from "pages/gadgets/team.selector.gadget";
import ProjectsModel from "models/projects";
import ProjectForm from "pages/forms/project.form";
import EyecandyPanel from "controls/panels/eyecandy.panel";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import { globals } from "types/globals";


interface ProjectsPageState extends DefaultState {
	client_selected: boolean;

	form_visible: boolean;
	eyecandy_visible: boolean;

	project_loaded: boolean;
	project_accounts: any;
}// ProjectsPageState;


export default class ProjectsPage extends BaseControl<DefaultProps, ProjectsPageState> {

	private project_form: React.RefObject<ProjectForm> = React.createRef ();
	private team_selector: React.RefObject<TeamSelectorGadget> = React.createRef ();

	private active_project: number = null;


	private fetch_project () {
		ProjectsModel.fetch_by_id (this.active_project, (data: any) => {
			this.project_form.current.setState ({ project_data: data });
		});
	}// fetch_project;


	private reset_form (callback: any) {
		if (this.state.project_loaded) return this.setState ({ project_loaded: false }, () => {
			this.team_selector.current.reset ();
			callback ();
		});
		callback ();
	}// reset_form;


	/********/


	public state: ProjectsPageState;


	public constructor (props: DefaultProps) {
		super (props);
		globals.projects_page = this;
	}// constructor;


	public componentDidMount () {
		this.setState ({
			client_selected: false,
			eyecandy_visible: false,
			form_visible: false,
			project_loaded: false,

			project_accounts: null,
		});
		let x = this.team_selector.current;
	}// componentDidMount;


	public componentDidUpdate () {
		super.componentDidUpdate ();
		let x = this.project_form.current;
	}// componentDidUpdate;


	public render () {
		return (

			<div id="project_page" className="top-center-container">

				<div className="project-select-form">

					<link rel="stylesheet" href="/resources/styles/pages/projects.css" />

					<ProjectSelecterGadget id="project_selecter" parent={this}
						onClientChange={() => { this.reset_form (() => { this.setState ({ client_selected: true }) }) }}
						onProjectChange={(event: BaseSyntheticEvent) => { 
							this.active_project = parseInt (event.target.value);
							this.setState ({ eyecandy_visible: true }, () => { 
								alert ("eyecandy updated");
							})
						}}>
					</ProjectSelecterGadget>

				</div>


				<div style={{ marginTop: "2em" }}>
					<EyecandyPanel eyecandyActive={this.return (this.state.eyecandy_visible)} 

						afterShowingEyecandy={() => this.fetch_project ()}>

						<ProjectForm ref={this.project_form} style={this.set_visibility (this.state.form_visible)} />

					</EyecandyPanel>
				</div>

			</div>

		);
	}// render;


}// ProjectsPage;