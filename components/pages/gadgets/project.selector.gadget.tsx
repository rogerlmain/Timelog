import React, { BaseSyntheticEvent } from "react";

import BaseControl, { DefaultProps } from "controls/base.control";
import SelectList from "controls/select.list";
import ProjectsModel from "models/projects";

import ClientSelectorGadget from "pages/gadgets/client.selector.gadget";


interface ProjectSelectorProps extends DefaultProps {

	id: string;

	onLoad?: any;
	onClientChange?: any;
	onProjectChange: any;

	header?: string;
	hasHeader?: boolean;
	headerSelectable?: boolean;

}// ProjectSelectorProps;


interface ProjectSelectorState {

	clients: any;
	projects: any;

	client_id: number;
	project_id: number;

}// ProjectSelectorState;


export default class ProjectSelectorGadget extends BaseControl<ProjectSelectorProps, ProjectSelectorState> {

	private project_list: React.RefObject<SelectList> = React.createRef ();

	private project_selector_id: any = null;


	private load_projects (callback: Function = null) {
		ProjectsModel.fetch_by_client (this.state.client_id, (data: Object) => {
			this.setState ({ projects: data }, () => {
				this.setState ({ projects_loaded: true }, callback);
			});
		});
	}// load_projects;


	/********/


	public static defaultProps: ProjectSelectorProps = {
		id: null,
		onLoad: null,
		onClientChange: null,
		onProjectChange: null,
		hasHeader: false,
		headerSelectable: false
	}/* ProjectSelectorProps */;

	public state: ProjectSelectorState = {
		clients: null,
		client_id: null,

		projects: null,
		project_id: null
	}/* ProjectsPage State */;


	public constructor (props: any) {
		super (props);
		this.project_selector_id = `${this.props.id}_project_selector`;
	}// constructor;


	public render () {
		return (
			<div id={this.props.id} className="two-column-grid project-selector-form">

				<ClientSelectorGadget id="client_selector" hasHeader={true} headerSelectable={false}
					onClientChange={(event: BaseSyntheticEvent) => {
						this.setState ({ client_id: event.target.value }, () => this.load_projects (this.props.onClientChange));
					}}>
				</ClientSelectorGadget>

				<label htmlFor={this.project_selector_id}>Project</label>

				<SelectList id={this.project_selector_id} ref={this.project_list} className="form-item" style={{ width: "100%" }}
					onChange={this.props.onProjectChange}>
					{(this.props.header || this.props.hasHeader) && <option value={0} style={{ fontStyle: "italic" }} disabled={this.props.headerSelectable}>{this.props.header}</option>}
					{this.select_options (this.state.projects, "project_id", "project_name")}
				</SelectList>

			</div>
		);
	}// render;

}// ProjectSelectorGadget;