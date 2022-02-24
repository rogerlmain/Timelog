import React from "react";

import EyecandyPanel from "controls/panels/eyecandy.panel";
import ProjectSelectorGadget from "./gadgets/selectors/project.selector.gadget";
import LoggingModel from "models/logging";
import FadePanel from "client/controls/panels/fade.panel";
import TimeTool from "types/timetool";

import BaseControl from "controls/base.control";

import { isset, not_empty, not_set } from "client/classes/common";


export default class LoggingPage extends BaseControl {


	state = {
		project_id: 0,
		current_entry: undefined,
		updating: false
	}// state;


	project_selected = () => { return this.state.project_id > 0 }

	
	elapsed_time () {
		let start = this.state.current_entry.start_time;
		return new Date ().getTime () - new Date (start).getTime ();
	}// elapsed_time;


	billable_time () {

		const hour_coef = 3600000;

		let account = this.current_account ();

		let elapsed = this.elapsed_time ();
		let minutes = (elapsed % hour_coef);

		return "TO BE CALCULATED - ENSURE CORRECT LOGIN, FIRST"; //(elapsed - minutes) + Math.round (minutes / account.granularity) * account.granularity;

	}// billable_time;


	start_time () {
		let start_time = new Date (this.state.current_entry.start_time);
		if (TimeTool.same_day (start_time, new Date ())) return TimeTool.format (start_time, TimeTool.formats.time);
		return TimeTool.format (start_time, TimeTool.formats.compact);
	}// start_time;


	logged_in = () => { return not_empty (this.state.current_entry) && isset (this.state.current_entry.item) }


	componentDidMount () {
		LoggingModel.fetch_latest_entry ().then (data => this.setState ({ current_entry: data }));
	}// componentDidMount;

	
	render () {
		return (
			<div id="log_panel">

				<link rel="stylesheet" href="resources/styles/controls/treeview.css" />
				<link rel="stylesheet" href="resources/styles/pages/projects.css" />
				<link rel="stylesheet" href="resources/styles/pages/logging.css" />

				<EyecandyPanel id="log_form_eyecandy" eyecandyText="Loading..." eyecandyVisible={not_set (this.state.current_entry)}>


					{this.logged_in () ? <div className="two-column-grid">


						<div>Client</div>
						<div>: {this.state.current_entry.client_name}</div>

						<div>Project</div>
						<div>: {this.state.current_entry.project_name}</div>

						<div style={{ gridColumn: "1 / -1", height: "0.5em" }}></div>

						<div>Start</div>
						<div>: {this.start_time ()}</div>

						<div>Elapsed</div>
						<div>: {TimeTool.elapsed (this.elapsed_time ())}</div>

						<div style={{ gridColumn: "1 / -1", height: "0.5em" }}></div>

						<div>Billable</div>
						<div>: {this.billable_time ()}</div> 

					</div> : <div>

						<ProjectSelectorGadget id="logging_project_selector" parent={this} 
							hasHeader={true} headerSelectable={false}
							onProjectChange={event => this.setState ({ project_id: event.target.value })}>
						</ProjectSelectorGadget>
					
					</div>}

				</EyecandyPanel>

				<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
					<EyecandyPanel id="log_button_eyecandy"  style={{ marginTop: "1em" }} stretchOnly={true}
					
						eyecandyText={`Logging you ${this.logged_in () ? "out" : "in"}...`} 
						eyecandyVisible={this.state.updating}
						eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}

						onEyecandy={() => { LoggingModel.log (this.state.project_id).then (data => this.setState ({ 
							project_id: (isset (data) ? data.project_id : 0),
							current_entry: data,
							updating: false
						})) }}>

						<FadePanel id="login_button" visible={this.project_selected () || this.logged_in ()} style={{ display: "flex" }}>
							<button onClick={() => this.setState ({ updating: true })} style={{ flex: 1 }}>
								{this.logged_in () ? "Log out" : "Log in"}
							</button>
						</FadePanel>

					</EyecandyPanel>
				</div>

			</div>
		);
	}// render;


}// LoggingPage;
