import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import BaseControl, { DefaultProps } from "controls/base.control";
import SelectList from "controls/select.list";

import ClientSelectorGadget from "client/pages/gadgets/selectors/client.selector.gadget";
import Database from "client/classes/database";
import ProjectsModel from "client/models/projects";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";


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


	public componentDidMount (): void {
	}// componentDidMount;


	public render () {
		return (
			<div id={this.props.id} className="two-column-grid project-selector-form">

				<ClientSelectorGadget id="client_selector" hasHeader={true} headerSelectable={false}

					onClientChange={(event: BaseSyntheticEvent) => {
					
						ProjectsModel.fetch_by_client (this.state.selected_client, (data: Object) => this.setState ({ projects: data }));
						this.execute (this.props.onClientChange, event);
						
					}}>

				</ClientSelectorGadget>

				{common.isset (this.props.selectedClient) && <div style={{ display: "contents" }}>

					<label htmlFor={this.project_selector_id}>Project</label>

					<EyecandyPanel eyecandyVisible={common.is_null (this.state.projects)}>

						<SelectList id={this.project_selector_id} value={this.state.selected_project}
						
							headerText="New project" headerSelectable={true}
							idField="project_id" textField="project_name" data={this.state.projects}

							className="form-item" style={{ width: "100%" }}
							onChange={this.props.onProjectChange}>

						</SelectList>

					</EyecandyPanel>

				</div>}

			</div>
		);
	}// render;

}// ProjectSelectorGadget;