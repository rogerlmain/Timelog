import React from "react";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";

import Break from "controls/html/line.break";

import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";
import FadePanel from "controls/panels/fade.panel";

import Logging from "classes/storage/logging";
import Options from "classes/storage/options";

import CalendarClock from "pages/gadgets/calendar.clock";
import PopupNotice from "pages/gadgets/popup.notice";
import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";

import LoggingModel from "models/logging";

import { blank, date_formats, date_rounding } from "classes/types/constants";
import { isset, is_null, is_empty } from "classes/common";

import "client/resources/styles/pages/logging.css";


export default class LoggingPage extends BaseControl {


	state = {
		project_id: 0,
		editable: false,
		editing: false,
		fixing: false,
		initialized: false,
		current_entry: null,
		updating: false
	}/* state */;


	static defaultProps = { 
		id: "logging_page",
		companyId: null
	}/* defaultProps */;


	constructor (props) {
		super (props);
		this.update_current_entry ();
	}// constructor;


	project_selected = () => { return this.state.project_id > 0 }


	update_current_entry () {

		let entry = Logging.get ();

		this.state.current_entry = entry;

		if (isset (entry)) {
			entry.start_time = Date.validated (entry.start_time);
			entry.end_time = this.end_time ();
			this.state.project_id = entry.project_id;
			this.state.editable = this.needs_editing (entry);
			if (this.state.editable) this.state.editing = true;
		}// if;

	}// local_storage_entry;


	needs_editing (entry = null) { 
		if (is_null (entry)) entry = this.state.current_entry;
		if (is_null (entry)) return false

		let same_day = entry.start_time.same_day (entry.end_time);
		let elapsed_time = this.elapsed_time (entry);
		
		let result = (!same_day || (elapsed_time > (8 * Date.hour_coef)));
		return result;
	}// needs_editing;

	
	log_entry () {

		this.update_current_entry ();

		LoggingModel.log (this.props.companyId, parseInt (this.state.project_id)).then (entry => {

			if (is_empty (entry)) {
				entry = null;
				Logging.delete ();
			} else {
				entry.start_time = Date.validated (entry.start_time);
				Logging.set (entry);
			}// if;

			this.setState ({ 
				current_entry: entry,
				updating: false
			});

		});

	}// log_entry;


	end_time () {

		switch (Options.granularity (this.state.current_entry.company_id)) {
			case 1: return new Date ().round_hours (date_rounding.down);
			case 2: return new Date ().round_minutes (15);
			case 3: return 0; // Level 3 Granularity - any number of minutes
			case 4: return 0; // Level 4 Granularity - truetime: down to the second
		}// switch;

		return date;

	}// end_time;


	elapsed_time (entry = null) {

		entry = entry ?? this.state.current_entry;
		entry.end_time = entry.end_time ?? this.end_time ();

		switch (Options.granularity (entry.granularity)) {
			case 1: return Math.floor ((entry.end_time.getTime () - entry.start_time.getTime ()) / 1000);
			case 2: return Math.floor ((entry.end_time.getTime () - entry.start_time.getTime ()) / 1000);
			case 3: return 0; // Level 3 Granularity - any number of minutes
			case 4: return 0; // Level 4 Granularity - truetime: down to the second
		}// switch;

	}// elapsed_time;


	billable_time (elapsed_time) {

//		let minutes = (elapsed % hour_coef);

		return "$1234.56";//"TO BE CALCULATED - ENSURE CORRECT LOGIN, FIRST"; //(elapsed - minutes) + Math.round (minutes / account.granularity) * account.granularity;

	}// billable_time;


	invalid_entry () {

		let entry = this.state.current_entry;
		let now = new Date ();
		let granularity = Options.granularity (this.props.companyId);

		if (is_null (entry.end_time)) return false;

		if (entry.end_time.before (entry.start_time)) return true;
		if ((granularity == 1) && (entry.start_time.before (now) || entry.end_time.after (now))) return true;
		
		return false;
		
	}// invalid_entry;
		
		
	link_cell (value) {
		return <div className={this.state.editable ? "error-link" : null} onClick={this.state.editable ? () => this.setState ({ 
			editing: true,
			fixing: true
		}) : null}>{value}</div>
	}// link_cell;


	componentDidMount () {
		this.setState ({ initialized: true });
	}// componentDidMount;


	componentDidUpdate () {
		let needs_editing = this.needs_editing ();
		if (this.state.editable == needs_editing) return;
		this.setState ({ editable: needs_editing });
	}// componentDidUpdate;


	render () {

		let entry = this.state.current_entry;
		let logged_in = isset (entry);
		let elapsed_time = logged_in ? this.elapsed_time () : null;

		const overtime_notice = () => {
			return <PopupNotice id="overtime_notice" visible={this.state.editing}>
				<ExplodingPanel id="overtime_notice">
	
					<Container id="calendar_clock" condition={this.state.fixing}>
						<CalendarClock id="log_calendar_clock"
							start={entry.start_time} end={entry.end_time}
							onChange={data => this.setState ({ current_entry: { 
								...this.state.current_entry,
								[`${data.boundary}_time`]: data.date
							}})}>
						</CalendarClock>

						<div className="button-panel">
							<button onClick={() => this.setState ({ editing: false })}>Close</button>
						</div>

					</Container>
	
					<Container id="overtime_instructions" condition={!this.state.fixing}>
	
						<div style={{ padding: "0.5em 0" }}>

							Whoa! Are you sure this is right?<br/>
							You have a single session going for more than a day!<br />

							<br />
	
							<div className="button-panel">
								<button onClick={() => this.setState ({ editing: false })}>Yep, that's right</button>
								<button onClick={() => this.setState ({ fixing: true })}>Oops. Fix it.</button>
							</div>

						</div>
					</Container>
	
				</ExplodingPanel>
			</PopupNotice>
		}/* overtime_notice */;
	
	
		const entry_details = () => {
	
			entry.end_time = this.end_time ();
			setTimeout (() => {
				this.forceUpdate ();
			}, 1000 + (new Date ().getMilliseconds () % 1000));
	
			return <div id={this.props.id} className="row-container">
			
				<div className="log-details two-column-grid">
	
					<label>Client</label>
					<div>{entry.client_name}</div>
	
					<label>Project</label>
					<div>{entry.project_name}</div>
	
					<Break />
	
					<label>Start</label>
					<div>{entry.start_time.format (date_formats.full_datetime)}</div>
	
					<label>Stop</label>
					{this.link_cell (entry.end_time.format (entry.start_time.same_day (entry.end_time) ? date_formats.timestamp : date_formats.full_datetime))}
	
					<label>Elapsed</label>
					{this.link_cell (elapsed_time == 0 ? "No time elapsed" : Date.elapsed (elapsed_time)) }
					
					<Break />
	
					<label>Billable</label>
					<div>{this.billable_time (elapsed_time)}</div> 
	
				</div>
	
				<div>{overtime_notice ()}</div>
	
			</div>
	
		}/* entry_details */;
	
	
		return (
			<div id="log_panel">

				<EyecandyPanel id="log_form_eyecandy" eyecandyText="Loading..." eyecandyVisible={!this.state.initialized}>

					{logged_in ? entry_details () : <div>

						<ProjectSelectorGadget id="logging_project_selector" companyId={this.props.companyId} parent={this} 
							hasHeader={true} headerSelectable={false} headerText={blank}
							onProjectChange={event => this.setState ({ project_id: event.target.value })}>
						</ProjectSelectorGadget>
					
					</div>}

				</EyecandyPanel>

				<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
					<EyecandyPanel id="log_button_eyecandy"  style={{ marginTop: "1em" }} stretchOnly={true}
					
						eyecandyText={`Logging you ${logged_in ? "out" : "in"}...`} 
						eyecandyVisible={this.state.updating}
						eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}

						onEyecandy={this.log_entry.bind (this)}>

						<FadePanel id="login_button" visible={this.project_selected () || logged_in} style={{ display: "flex" }}>
							<button onClick={() => this.setState ({ updating: true })} style={{ flex: 1 }} disabled={logged_in && this.invalid_entry ()}>
								{logged_in ? (elapsed_time == 0 ? "Cancel log entry" : "Log out") : "Log in"}
							</button>
						</FadePanel>

					</EyecandyPanel>
				</div>

			</div>
		);
		
	}// render;


}// LoggingPage;