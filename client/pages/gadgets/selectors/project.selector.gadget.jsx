import React from "react";

import OptionStorage from "client/classes/storage/option.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";
import SelectList from "client/controls/select.list";

import FadePanel from "client/controls/panels/fade.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import ClientSelectorGadget from "client/pages/gadgets/selectors/client.selector.gadget";

import { isset, is_empty, integer_value, not_empty } from "classes/common";
import { master_pages } from "client/master";

import { MasterContext } from "client/classes/types/contexts";


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


	componentDidMount = this.load_projects;	


	shouldComponentUpdate (next_props, next_state, next_context) {
		super.shouldComponentUpdate (next_props, next_state, next_context);
		if (this.context.company_id != next_context.company_id) return !!this.setState ({ selected_client: 0 });
		if (this.props.selectedProject != next_props.selectedProject) return !!this.setState ({ selected_project: next_props.selectedProject });
		return true;
	}// shouldComponentUpdate;


	render () {

		let single_client = OptionStorage.client_limit () == 1;
		let single_project = OptionStorage.project_limit () == 1;

		let client_loaded = (single_client || (this.state.selected_client > 0));

		return <div id={this.props.id} className="two-column-grid project-selector-form">

			<ClientSelectorGadget id="client_selector" companyId={this.props.companyId} newOption={this.props.newOption}
				hasHeader={this.props.hasHeader} headerSelectable={false} headerText="Select a client" 
				onClientChange={event => this.setState ({ 
					selected_client: integer_value (event.target.value),
					projects_loading: true,
				}, () => this.execute (this.props.onClientChange, event))}>
			</ClientSelectorGadget>

			<FadePanel id={`${this.props.id}_projects_label`} visible={client_loaded || single_project} className="vertically-center">
				<label htmlFor={this.project_selector_id}>Project</label>
			</FadePanel>

			{single_project ? "Default" : <EyecandyPanel id={`${this.project_selector_id}_eyecandy_panel`} text="Projects_loading..."
				eyecandyVisible={this.state.projects_loading} onEyecandy={this.load_projects}>

				<Container visible={not_empty (this.state.projects) || !this.props.newOption}>
					<SelectList id={this.project_selector_id} value={((()=>{
						return this.state.selected_project
					})())} data={((()=>{
						return this.state.projects
					})())}
					
						hasHeader={this.props.hasHeader || isset (this.props.headerText)}
						headerSelectable={this.props.headerSelectable}
						headerText={this.props.headerText}

						idField="project_id" textField="project_name"

						className="form-item" style={{ flex: 1 }}
						onChange={this.props.onProjectChange}>

					</SelectList>
				</Container>

				<Container visible={is_empty (this.state.projects) && this.props.newOption}>
					<button onClick={() => { this.context.master_page.setState ({ page: master_pages.projects.name }) }}>New</button>
				</Container>

			</EyecandyPanel>}

		</div>
	}// render;

}// ProjectSelectorGadget;