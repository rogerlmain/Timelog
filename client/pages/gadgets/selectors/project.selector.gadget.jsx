import * as common from "classes/common";

import React, { BaseSyntheticEvent } from "react";

import BaseControl, { DefaultProps } from "client/controls/abstract/base.control";
import SelectList from "controls/select.list";

import ClientSelectorGadget from "client/pages/gadgets/selectors/client.selector.gadget";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import FadePanel from "client/controls/panels/fade.panel";
import ProjectsModel from "client/models/projects";

import { blank } from "classes/types/constants";
import { isset } from "classes/common";


export default class ProjectSelectorGadget extends BaseControl {


	project_selector_id = null;

	
	/********/


	static defaultProps = {

		id: null,

		selectedClient: null,
		selectedProject: null,

		onLoad: null,
		onClientChange: null,
		onProjectChange: null,

		onClientsLoaded: null,

		headerText: null,
		hasHeader: false,
		headerSelectable: true

	}// defaultProps;


	state = {

		projects: null,

		selected_project: 0,
		selected_client: 0

	}// state;


	constructor (props) {
		super (props);
		this.project_selector_id = `${this.props.id}_project_selector`;
	}// constructor;


	render () {

		let client_loaded = (this.state.selected_client != 0);
		let projects_loaded = common.isset (this.state.projects);

		return (
			<div id={this.props.id} className="two-column-grid project-selector-form">

				<ClientSelectorGadget id="client_selector" companyId={this.props.companyId} 
				
					hasHeader={this.props.hasHeader} headerSelectable={false} headerText={this.props.headerText} 

					onClientChange={event => {
						this.setState ({ 
							projects: null,
							selected_client: event.target.value 
						}, () => {
							ProjectsModel.fetch_by_client (this.state.selected_client, data => this.setState ({ projects: data }));
							this.execute (this.props.onClientChange, event);
						});
					}}>
						
				</ClientSelectorGadget>

				<FadePanel id={`${this.props.id}_projects_label`} visible={client_loaded} className="vertically-center">
					<label htmlFor={this.project_selector_id}>Project</label>
				</FadePanel>

				<FadePanel id={`${this.props.id}_projects_list`} visible={client_loaded}>
					<EyecandyPanel id={`${this.props.id}_select_list`} text="Loading..." eyecandyVisible={!projects_loaded} stretchOnly={true}>
						<div style={{ display: "flex" }}>
							<SelectList id={this.project_selector_id} value={this.state.selected_project} data={this.state.projects}
							
								hasHeader={this.props.hasHeader || isset (this.props.headerText)}
								headerSelectable={this.props.headerSelectable}
								headerText={this.props.headerText}

								idField="project_id" textField="project_name"

								className="form-item" style={{ flex: 1 }}
								onChange={this.props.onProjectChange}>

							</SelectList>
						</div>
					</EyecandyPanel>
				</FadePanel>

			</div>
		);
	}// render;

}// ProjectSelectorGadget;

