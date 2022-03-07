import React from "react";

import BaseControl from "controls/base.control";

import EyecandyPanel from "controls/panels/eyecandy.panel";
import LoggingModel from "models/logging";
import FadePanel from "client/controls/panels/fade.panel";

import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";

import Logging from "classes/storage/logging";

import { not_empty } from "classes/common";

import "resources/styles/controls/treeview.css";
import "resources/styles/pages/projects.css";
import "resources/styles/pages/logging.css";
import Container from "client/controls/container";
import Break from "client/controls/html/line.break";


export default class LoggingPage extends BaseControl {


	state = {
		project_id: 0,
		initialized: false,
		updating: false
	}// state;


	constructor (props) {
		super (props);
		this.state.project_id = 0;
	}// constructor;


	project_selected = () => { return this.state.project_id > 0 }

	
	set_logging = (data) => {

		let project_id = (not_empty (data) ? data.project_id : 0);
		let entry = (not_empty (data) ? data : null);

		this.setState ({ 
			project_id: project_id,
			updating: false
		});

		Logging.set ("logging", entry);

	}/* set_logging */;


	elapsed_time (start_time) {
		return new Date ().round_hours (Date.rounding_direction.down).getTime () - new Date (start_time).getTime ();
	}// elapsed_time;


	billable_time (elapsed_time) {

//		let minutes = (elapsed % hour_coef);

		return "TO BE CALCULATED - ENSURE CORRECT LOGIN, FIRST"; //(elapsed - minutes) + Math.round (minutes / account.granularity) * account.granularity;

	}// billable_time;


	log_details () {

		let entry = Logging.get_all ();
		let elapsed_time = this.elapsed_time (entry.start_time);

		return <div className="two-column-grid">

			<div>Client</div>
			<div>: {entry.client_name}</div>

			<div>Project</div>
			<div>: {entry.project_name}</div>

			<Break />

			<div>Start</div>
			<div>: {new Date (entry.start_time).format (Date.formats.full_datetime)}</div>

			<div>Stop</div>
			<div>: {new Date ().round_hours (Date.rounding_direction.down).format (Date.formats.full_datetime)}</div>

			<div>Elapsed</div>
			<div style={{ color: `var(--${(elapsed_time > (8 * Date.hour_coef) ? "warning-color" : "default-color")})` }}>: {elapsed_time == 0 ? "No time elapsed" : Date.elapsed (elapsed_time) }</div>

			<Break />

			<div>Billable</div>
			<div>: {this.billable_time (elapsed_time)}</div> 

		</div>
	}// log_details;


	componentDidMount = () => this.setState ({ initialized: true });


	render () {

		let logged_in = Logging.logged_in ();

		return (
			<div id="log_panel">

				<EyecandyPanel id="log_form_eyecandy" eyecandyText="Loading..." eyecandyVisible={!this.state.initialized}>


					{logged_in ? this.log_details () : <div>

						<ProjectSelectorGadget id="logging_project_selector" parent={this} 
							hasHeader={true} headerSelectable={false}
							onProjectChange={event => this.setState ({ project_id: event.target.value })}>
						</ProjectSelectorGadget>
					
					</div>}

				</EyecandyPanel>

				<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
					<EyecandyPanel id="log_button_eyecandy"  style={{ marginTop: "1em" }} stretchOnly={true}
					
						eyecandyText={`Logging you ${logged_in ? "out" : "in"}...`} 
						eyecandyVisible={this.state.updating}
						eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}

						onEyecandy={() => { LoggingModel.log (this.state.project_id).then (this.set_logging)}}>

						<FadePanel id="login_button" visible={this.project_selected () || logged_in} style={{ display: "flex" }}>
							<button onClick={() => this.setState ({ updating: true })} style={{ flex: 1 }}>
								{logged_in ? "Log out" : "Log in"}
							</button>
						</FadePanel>

					</EyecandyPanel>
				</div>

			</div>
		);
	}// render;


}// LoggingPage;
