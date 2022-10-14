import React from "react";

import ReportsModel		from "client/classes/models/reports.model";
import LoggingModel from "client/classes/models/logging.model";

import OptionStorage	from "client/classes/storage/options.storage";

import BaseControl		from "client/controls/abstract/base.control";
import SelectButton		from "client/controls/buttons/select.button";
import DateInput		from "client/controls/inputs/date.input";
import ReportGrid		from "client/controls/lists/report.grid";
import ProjectSelector	from "client/controls/selectors/project.selector";

import FadePanel		from "client/controls/panels/fade.panel";
import ExplodingPanel 	from "client/controls/panels/exploding.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import Container	from "client/controls/container";

import { blank, date_formats, horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { debugging, get_keys, isset, is_array, is_blank, is_null, is_object, json_string, not_set, warning } from "client/classes/common";

import { maximum_hours, maximum_session } from "client/pages/logging";

import { BillingCheckbox } from "client/controls/abstract/input.control";

import "resources/styles/forms.css";
import "resources/styles/pages/reports.css";


const currency_symbol = "$"; // Add other symbols for foreign markets, as needed.


const granularity = {
	daily	: 1,
	monthly	: 2,
	yearly	: 3,
	total	: 4
}// granularity;


const reports_panels = {
	project_report	: 1,
	teamster_report	: 2,
}// reports_panels;


export default class ReportsPage extends BaseControl {


	reports_panel = React.createRef ();
	results_panel = React.createRef ();


	state = {

		current_panel: reports_panels.project_report,

		client_id: null,
		project_id: null,

		entries: null,
		granularity: granularity.daily,

		use_billable: true,
		use_cancelled: false,
		use_dates: false,

		start_date: new Date (),
		end_date: new Date (),

		teamters: null,
		teamster_report_loading: false,

	}// state;


	static defaultProps = { id: "reports_page" }


	constructor (props) {
		super (props);
		if (debugging ()) console.log (`Creating reports page (${this.props.id})`);
	}// constructor;


	/********/


	project_report_panel = () => <Container id="project_report_panel" visible={this.state.current_panel == reports_panels.project_report}>
		<div className="horizontally-centered">
			<div style={{ display: "inline-block" }}>{this.show_project_options ()}</div>
			<br />
			<div>{this.show_results ()}</div>
		</div>
	</Container>


	teamster_report_panel = () => <Container id="teamster_report_panel" visible={this.state.current_panel == reports_panels.teamster_report}>
		<EyecandyPanel id="teamster_panel" text="Loading..." 

			eyecandyVisible={this.state.teamster_report_loading}

			onEyecandy={() => LoggingModel.fetch_active_logs ().then (result => this.setState ({ 
				teamster_report_loading: false,
				teamsters: result,
			}))}>
			
			{this.teamster_report ()}

		</EyecandyPanel>
	</Container>


	/********/


	daily_entries () {

		let current_day = null;
		
		return this.state.entries.map (entry => {

			let start_time = new Date (entry.start_time);
			let end_time = new Date (entry.end_time);

			let day_text = start_time.same_day (current_day) ? null : (isset (start_time) ? start_time.format (date_formats.full_date) : null);

			if (entry.total_time == 0) return;
			if (isset (day_text)) current_day = start_time.get_date ();

			return <div className="ghost-box report-entry" key={`result_id#${entry.log_id}`}>
				<div className="entry">{day_text}</div>
				<div className="entry">{entry.notes}</div>
				<div className="entry">{start_time.format (date_formats.timestamp)}</div>
				<div className="entry">{end_time.format (start_time.same_day (end_time) ? date_formats.timestamp : date_formats.full_datetime)}</div>
				<div className="entry">{Date.elapsed (entry.total_time)}</div>
				<Container visible={OptionStorage.can_bill ()}>
					<input type="checkbox" onClick={() => alert (entry.entry_id)
						// "TO DO: update the log entry in the database")
					} />
				</Container>
			</div>

		});
	}// daily_entries;


	monthly_entries () {

		let entry_list = null;

		let current_month = null;
		let current_year = null;

		this.state.entries.map (entry => {

			let start_time = Date.validated (entry.start_time);

			let active_year = start_time.get_year ();
			let active_month = Date.month_name (start_time.get_month ());

			let item = isset (entry_list) ? entry_list.find (element => { return is_object (element) && (element.year == active_year) && (element.month == active_month) }) : null;

			if (not_set (item)) {
				if (is_null (entry_list)) entry_list = [];
				entry_list.push (item = {
					year: active_year,
					month: active_month,
					value: 0
				});
			}// if;
			
			item.value += entry.total_time;

		});


		return (entry_list.map (item => {
			
			let active_year = (item.year != current_year) ? current_year = item.year : null;
			let active_month = (item.month != current_month) ? current_month = item.month : null;

			return <Container>
				<div className="entry" style={{ columnWidth: "min-content" }}>{active_year}</div>
				<div className="entry" style={{ gridColumn: "2 / 4", textAlign: "left" }}>{active_month}</div>
				<div className="entry">{Date.elapsed (item.value)}</div>
			</Container>

		}));

	}// monthly_entries;


	yearly_entries () {

		let entry_list = null;
		
		this.state.entries.map (entry => {

			let start_time = Date.validated (entry.start_time);
			let year = start_time.get_year ();

			if (is_null (entry_list)) entry_list = {}
			if (is_null (entry_list [year])) return entry_list [year] = entry.total_time;
			entry_list [year] += entry.total_time;

		});


		return (get_keys (entry_list).map (year => {
			let value = entry_list [year];
			return <Container>
				<div className="entry" style={{ gridColumn: "1 / 4" }}>{year}</div>
				<div className="entry">{Date.elapsed (value)}</div>
			</Container>
		}));

	}// yearly_entries;


	// ON ICE - REVISE FOR OTHER LINEAR REPORTS
	list_entries () {

		let entries = null;

		if (!this.state.entries) return entries;

		switch (this.state.granularity) {
			case granularity.daily: entries = this.daily_entries (); break;
			case granularity.monthly: entries = this.monthly_entries (); break;
			case granularity.yearly: entries = this.yearly_entries (); break;
		}// switch;

		return <Container>{entries}</Container>

	}// list_entries;


	format_data = data => {

		let result = null;

		if (not_set (data)) return result;

		data.forEach (item => {

			let start_time = Date.validated (item.start_time);
			let end_time = Date.validated (item.end_time);

			if (not_set (end_time)) return;

			let data_item = {
				...item,
				year: start_time.get_year (),
				month: start_time.get_month_name (),
				day: `${start_time.get_weekday_name ()} ${start_time.get_appended_day ()}`,
				start_time: start_time.format (date_formats.timestamp),
				end_time: end_time.same_day (start_time) ? end_time.format (date_formats.timestamp) : end_time.format (date_formats.report_datetime),
				billed: (item.billed == 1),
			}// data_item;

			if (OptionStorage.can_bill ()) data_item = { ...data_item,
				total_due: item.total_due,
				rate: item.rate,
			}// if;

			if (is_null (result)) result = [];
			result.push (data_item);

		});

		return result;

	}/* format_data */;


	daily_breakdown () {
		return <div>
			<ReportGrid data={this.format_data (this.state.entries)} categories={["year", "month", "day"]}

				header={data => {
					return <Container inline={false} className="report-header">
						<div>Start time</div>
						<div>End time</div>
						<div>Notes</div>
						<div>Total time</div>
						<Container visible={OptionStorage.can_bill ()}>{/*  && (data [0].rate > 0)}> */}
							<div>Rate</div>
							<div>Total due</div>
							<div>Billed</div>
						</Container>
					</Container>
				}}

				row={data => {
					return <Container inline={false} className={`report-entry ${(data.total_time > ((Date.increments.hours / 1000) * 8)) ? "overtime-grid" : blank}`} style={{ cursor: "pointer" }}>
						
						<div className="right-aligned-text">{data.start_time}</div>
						<div className="right-aligned-text">{data.end_time}</div>
						<div className="report-notes">{data.notes}</div>
						<div className="right-aligned-text">{Date.elapsed (data.total_time)}</div>

						<Container visible={OptionStorage.can_bill ()}>{/*  && (data.rate > 0)}> */}
							<div className="right-aligned-text">{currency_symbol}{data.rate?.toCurrency ()}</div>
							<div className="right-aligned-text">{currency_symbol}{data.total_due?.toCurrency ()}</div>
							<BillingCheckbox id={data.log_id} onClick={event => {
								if (event.target.checked === false) return warning (`
									This entry has been marked as billed!
									If you continue, your client may be charged twice.

									Are you sure?
								`);
								return true;
							}} checked={data.billed} />
						</Container>

					</Container>
				}}
				
				footer={() => this.show_totals ()}>
				
			</ReportGrid>
		</div>
	}// daily_breakdown;


	/********/


	show_project_options () {
		return <Container>
		
			<div className="horizontally-centered">

				<div className="two-column-table">

					<ProjectSelector id="report_selector" hasHeader={true} headerSelectable={false} 
						onClientChange={client_id => this.setState ({ client_id: client_id })}
						onProjectChange={project_id => this.setState ({ project_id: project_id })}>
					</ProjectSelector>

					<div className="vertically-centered">
						<div className="one-piece-form checkbox-form">

							<input type="checkbox" id="use_billable" onClick={event => this.setState ({ use_billable: event.target.checked }) } disabled={true} /> {/* DISABLED PENDING IMPLEMENTATION */}
							<label htmlFor="use_billable" style={{ textAlign: "left" }}>Billable</label>

							<input type="checkbox" id="use_cancelled" onClick={event => this.setState ({ use_cancelled: event.target.checked }) } disabled={true} /> {/* DISABLED PENDING IMPLEMENTATION */}
							<label htmlFor="use_cancelled">Cancelled entries</label>

						</div>
					</div>

				</div>


				<div className="two-column-table with-headspace">

					<div className="horizontally-aligned">
						<input type="checkbox" id="use_date_range" onClick={event => this.setState ({ use_dates: event.target.checked }) } />
						<label htmlFor="use_date_range">Date range</label>
					</div>
					
					<div className={`one-piece-form ${this.state.use_dates ? null : "disabled" }`}>

						<label htmlFor="date_range_start">Start date</label>
						<DateInput id="date_range_start" disabled={!this.state.use_dates} value={this.state.start_date} onChange={value => this.setState ({ start_date: value })} />

						<label htmlFor="date_range_end">End date</label>
						<DateInput id="date_range_end" disabled={!this.state.use_dates} value={this.state.end_date} onChange={value => this.setState ({ end_date: value })} />

					</div>
				
				</div>
			</div>	

			{isset (this.state.project_id) && <FadePanel id="report_button_panel" visible={isset (this.state.project_id)}>
				<div className="button-panel with-headspace">
					<SelectButton onClick={() => this.results_panel.current.animate (() => ReportsModel.fetch_by_project (this.state.project_id, this.state.use_dates ? {
						start_date: this.state.start_date.format (date_formats.database_date), 
						end_date: this.state.end_date.format (date_formats.database_date),
					} : null).then (data => this.setState ({ entries: data })))}>Generate</SelectButton>
				</div>
			</FadePanel>}

		</Container>

	}// show_project_options;


	expand_dates (items) {

		items = Array.arrayify (items);

		if (Array.isArray (items)) items.forEach (item => {

			let item_date = new Date (item.start_time);

			item.year = item_date.get_year ();
			item.month = item_date.get_month_name ();
			item.day = item_date.get_day ();
			item.weekday = item_date.get_weekday_name ();

		});

		return items;

	}/* expand_dates */;


	show_results () {

		let has_data = isset (this.state.entries);

		return <ExplodingPanel id="report_results_panel" ref={this.results_panel}>
			<Container visible={has_data}>
				
				{/* 
					REINSTATE WHEN LINEAR OPTION BECOMES NECESSARY 

					<div className={`${OptionStorage.can_bill () ? "six-column-grid" : "five-column-grid"} report-grid"`}>
						<hr className="report-rule" />
						<Container visible={this.state.granularity < 4}>{this.list_entries ()}</Container>
						<hr className="report-rule" />
						{this.show_totals ()}
					</div>
				*/}

				<Container visible={this.state.granularity < 4}>
					{this.daily_breakdown ()}
				</Container>

			</Container>
		</ExplodingPanel>

	}// show_results;


	show_totals () {

		let total_time = 0;
		let total_earned = 0;
		let total_due = 0;

		if (isset (this.state.entries)) this.state.entries.map (row => {
			total_time += row.total_time;
			total_earned += row.total_due;
			if (!row.billed) total_due += row.total_due;
		});

		return <Container>

			<div className="footer">

				<div style={{ textAlign: "left", gridColumn: "1 / 4" }}>Paid</div>
				<div style={{ gridColumn: "4", gridRow: "auto / span 2" }} className="vertically-centered">{Date.elapsed (total_time)}</div>
				<div style={{ gridColumn: "5 / 7" }}>{currency_symbol}{(total_earned - total_due).toCurrency ()}</div>
				<div />

				<div style={{ textAlign: "left", gridColumn: "1 / 4" }}>Outstanding</div>
				<div style={{ gridColumn: "5 / 7" }}>{currency_symbol}{total_due.toCurrency ()}</div>
				<div />

			</div>

			<div className="footer-total">
				<div style={{ textAlign: "left", gridColumn: "1 / 5" }}>Total</div>
				<div style={{ gridColumn: "5 / 7" }}>{currency_symbol}{total_earned.toCurrency ()}</div>
				<div />
			</div>


		</Container>

	}// show_totals;


	timebar (time) {

		const minutes_per_hour = 1440;
		const seconds_per_minute = 60;

		let timestamp = new Date (time);
		let elapsed_time = Date.timespan (timestamp.elapsed ());

		let total_minutes = (elapsed_time.days * 24 * minutes_per_hour) + (elapsed_time.hours * minutes_per_hour) + elapsed_time.mins;
		let time_width = ((total_minutes > (maximum_hours * seconds_per_minute)) ? minutes_per_hour : total_minutes);

		let overtime = total_minutes > (maximum_hours * minutes_per_hour);

		let time_color = (overtime ? "#F00" : ((time_width > (maximum_session * seconds_per_minute)) ? "#880" : "#080"));

		return <div className="timebar">
			<div className="fully-centered" style={{ 
				width: `${Math.round (time_width / (maximum_hours * minutes_per_hour)) * 100}%`, 
				backgroundColor: time_color,
			}}>{overtime ? "OVERTIME" : blank}</div>
		</div>

	}// timebar;


	teamster_report () {

		let result = null;

		if (is_null (this.state.teamsters)) return null;
		if (is_blank (this.state.teamsters)) return <div>No one is logged in to anything.</div>

		if (is_null (result)) result = [];

		result.push (<div key={0} className="report-title">
			<div key={1}>Name</div>
			<div key={2}>Client</div>
			<div key={3}>Notes</div>
			<div key={4}>Start Time</div>
			<div style={{ border: "none", backgroundColor: "var(--background-color)" }} />
		</div>);

		for (let teamster of this.state.teamsters) {

			const teamster_name = `${teamster.first_name}, ${teamster.last_name}` + (isset (teamster.friendly_name) && (teamster.friendly_name != teamster.first_name) ? ` (${teamster.friendly_name})` : blank);
			const start_time = new Date (teamster.start_time).format (date_formats.us_datetime);

			result.push (<div className="report-row" key={teamster.log_id}>
				<div key={1} title={teamster_name}>{teamster_name}</div>
				<div key={2} title={teamster.client_name}>{teamster.client_name}</div>
				<div key={3} title={teamster.notes}>{teamster.notes}</div>
				<div key={4} title={start_time}>{start_time}</div>
				<div key={5} style={{ border: "none" }}>{this.timebar (teamster.start_time)}</div>
			</div>);

		}// for;

		return <div key="splah" className="teamster-report">{result}</div>

	}// teamster_report;


	/********/


	render () {
		return <div id={this.props.id} className="two-column-grid">

			<div className="button-column">
	
				<SelectButton id="project_report_button" className="sticky-button" selected={this.state.current_panel == reports_panels.project_report} 
					onClick={() => this.reports_panel.current.animate (() => this.setState ({ current_panel: reports_panels.project_report }))}>
						
					Projects
					
				</SelectButton>

				<SelectButton id="teamster_button" className="sticky-button" selected={this.state.current_panel == reports_panels.teamster_report} 

					onClick={() => this.reports_panel.current.animate (() => this.setState ({ current_panel: reports_panels.teamster_report}))}>
						
					Teamsters
					
				</SelectButton>

			</div>					
				
			<ExplodingPanel id="reports_panel" ref={this.reports_panel} stretchOnly={true} hAlign={horizontal_alignment.left} vAlign={vertical_alignment.top}

				afterChanging={() => { 
					if (this.state.current_panel != reports_panels.teamster_report) return;
					this.setState ({ teamster_report_loading: true });
				}}>

				{this.project_report_panel ()}
				{this.teamster_report_panel ()}

			</ExplodingPanel>
			
		</div>
	}// render;

}// ReportsPage;