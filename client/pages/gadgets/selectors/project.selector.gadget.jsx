import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";
import SelectList from "client/controls/select.list";

import Container from "client/controls/container";

import FadePanel from "client/controls/panels/fade.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ClientSelectorGadget from "client/pages/gadgets/selectors/client.selector.gadget";

import { isset, is_null, integer_value, not_set } from "classes/common";
import { master_pages } from "client/master";

import { MasterContext } from "client/classes/types/contexts";

import "client/resources/styles/gadgets/selector.gadget.css";


export default class ProjectSelectorGadget extends BaseControl {


	project_selector_id = null;

	
	state = {

		projects: null,

		selected_project: 0,
		selected_client: 0,

		projects_loading: false,

	}// state;


	static contextType = MasterContext;


	static defaultProps = {

		id: null,

		newOption: false,

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


	constructor (props) {
		super (props);
		this.project_selector_id = `${this.props.id}_project_selector`;
	}// constructor;


	/********/


	load_projects = () => {
		ProjectStorage.get_projects (this.context.company_id, this.state.selected_client).then (data => {
			this.setState ({ projects: data }, this.setState ({ projects_loading: false }));
		});
	}/* load_projects */;


	/********/


	shouldComponentUpdate (next_props, next_state, next_context) {
		if (this.context.company_id != next_context.company_id) return !!this.setState ({ selected_client: 0 });
		if (this.props.selectedProject != next_props.selectedProject) return !!this.setState ({ selected_project: next_props.selectedProject });
		return true;
	}// shouldComponentUpdate;


	render () {

		let single_client = OptionsStorage.client_limit () == 1;
		let single_project = OptionsStorage.project_limit () == 1;

		let client_selected = (this.state.selected_client > 0) || single_client;
		let has_projects = isset (this.state.projects) || (!this.props.newOption);
		
		return <div id={this.props.id} className="two-column-grid project-selector-form">

			<ClientSelectorGadget id="client_selector" companyId={this.props.companyId}
				hasHeader={this.props.hasHeader} headerSelectable={false} headerText="Select a client" 
				onClientChange={event => this.setState ({ 
					selected_client: integer_value (event.target.value),
					projects_loading: true,
				}, () => this.execute (this.props.onClientChange, event))}>
			</ClientSelectorGadget>

			<FadePanel id={`${this.props.id}_projects_label`} visible={client_selected || single_project} className="project-selector-label">
				<label htmlFor={this.project_selector_id}>Project</label>
			</FadePanel>

			{ single_project ? "Default" : <EyecandyPanel id={`${this.project_selector_id}_eyecandy_panel`} text="Projects loading..."
				eyecandyVisible={this.state.projects_loading} onEyecandy={this.load_projects}>

				<Container visible={client_selected}>

					{ has_projects ? <SelectList id={this.project_selector_id} value={((()=>{
							return this.state.selected_project
						})())} data={((()=>{
							return this.state.projects
						})())} 
						
							hasHeader={this.props.hasHeader || isset (this.props.headerText)}
							headerSelectable={this.props.headerSelectable}
							headerText={this.props.headerText}

							idField="id" textField="name"

							className="form-item" style={{ flex: 1 }}
							onChange={this.props.onProjectChange}>

					</SelectList> : <button onClick={() => { this.context.master_page.setState ({ page: master_pages.projects.name }) }}>New</button> }

				</Container>

			</EyecandyPanel> }

		</div>
	}// render;

}// ProjectSelectorGadget;