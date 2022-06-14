import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";
import SelectButton from "client/controls/buttons/select.button";
import Container from "client/controls/container";

import ProjectSelectorGadget from "client/controls/selectors/project.selector.gadget";
import ReportsModel from "client/classes/models/reports";

import { date_formats } from "client/classes/types/constants";
import { get_keys, isset, is_null, is_object, not_set } from "client/classes/common";

import "client/resources/styles/pages/reports.css";



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
		granularity: 4
	}// state;


	daily_entries () {

		let current_day = null;
		
		return this.state.entries.map (entry => {

			let start_time = new Date (entry.start_time);
			let end_time = new Date (entry.end_time);

			let day_text = start_time.same_day (current_day) ? null : (isset (start_time) ? start_time.format (date_formats.full_date) : null);

			if (entry.total_time == 0) return;
			if (isset (day_text)) current_day = start_time.get_date ();

			return <Container key={`result_${entry.entry_id}`}>
				<div className="entry">{day_text}</div>
				<div className="entry">{start_time.format (date_formats.timestamp)}</div>
				<div className="entry">{end_time.format (start_time.same_day (end_time) ? date_formats.timestamp : date_formats.full_datetime)}</div>
				<div className="entry">{Date.elapsed (entry.total_time)}</div>
			</Container>

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


	show_totals () {

		let total = 0;

		if (isset (this.state.entries)) this.state.entries.map (row => total += row.total_time);

		return <Container>
			<div className="entry" style={{ gridColumn: "1 / 4" }}>Total</div>
			<div className="entry">{Date.elapsed (total)}</div>
		</Container>

	}// show_totals;


	render () {

		let has_data = isset (this.state.entries);

		return <div id={this.props.id}>
			
			<div className="two-column-grid" style={{ columnGap: "1em" }}>

				<div>
					<ProjectSelectorGadget id="report_selector" hasHeader={true} headerSelectable={false} 
						onClientChange={event => this.setState ({ client_id: event.target.value })}
						onProjectChange={event => this.setState ({ project_id: event.target.value})}>
					</ProjectSelectorGadget>
				</div>

				<div>
					<label htmlFor="granularity">Granularity</label>
					<select id="granularity" onChange={event => this.setState ({ granularity: parseInt (event.target.value) })} defaultValue={granularity.total}>
						<option value={granularity.daily}>Day</option>
						<option value={granularity.monthly}>Month</option>
						<option value={granularity.yearly}>Year</option>
						<option value={granularity.total}>Project Total</option>
					</select>
				</div>

			</div>

			<FadePanel id="report_button_panel" visible={isset (this.state.project_id)}>
				<SelectButton onClick={() => ReportsModel.fetch_by_project (this.state.project_id).then (data => this.setState ({ entries: data }))} style={{ marginTop: "1em" }}>Generate</SelectButton>
				<hr />
			</FadePanel>

			<FadePanel id="report_results_panel" visible={has_data}>
				<div className="four-column-grid report-grid">
					{(this.state.granularity < 4) && <Container>
						{this.list_entries ()}
						<hr />
					</Container>}
					{this.show_totals ()}
				</div>
			</FadePanel>
			
		</div>
	}// render;

}// ReportsPage;