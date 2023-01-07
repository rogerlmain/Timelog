import React from "react";

import BaseControl from"client/controls/abstract/base.control";
import Container from"client/controls/container";

import EyecandyPanel from"client/controls/panels/eyecandy.panel";
import FadePanel from"client/controls/panels/fade.panel";

import LoggingStorage from"client/classes/storage/logging.storage";
import OptionsStorage, { boundaries } from "client/classes/storage/options.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import CalendarClock from "client/gadgets/calendar.clock";
import ProjectSelector from "client/controls/selectors/project.selector";

import LoggingModel from "client/classes/models/logging.model";

import { blank, currency_symbol, date_formats, ranges, space } from "client/classes/types/constants";
import { isset, not_set, multiline_text, null_value, debugging } from "client/classes/common";

import { Break } from "client/controls/html/components";
import { MasterContext } from "client/classes/types/contexts";

import "resources/styles/pages/logging.css";


const action_types = {
	log		: "log",
	cancel	: "cancel",
}// action_types;


export const maximum_hours = 8; // for US with 40 hour work week - TODO make adustable for govt or foreign
export const maximum_session = 4; // for US - equals half of daily maximum - TODO make adustable for govt or foreign

export default class LoggingPage extends BaseControl {


	selector = React.createRef ();
	notice_panel = React.createRef ();


	state = {

		current_entry: { 

			start: null, 
			end: null,

			client_id: null,
			project_id: null,

			logged_in: false,

			notes: null,
			
		}/* current_entry */,

		action: null,

		editable: false,
		editing: false,
		initialized: false,
		updating: false,

	}/* state */;


	static contextType = MasterContext;
	static defaultProps = { id: "logging_page" }


	constructor (props) { 

		super (props);

		let latest_entry = this.get_latest_entry ();

		ProjectStorage.billing_rate (latest_entry?.project_id, latest_entry?.client_id).then (result => this.setState ({ billing_rate: result })).catch (error => {
			console.log (error);
			throw (error);
		});

		this.state.current_entry = latest_entry;

		if (debugging ()) console.log ("logging page created");

	}// constructor;


	/********/


	company_id = () => 	{ return null_value (this.state.current_entry?.company_id) }
	client_id = () => 	{ return null_value (this.state.current_entry?.client_id) }
	project_id = () => 	{ return null_value (this.state.current_entry?.project_id) }
	notes = () => 		{ return null_value (this.state.current_entry?.notes) }


	get_latest_entry () {

		let current_entry = LoggingStorage.current_entry ();

		return {
			...current_entry,
			start: (current_entry.logged_in ? new Date (current_entry?.start) : new Date ()).rounded (ranges.start),
			end: new Date ().rounded (ranges.end),
		}/* current_entry */

	}/* get_latest_entry */;


	metered_bill = elapsed_time => {

		let bill = Math.round ((this.state.billing_rate ?? 0) * (elapsed_time / Date.coefficient.hour));

		if (bill == 0) return "Not billable";
		return `${bill.toCurrency (currency_symbol.dollars)}`;

	}/* metered_bill */;


	// Time limit in hours
	needs_editing = time_limit => { 

		if (!this.state.current_entry.logged_in) return false;

		let same_day = this.state.current_entry.start.same_day (this.state.current_entry.end);
		let result = (!same_day || (this.elapsed_time () > (time_limit * Date.coefficient.hour)));

		return result;

	}// needs_editing;


	log_entry = () => {

		let timestamp = this.state?.current_entry?.[this.state.current_entry.logged_in ? "end" : "start"];
	
		LoggingModel.log (this.state.current_entry, timestamp).then (entry => {

			let is_logged_in = (entry.logged_in === 1);
			
			let new_entry = {
				...this.state.current_entry,
				logged_in: is_logged_in,
				start: is_logged_in ? new Date (entry.start_time) : new Date ().rounded (ranges.start),
				end: new Date ().rounded (ranges.end),
			}/* current_entry */;

			this.setState ({ 
				current_entry: new_entry,
				updating: false,
			}, LoggingStorage.set (new_entry)
		
		)});
		
	}// log_entry;


	elapsed_time = () => { 
		let end_time = (this.state.current_entry.end ?? new Date ()).rounded (ranges.end).getTime ();
		return Math.max (Math.floor ((end_time - this.state.current_entry.start.getTime ()) / 1000), 0);
	}/* elapsed_time */;


	invalid_entry = () => (this.state.current_entry.end?.before (this.state.current_entry.start) ?? false);

		
	overtime_notice = () => <Container id="overtime_instructions" visible={this.needs_editing (24)}>{/* 
		<div style={{ padding: "0.5em 0" }}>

			Whoa! Are you sure this is right?<br/>
			You have a single session going for more than a day!<br />
			<br />
			Did you forget to log out?<br />	

			<br />

			<div className="button-panel">
				<button onClick={() => this.setState ({ editing: false })}>Yep, that's right</button>
				<button onClick={() => 
					
					this.notice_panel.current.animate (() => this.setState ({ fixing: true }))}>Oops. Fix it.</button>


			</div>

		</div> */}
	</Container>


	calendar_clock = boundary => <div>
	
		<CalendarClock id="log_calendar_clock"

			showToggle={this.state.current_entry.logged_in}

			start={this.state.current_entry.start} 
			end={this.state.current_entry.end}

			boundary={boundary}

			onChange={data => this.setState ({ current_entry: { 
				...this.state.current_entry, 
				[data.boundary]: data.date
			} })}>

		</CalendarClock>

		<div className="button-panel">
			<button onClick={() => this.context.hide_popup ()}>Close</button>
		</div>

	</div>


	link_cell = (value, boundary) => {

		let needs_editing = this.needs_editing (8);
		let can_edit = OptionsStorage.can_edit ();

		return <div className={(can_edit || needs_editing) ? (needs_editing ? "error-link" : "standard-link") : null}

			title={needs_editing ? multiline_text (
				"Whoa! Are you a workaholic?",
				"You've been going for more than eight hours straight!",
				space,
				"Click here to change your log times."
			) : null} 
		
			onClick={(can_edit || needs_editing) ? () => this.context.load_popup (this.calendar_clock (boundary)).then (this.context.show_popup) : null}>
				
			{value}

		</div>

	}/* link_cell */;


	entry_details = elapsed_time => {
	
		let start_time = this.state.current_entry?.start;
		let end_time = this.state.current_entry?.end;

		if (not_set (start_time) ) return null;

		return <div id={this.props.id} className="two-column-grid with-headspace">
		
			<div className="log-details one-piece-form">

				<label>Start</label>
				{this.link_cell (start_time?.format (date_formats.full_datetime), boundaries.start)}

				<label>Stop</label>
				{this.link_cell ((end_time ?? new Date ().rounded (ranges.end))?.format (start_time?.same_day (end_time) ? date_formats.timestamp : date_formats.full_datetime), boundaries.end)}

				<Break />

				<label>Elapsed</label>
				<div className="right-justified">
					<div className="two-column-grid">
						<div>{elapsed_time == 0 ? "No time elapsed" : Date.elapsed (elapsed_time)}</div>
						<div style={{ position: "relative" }}>{this.overtime_notice ()}</div>
					</div>
				</div>					
				
				<Container visible={OptionsStorage.can_bill () && (this.state.billing_rate > 0)}>
					<label>Billable</label>
					<div>{this.metered_bill (elapsed_time)}</div> 
				</Container>

			</div>

		</div>

	}/* entry_details */;


	update_client (client_id) {

		let latest_entry = this.get_latest_entry ();

		if (latest_entry?.client_id == client_id) return this.setState ({ current_entry: latest_entry });

		LoggingModel.get_latest_by_client (client_id).then (result => isset (result) ? this.setState ({ current_entry: {
			client_id: client_id,
			project_id: result?.project_id,
			start: new Date ().rounded (ranges.start),
			end: new Date ().rounded (ranges.end),
			logged_in: not_set (result?.end_time),
			notes: result?.notes,
		} }) : null);

	}/* update_client */


	update_project (project_id) {

		let latest_entry = this.get_latest_entry ();

		if (latest_entry?.project_id == project_id) return this.setState ({ current_entry: latest_entry });

		LoggingModel.get_latest_by_project (project_id).then (result => isset (result) ? this.setState ({ current_entry: {
			client_id: client_id,
			project_id: result?.project_id,
			start: new Date ().rounded (ranges.start),
			end: new Date ().rounded (ranges.end),
			logged_in: not_set (result?.end_time),
			notes: result?.notes,
		} }) : null);

	}/* update_project */


	/********/


	componentDidMount () {
		this.setState ({ editing: this.needs_editing (24) }, () => setTimeout (this.setState ({ initialized: true })));
	}// componentDidMount;


	componentDidUpdate () {
		let needs_editing = this.needs_editing (24);
		if (this.state.editable != needs_editing) this.setState ({ editable: needs_editing });
	}// componentDidUpdate;


	render () {

		if (not_set (this.context)) return null;

		let elapsed_time = this.state.current_entry.logged_in ? this.elapsed_time () : null;
		let project_selected = (this.state?.current_entry?.project_id > 0) || OptionsStorage.single_project () || this.state.current_entry.logged_in;

		let log_button_panel = {
			columnGap: "0.25em",
			width: "100%",
		}// log_button_panel;

		if (this.state.current_entry.logged_in && (elapsed_time > 0)) log_button_panel = {...log_button_panel,
			display: "grid",
			gridTemplateColumns: "repeat(2, 1fr)",
		}// if;


		return <div id="log_panel" className="horizontally-centered">

			<div className="with-headspace">
				<ProjectSelector id="project_selector" ref={this.selector} parent={this} newButtons={!this.state.current_entry.logged_in} 
				
					static={this.state.current_entry.logged_in}

					selectedClientId={this.state.current_entry.client_id} 
					selectedProjectId={this.state.current_entry.project_id}

					hasHeader={true} 
					headerSelectable={false} 

					onClientChange={client_id => { if (this.state.current_entry.client_id != client_id) this.update_client (client_id) }}

					onProjectChange={project_id => { if (this.state.current_entry.project_id != project_id) this.update_project (project_id) }}>

				</ProjectSelector>
			</div>

			{this.state.current_entry.logged_in ? this.entry_details (elapsed_time) : null}

			<div id="eyecandy_cell" style={{ marginTop: "1em", width: "100%" }}>
				<EyecandyPanel id="log_button_eyecandy"  style={{ marginTop: "1em" }} stretchOnly={true}
				
					text={(elapsed_time == 0) ? "Cancelling entry..." : `Logging you ${this.state.current_entry.logged_in ? "out" : "in"}...`}
					
					eyecandyVisible={this.state.updating}
					eyecandyStyle={{ justifyContent: "center", gap: "0.5em" }}

					onEyecandy={this.log_entry}>

					<FadePanel id="login_button" visible={project_selected} style={{ display: "flex" }}>
						{project_selected && <div className="flex-column">

							{(OptionsStorage.can_edit () && (!this.state.current_entry.logged_in)) && <div className="one-piece-form log-details">
								<label>Start:</label>
								<div>{this.link_cell (this.state.current_entry?.start?.format (date_formats.full_datetime))}</div>
							</div>}

							<div className="flex-column with-headspace">
								<div style={{ paddingLeft: "0.75em" }}><label htmlFor="memo" style={{ fontWeight: "bold" }}>Notes</label></div>
								<div className="textarea-container with-some-headspace">
									<textarea id="notes" name="notes"
										placeholder="(optional)" defaultValue={this.notes () ?? blank}
										onBlur={event => this.setState ({ current_entry: {...this.state.current_entry, notes: event.target.value }})}>
									</textarea>
								</div>
							</div>

							<div style={log_button_panel} className="with-some-headspace">

								<Container visible={this.state.current_entry.logged_in}>
									<button className="full-width"
										onClick={() => this.setState ({ updating: true, action: action_types.cancel })}>
										Cancel entry
									</button>
								</Container>

								<Container visible={(!this.state.current_entry.logged_in) || (elapsed_time > 0)}>
									<button className="full-width"
										onClick={() => this.setState ({ updating: true, action: action_types.log })} style={{ flex: 1 }} 
										disabled={this.state.current_entry.logged_in && this.invalid_entry ()}>
										{this.state.current_entry.logged_in ? "Log out" : "Log in"}
									</button>
								</Container>

							</div>

						</div>}
					</FadePanel>

				</EyecandyPanel>
			</div>
 
		</div>
		
	}// render;


}// LoggingPage;