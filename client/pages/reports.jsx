import React from "react";

import ReportsModel from "client/classes/models/reports";
import OptionStorage from "client/classes/storage/options.storage";

import BaseControl from "client/controls/abstract/base.control";
import TreeList from "client/controls/lists/tree.list";
import FadePanel from "client/controls/panels/fade.panel";
import SelectButton from "client/controls/buttons/select.button";

import ProjectSelector from "client/controls/selectors/project.selector";

import Container from "client/controls/container";
import DateInput from "client/controls/inputs/date.input";

import { date_formats, debugging } from "client/classes/types/constants";
import { get_keys, isset, is_null, is_object, not_array, not_set } from "client/classes/common";

import "resources/styles/pages/reports.css";



const granularity = {
	daily	: 1,
	monthly	: 2,
	yearly	: 3,
	total	: 4
}// granularity;



export default class ReportsPage extends BaseControl {


	static defaultProps = { id: "reports_page" }


	state = {

		client_id: null,
		project_id: null,

		entries: null,
		granularity: granularity.daily,

		start_date: new Date (),
		end_date: new Date (),

	}// state;


	constructor (props) {
		super (props);
		if (debugging) console.log (`Creating reports page (${this.props.id})`);
	}// constructor;


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


	// DEPRECATED - USING show_entries INSTEAD
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
	}// expand_dates;


	show_entries () { 
		return <TreeList data={this.expand_dates (this.state.entries)} nodeFields={["year", "month", "day"]} 

			// itemFormatter={entry => {

			// 	let start_time = new Date (entry.start_time);
			// 	let end_time = new Date (entry.end_time);
	
			// 	let day_text = start_time.same_day (current_day) ? null : (isset (start_time) ? start_time.format (date_formats.full_date) : null);
	
			// 	return <div className="ghost-box report-entry" key={`result_id#${entry.log_id}`}>
			// 		<div>{day_text}</div>
			// 		<div>{entry.notes}</div>
			// 		<div>{start_time.format (date_formats.timestamp)}</div>
			// 		<div>{end_time.format (start_time.same_day (end_time) ? date_formats.timestamp : date_formats.full_datetime)}</div>
			// 		<div>{Date.elapsed (entry.total_time)}</div>
			// 		<Container visible={OptionStorage.can_bill ()}>
			// 			<input type="checkbox" onClick={() => alert (entry.entry_id)
			// 				// "TO DO: update the log entry in the database")
			// 			} />
			// 		</Container>
			// 	</div>

			// }}>
>			 
		</TreeList>
	}// show_entries;
	

	show_totals () {

		let total = 0;

		if (isset (this.state.entries)) this.state.entries.map (row => total += row.total_time);

		return <Container>
			<div className="entry" style={{ gridColumn: "1 / 5" }}>Total</div>
			<div className="entry">{Date.elapsed (total)}</div>
		</Container>

	}// show_totals;


	render () {

		let has_data = isset (this.state.entries);

		return <div id={this.props.id}>

			<div className="horizontally-centered">
				<div>

					<div className="two-column-grid" style={{ columnGap: "1em" }}>

						<div>
							<ProjectSelector id="report_selector" hasHeader={true} headerSelectable={false} 
								onClientChange={event => this.setState ({ client_id: event.target.value })}
								onProjectChange={event => this.setState ({ project_id: event.target.value})}>
							</ProjectSelector>
						</div>

						<div>
							<label htmlFor="granularity">Granularity</label>
							<select id="granularity" onChange={event => this.setState ({ granularity: parseInt (event.target.value) })} defaultValue={granularity.daily}>
								<option value={granularity.daily}>Day</option>
								<option value={granularity.monthly}>Month</option>
								<option value={granularity.yearly}>Year</option>
								<option value={granularity.total}>Project Total</option>
							</select>
						</div>

					</div>

					<div className="two-column-table with-headspace">

						<div className="one-piece-form">
							<label htmlFor="date_range_start">Start date</label>
							<div><DateInput id="date_range_start" value={this.state.start_date} onChange={value => this.setState ({ start_date: value })} /></div>
						</div>

						<div className="one-piece-form">
							<label htmlFor="date_range_end">End date</label>
							<div><DateInput id="date_range_end" value={this.state.end_date} onChange={value => this.setState ({ end_date: value })} /></div>
						</div>

					</div>

					<FadePanel id="report_button_panel" visible={isset (this.state.project_id)}>
						<div className="button-panel with-headspace">
							<SelectButton onClick={() => ReportsModel.fetch_by_project (this.state.project_id, {
								start_date: this.state.start_date.format (date_formats.database_date), 
								end_date: this.state.end_date.format (date_formats.database_date),
							}).then (data => this.setState ({ entries: data }))}>Generate</SelectButton>
						</div>
					</FadePanel>

				</div>
			</div>

			<br />

			<div className="horizontally-centered">
				<FadePanel id="report_results_panel" visible={has_data}>
{/* 
					<div className={`${OptionStorage.can_bill () ? "six-column-grid" : "five-column-grid"} report-grid"`}>
						<hr className="report-rule" />
						<Container visible={this.state.granularity < 4}>{this.list_entries ()}</Container>
						<hr className="report-rule" />
						{this.show_totals ()}
					</div>
*/}

					<hr />

					<Container visible={this.state.granularity < 4}>{this.show_entries ()}</Container>

					<hr />

					{this.show_totals ()}

				</FadePanel>
			</div>
			
		</div>
	}// render;

}// ReportsPage;