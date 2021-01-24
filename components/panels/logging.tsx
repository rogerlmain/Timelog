import * as React from "react";

import * as common from "components/classes/common";
import * as datatype from "components/types/datatypes";

import BaseControl from "components/controls/base.control";
import OverflowControl from "components/controls/overflow.control";
import FadeControl from "components/controls/fade.control";

import SelectButton from "components/controls/select.button";

import LogHistoryGadget from "components/panels/gadgets/log.history.gadget";
import ProjectSelecter from "./gadgets/project.selecter";


export default class LoggingPanel extends BaseControl<any> {


	private load_entries () {
		let log_form = this.reference ("log_form");
		let parameters = null;
		if (common.is_null (log_form)) return null;
		parameters = new FormData (log_form);
		parameters.set ("action", "entries");
		this.fetch_items ("logging", parameters, (result: any) => {
			this.setState ({ entries: result }, () => {
				this.setState ({ gadget_updated: true });
			});
		});
	}// load_entries;


	private log_and_fetch (callback: any = null, additional_parameters: any = null) {
		let parameters = new FormData (this.reference ("log_form"));
		if (common.isset (additional_parameters)) for (let key of Object.keys (additional_parameters)) {
			parameters.set (key, additional_parameters [key]);
		}// if;
		this.fetch_items ("logging", parameters, (data: any) => {
			let response_string = JSON.stringify (data [0]);
			let current_entry: datatype.entry = datatype.entry.parse (response_string);
			this.clear_cookie ("current_entry");
			if (common.is_null (current_entry.end_time)) this.set_cookie ("current_entry", response_string);
			this.setState ({ entries: data }, () => { this.setState ({ gadget_updated: true }); });
			if (common.isset (callback)) callback ();
		});
	}// log_and_fetch;


	/********/


	public state = {

		project_selected: false,

		history_loaded: false,
		gadget_updated: false,

		entries: null

	}// state;


	public render () {

		return (

			<div id="log_panel">

				<link rel="stylesheet" href="resources/styles/panels/projects.css" />
				<link rel="stylesheet" href="resources/styles/panels/logging.css" />

				<div className="project_select_form">

					<form id="log_form" ref={this.create_reference} encType="multipart/form-data">
						<ProjectSelecter id="project_selecter" ref={this.create_reference} parent={this}
							onClientChange={() => {
								this.setState ({
									gadget_updated: false,
									project_selected: false
								})
							}}
							onProjectChange={() => {
								this.setState ({ gadget_updated: false }, this.load_entries.bind (this))
							}}>
						</ProjectSelecter>
					</form>

					<FadeControl visible={this.state.project_selected} vanishing={true}>

						<SelectButton id="log_button" ref={this.create_reference} style={{ whiteSpace: "nowrap" }}

							onclick={() => {
								let current_entry = this.current_entry ();
								let parameters = common.isset (current_entry) ? { entry_id: current_entry.entry_id } : null;
								this.log_and_fetch (() => {
									this.reference ("log_button").setState ({ selected: false });
								}, parameters);
							}// onClick;

						}>Log {this.logged_in () ? "out" : "in"}</SelectButton>

					</FadeControl>

				</div>

				<OverflowControl control_panel={this.reference ("history_panel")} main_panel={document.getElementById ("program_panel")}>
					<FadeControl visible={this.state.gadget_updated && (this.state.entries.length > 0)} dom_control={this.reference ("history_panel")}>
						<LogHistoryGadget id="history_panel" parent={this} entries={this.state.entries} />
					</FadeControl>
				</OverflowControl>

			</div>

		);

	}// render;


}// LoggingPanel;
