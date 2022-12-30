import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";
import LoggingStorage from "client/classes/storage/logging.storage";

import BaseControl from "client/controls/abstract/base.control";

import LoadList from "client/controls/lists/load.list";
import FadePanel from "client/controls/panels/fade.panel";
import ClientSelector from "client/controls/selectors/client.selector";

import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { isset, integer_value, debugging, not_set } from "client/classes/common";
import { page_names } from "client/master";

import "resources/styles/gadgets/selector.gadget.css";


export default class ProjectSelector extends BaseControl {


	static defaultProps = {

		id: null,

		selectedClientId: null,
		selectedProjectId: null,

		onClientChange: null,
		onProjectChange: null,

		hasHeader: false,
		headerSelectable: false,

		includeOffshoreAccounts: true,

		static: false,
		allowStatic: true,

		headerText: "Select a project",

		newClientButton: false,
		newProjectButton: false,

		newButtons: false,

	}// defaultProps;


	constructor (props) {

		super (props);

		this.state.selected_client_id = this.props.selectedClientId;
		this.state.selected_project_id = this.props.selectedProjectId;

		if (debugging (false)) console.log (`${props.id} object created`);

	}/* constructor */;


	/*********/


	client_selector = React.createRef ();


	state = { 
		client_list: null,
		project_data: null,
		selected_client_id: null,
		selected_project_id: null,
	}// state;


	/*********/


	update_projects_list = client_id => {

		let current_entry = LoggingStorage.current_entry ();

		let new_selection = { 
			selected_client_id: client_id,
			selected_project_id:  (client_id == current_entry?.client_id) ? current_entry?.project_id : null,
		}/* new_selection */;

		this.setState (new_selection, () => {

			ProjectStorage.get_by_client (client_id).then (data => this.setState ({ project_data: Object.values (data) }, () => {

				let project_id = (!this.props.hasHeader || (data?.key_length () == 1)) ? Object.keys (data) [0] : this.state.selected_project_id;

				switch (project_id) {
					case this.state.selected_project_id: return this.execute (this.props.onProjectChange, project_id);
					default: this.setState ({ selected_project_id: project_id }, () => this.execute (this.props.onProjectChange, this.state.selected_project_id));
				}/* switch */;

			}));

			this.execute (this.props.onClientChange, client_id);
		
		})/* setState */;

	}/* update_projects_list */;


	shouldComponentUpdate (new_props) {

		if (this.props.selectedClientId != new_props.selectedClientId) return !!this.setState ({ selected_client_id: new_props.selectedClientId });
		if (this.props.selectedProjectId != new_props.selectedProjectId) return !!this.setState ({ selected_project_id: new_props.selectedProjectId });

		return true;

	}/* shouldComponentUpdate */;


	componentDidMount = () => setTimeout (() => {
		if (not_set (this.state.selected_client_id)) return;
		ProjectStorage.get_by_client (this.state.selected_client_id).then (data => this.setState ({ project_data: Object.values (data) }));
	}, 1)/* componentDidMount */;


	render () {

		let single_item = (Object.keys (this.state.project_data ?? []).length == 1) && not_set (this.props.header);
		let static_text = this.props.static ? true : (this.props.allowStatic ? single_item : false);

		return <div id={this.props.id} className="one-piece-form">

			<ClientSelector id="client_selector" ref={this.client_selector} parent={this} static={static_text}
			
				newButton={this.props.newClientButton || this.props.newButtons} 
			
				includeOffshoreAccounts={this.props.includeOffshoreAccounts}

				header={(this.state.client_list?.key_length () > 1) ? "Select a client" : null}
				headerSelectable={false} 

				selectedClientId={this.state.selected_client_id}

				onChange={this.update_projects_list}
				onLoad={data => this.setState ({ client_list: data })}>

			</ClientSelector>

			<FadePanel id={`${this.props.id}_project_selector_label_fade_panel`} visible={isset (this.state.selected_client_id)}>
				<label htmlFor={`${this.props.id}_load_list`} style={{ fontWeight: static_text ? "bold" : null }}>Project</label>
			</FadePanel>
			
			<FadePanel id={`${this.props.id}_project_selector_fade_panel`} visible={isset (this.state.selected_client_id)}>
				<LoadList id={this.props.id} label="Project" style={{ width: "100%" }} static={static_text}

					header={this.props.headerText} headerSelectable={this.props.headerSelectable} selectedItem={this.state.selected_project_id}

					dataIdField="project_id" dataTextField="name" data={this.state.project_data} 
					newButtonPage={(this.props.newProjectButton || this.props.newButtons) ? page_names.projects : null} 
					
					hAlign={horizontal_alignment.stretch} vAlign={vertical_alignment.center}

					onChange={event => {
						let project_id = integer_value (event.target.getAttribute ("value"));
						this.setState ({ selected_project_id: project_id }, () => this.execute (this.props.onProjectChange, project_id));
					}}>

				</LoadList>
			</FadePanel>

		</div>
	}/* render */;

}/* ProjectSelector */;