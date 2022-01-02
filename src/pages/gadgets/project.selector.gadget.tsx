import React, { BaseSyntheticEvent } from "react";

import * as common from "classes/common";

import Database from "classes/database";
import BaseControl, { DefaultProps } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import SelectList from "controls/select.list";
import ProjectsModel from "models/projects";

import ClientSelectorGadget from "pages/gadgets/client.selector.gadget";


interface projectsPageProps extends DefaultProps {

	id: string;

	onLoad?: Function;
	onClientChange?: Function;
	onProjectChange: Function;

}// projectsPageProps;


interface projectsPageState {

	clients: any;
	projects: any;

	client_id: number;
	project_id: number;

}// state;


export default class ProjectSelectorGadget extends BaseControl<projectsPageProps, projectsPageState> {

	private project_list: React.RefObject<SelectList> = React.createRef ();

	private client_selector_id: any = null;
	private project_selector_id: any = null;


	private load_projects (callback: Function = null) {
		ProjectsModel.fetch_by_client (this.state.client_id, (data: Object) => {
			this.setState ({ projects: data }, () => {
				this.setState ({ projects_loaded: true }, callback);
			});
		});
	}// load_projects;


	/********/


	public props: projectsPageProps;
	public state: projectsPageState;


	public constructor (props: any) {
		super (props);
		this.client_selector_id = `${this.props.id}_client_selector`;
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
					<option value={0} style={{ fontStyle: "italic" }}>New</option>
					{this.select_options (this.state.projects, "project_id", "project_name")}
				</SelectList>

			</div>
		);
	}// render;

}// ProjectSelectorGadget;