import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import BaseControl, { DefaultProps } from "controls/base.control";
import SelectList from "controls/select.list";

import ClientSelectorGadget from "pages/gadgets/client.selector.gadget";


interface ProjectSelectorProps extends DefaultProps {

	id: string;

	clients: any;
	projects: any;

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
	selected_client: number;
	selected_project: number;
}// ProjectSelectorState;


export default class ProjectSelectorGadget extends BaseControl<ProjectSelectorProps, ProjectSelectorState> {


	private project_selector_id: any = null;


	/********/


	public static defaultProps: ProjectSelectorProps = {

		id: null,

		clients: null,
		projects: null,

		selectedClient: null,
		selectedProject: null,

		onLoad: null,
		onClientChange: null,
		onProjectChange: null,

		hasHeader: false,
		headerSelectable: false

	}/* ProjectSelectorProps */;


	public constructor (props: any) {
		super (props);
		this.project_selector_id = `${this.props.id}_project_selector`;
	}// constructor;


	public render () {
		return (
			<div id={this.props.id} className="two-column-grid project-selector-form">

				<ClientSelectorGadget id="client_selector" hasHeader={true} headerSelectable={false} clients={this.props.clients}
					onClientChange={(event: BaseSyntheticEvent) => this.execute (this.props.onClientChange, event)}>
				</ClientSelectorGadget>

				{common.isset (this.props.selectedClient) && <div style={{ display: "contents" }}>
					<label htmlFor={this.project_selector_id}>Project</label>

					<SelectList id={this.project_selector_id} data={this.props.projects} className="form-item" style={{ width: "100%" }}
						onChange={this.props.onProjectChange}>
						{(this.props.header || this.props.hasHeader) && <option value={0} style={{ fontStyle: "italic" }} disabled={this.props.headerSelectable}>{this.props.header}</option>}
						{this.select_options (this.props.projects, "project_id", "project_name")}
					</SelectList>
				</div>}

			</div>
		);
	}// render;

}// ProjectSelectorGadget;