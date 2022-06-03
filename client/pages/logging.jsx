import React from "react";

import BaseControl from "controls/abstract/base.control";
import Container from "controls/container";

import ExplodingPanel from "controls/panels/exploding.panel";
import EyecandyPanel from "controls/panels/eyecandy.panel";
import FadePanel from "controls/panels/fade.panel";

import LogStorage from "classes/storage/log.storage";
import OptionStorage from "classes/storage/option.storage";

import CalendarClock from "pages/gadgets/calendar.clock";
import PopupNotice from "pages/gadgets/popup.notice";
import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";

import LoggingModel from "models/logging";

import { blank, date_formats, date_rounding } from "classes/types/constants";
import { isset, is_null, is_empty, nested_value, not_set } from "classes/common";

import { Break } from "controls/html/components";
import { MainContext } from "client/classes/types/contexts";

import "client/resources/styles/pages/logging.css";


export default class LoggingPage extends BaseControl {


	state = {

		current_entry: null,

		client_id: 0,
		project_id: 0,

		editable: false,
		editing: false,
		fixing: false,
		initialized: false,
		updating: false

	}/* state */;


	static contextType = MainContext;
	static defaultProps = { id: "logging_page" }


	constructor (props) { 
		super (props);
		this.state.current_entry = LogStorage.current_entry ();
	}// constructor;


	client_selected = () => { return (this.state.client_id > 0) || OptionStorage.single_client () }
	project_selected = () => { return ((this.state.project_id > 0) || OptionStorage.single_project ()) && this.client_selected () }


	update_current_entry = () => {

		let entry = LogStorage.get ();

		this.state.current_entry = entry;

		if (isset (entry)) {
			entry.start_time = Date.validated (entry.start_time);
			entry.end_time = this.end_time ();
			this.state.project_id = entry.project_id;
			this.state.editable = this.needs_editing ();
			if (this.state.editable) this.state.editing = true;
		}// if;

	}// update_current_entry;


	needs_editing = () => { 

		if (not_set (this.state.current_entry)) return false;

		let same_day = this.state.current_entry.start_time.same_day (this.state.current_entry.end_time);
		let result = (!same_day || (this.elapsed_time () > (8 * Date.hour_coef)));

		return result;

	}// needs_editing;

	
	log_entry = () => {

		this.update_current_entry ();

		LoggingModel.log (this.context.company_id, this.state.client_id, this.state.project_id).then (entry => {

			if (is_empty (entry)) {
				entry = null;
				LogStorage.delete ();
			} else {
				entry.start_time = Date.validated (entry.start_time);
				LogStorage.set (entry);
			}// if;

			this.setState ({ 
				current_entry: entry,
				updating: false
			});

		});

	}// log_entry;


	end_time = () => {

		switch (OptionStorage.granularity (this.state.current_entry.company_id)) {
			case 1: return new Date ().round_hours (date_rounding.down);
			case 2: return new Date ().round_minutes (15);
			case 3: return 0; // Level 3 Granularity - any number of minutes
			case 4: return 0; // Level 4 Granularity - truetime: down to the second
		}// switch;

		return date;

	}// end_time;


	elapsed_time = () => {

		let end_time = this.state.current_entry.end_time ?? this.end_time ();
		let result = Math.floor ((end_time.getTime () - this.state.current_entry.start_time.getTime ()) / 1000);

		return result;

	}/* elapsed_time */;


	billable_time = (elapsed_time) => {

//		let minutes = (elapsed % hour_coef);

		return "$1234.56";//"TO BE CALCULATED - ENSURE CORRECT LOGIN, FIRST"; //(elapsed - minutes) + Math.round (minutes / account.granularity) * account.granularity;

	}/* billable_time */;


	invalid_entry = () => {

		let entry = this.state.current_entry;
		let now = new Date ();
		let granularity = OptionStorage.granularity (nested_value (this, "context", "company_id"));

		if (is_null (entry.end_time)) return false;

		if (entry.end_time.before (entry.start_time)) return true;
		if ((granularity == 1) && (entry.start_time.before (now) || entry.end_time.after (now))) return true;
		
		return false;
		
	}/* invalid_entry */;
		
		
	link_cell = value => {
		return <div className={this.state.editable ? "error-link" : null} onClick={this.state.editable ? () => this.setState ({ 
			editing: true,
			fixing: true
		}) : null}>{value}</div>
	}/* link_cell */;


	overtime_notice = () => {
		return <PopupNotice id="overtime_notice" visible={this.state.editing}>
			<ExplodingPanel id="overtime_notice_panel">

				<Container id="calendar_clock" visible={this.state.fixing}>
					<CalendarClock id="log_calendar_clock"
						start={this.state.current_entry.start_time} end={this.state.current_entry.end_time}
						onChange={data => {
							this.state.current_entry [`${data.boundary}_time`] = data.date;
							this.forceUpdate ();
						}}>
					</CalendarClock>

					<div className="button-panel">
						<button onClick={() => this.setState ({ editing: false })}>Close</button>
					</div>

				</Container>

				<Container id="overtime_instructions" visible={!this.state.fixing}>

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


	entry_details = elapsed_time => {
	
		let end_time = nested_value (this, "state", "current_entry", "end_time") ?? this.end_time ();

		setTimeout (() => this.forceUpdate (), 1000 + (new Date ().getMilliseconds () % 1000));

		return <div id={this.props.id} className="row-container">
		
			<div className="log-details one-piece-form">

				<label>Client</label>
				<div>{this.state.current_entry.client_name ?? "Default"}</div>

				<label>Project</label>
				<div>{this.state.current_entry.project_name ?? "Default"}</div>

				<Break />

				<label>Start</label>
				<div>{this.state.current_entry.start_time.format (date_formats.full_datetime)}</div>

				<label>Stop</label>
				{this.link_cell (end_time.format (this.state.current_entry.start_time.same_day (end_time) ? date_formats.timestamp : date_formats.full_datetime))}

				<label>Elapsed</label>
				{this.link_cell (elapsed_time == 0 ? "No time elapsed" : Date.elapsed (elapsed_time)) }
				
				<Container visible={OptionStorage.billing_option ()}>

					<Break />

					<label>Billable</label>
					<div>{this.billable_time (elapsed_time)}</div> 

				</Container>

			</div>

			<div style={{ width: 0 }}>{this.overtime_notice ()}</div>

		</div>

	}/* entry_details */;


	/********/


	componentDidMount () {
//		this.update_current_entry ();
		this.setState ({ initialized: true });
	}// componentDidMount;


	componentDidUpdate () {
		let needs_editing = this.needs_editing ();
		if (this.state.editable == needs_editing) return;
		this.setState ({ editable: needs_editing });
	}// componentDidUpdate;


	shouldComponentUpdate (new_props, new_state, new_context) {
		super.shouldComponentUpdate (new_props, new_state, new_context);
		if (is_null (new_context)) return false;
		return true;
	}// shouldComponentUpdate;


	render () {

		let logged_in = isset (this.state.current_entry);
		let elapsed_time = logged_in ? this.elapsed_time () : null;

		return <div id="log_panel">

			<EyecandyPanel id="log_form_eyecandy" text="Loading..." eyecandyVisible={!this.state.initialized} stretchOnly={true}>

				{logged_in ? this.entry_details (elapsed_time) : <div>

					<ProjectSelectorGadget id="logging_project_selector" parent={this} 
						hasHeader={true} headerSelectable={false} headerText={blank} newOption={true}
						onClientChange={event => this.setState ({ client_id: event.target.value })}
						onProjectChange={event => this.setState ({ project_id: event.target.value })}>
					</ProjectSelectorGadget>
				
				</div>}

			</EyecandyPanel>

			<div id="eyecandy_cell" style={{ marginTop: "1em" }}>
				<EyecandyPanel id="log_button_eyecandy"  style={{ marginTop: "1em" }} stretchOnly={true}
				
					text={`LogStorage you ${logged_in ? "out" : "in"}...`} 
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
		
	}// render;


}// LoggingPage;