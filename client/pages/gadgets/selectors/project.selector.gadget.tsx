import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import BaseControl, { DefaultProps } from "controls/base.control";
import SelectList from "controls/select.list";

import ClientSelectorGadget from "client/pages/gadgets/selectors/client.selector.gadget";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import FadePanel from "client/controls/panels/fade.panel";
import ProjectsModel from "client/models/projects";


interface ProjectSelectorProps extends DefaultProps {

	id: string;

	selectedClient: number;
	selectedProject: number;

	onLoad?: any;
	onClientChange?: any;
	onProjectChange: any;

	header?: string;
	hasHeader?: boolean;
	headerSelectable?: boolean;

}// ProjectSelectorProps;


interface ProjectSelectorState {
	
	projects: any;

	selected_client: number;
	selected_project: number;

}// ProjectSelectorState;


export default class ProjectSelectorGadget extends BaseControl<ProjectSelectorProps, ProjectSelectorState> {


	private project_selector_id: any = null;

	/********/


	public static defaultProps: ProjectSelectorProps = {

		id: null,

		selectedClient: null,
		selectedProject: null,

		onLoad: null,
		onClientChange: null,
		onProjectChange: null,

		hasHeader: false,
		headerSelectable: false

	}// defaultProps;


	public state: ProjectSelectorState = {

		projects: null,

		selected_project: 0,
		selected_client: 0

	}// state;


	public constructor (props: any) {
		super (props);
		this.project_selector_id = `${this.props.id}_project_selector`;
	}// constructor;


	public render () {

		let client_loaded: boolean = (this.state.selected_client != 0);
		let projects_loaded: boolean = common.isset (this.state.projects);

		return (
			<div id={this.props.id} className="two-column-grid project-selector-form">

				<ClientSelectorGadget id="client_selector" headerText="" hasHeader={true} headerSelectable={false} onClientChange={(event: BaseSyntheticEvent) => {
					this.setState ({ 
						projects: null,
						selected_client: event.target.value 
					}, () => {
						ProjectsModel.fetch_by_client (this.state.selected_client, (data: Object) => this.setState ({ projects: data }));
						this.execute (this.props.onClientChange, event);
					});
				}} />

				<FadePanel id={`${this.props.id}_projects_label`} visible={client_loaded} animate={true} className="vertical-centering-container">
					<label htmlFor={this.project_selector_id}>Project</label>
				</FadePanel>

				<FadePanel id={`${this.props.id}_projects_list`} visible={client_loaded} animate={true}>
					<EyecandyPanel id={`${this.props.id}_select_list`} eyecandyText="Loading..." eyecandyVisible={!projects_loaded}>
						<SelectList id={this.project_selector_id} value={this.state.selected_project} data={this.state.projects}
						
							headerText="New project" headerSelectable={true}
							idField="project_id" textField="project_name"

							className="form-item" style={{ width: "100%" }}
							onChange={this.props.onProjectChange}>

						</SelectList>
					</EyecandyPanel>
				</FadePanel>

			</div>
		);
	}// render;

}// ProjectSelectorGadget;

