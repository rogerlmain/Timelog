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


	private fetch_entries (action: string, callback: any = null, additional_parameters: any = null) {
		let parameters = new FormData (this.reference ("log_form"));
		if (common.isset (additional_parameters)) for (let key of Object.keys (additional_parameters)) {
			parameters.set (key, additional_parameters [key]);
		}// if;
		parameters.set ("action", action);
		this.fetch_items ("logging", parameters, (data: any) => {
			let response_string = JSON.stringify (data [0]);
			let current_entry: datatype.entry = datatype.entry.parse (response_string);
			this.clear_cookie ("current_entry");
			if (common.is_null (current_entry.end_time)) this.set_cookie ("current_entry", response_string);
			this.setState ({ entries: data }, () => { this.setState ({ gadget_updated: true }); });
			if (common.isset (callback)) callback ();
		});
	}// fetch_entries;


	/********/


	public state = {

		project_list_resized: false,
		login_button_resized: false,

		history_loaded: false,
		gadget_updated: false,

		entries: null

	}// state;


	public render () {

		return (

			<div id="log_panel">

				<link rel="stylesheet" href="resources/styles/panels/logging.panel.css" />

				<div style={{ display: "flex", flexDirection: "row", columnGap: "0.5em" }}>

					<form id="log_form" ref={this.create_reference} encType="multipart/form-data">
						<ProjectSelecter id="project_selecter" ref={this.create_reference} />
					</form>

					<FadeControl visible={this.get_state ("project_selecter", "project_selected")} style={{ width: 0 }} vanishing={true}>
						<SelectButton id="log_button" ref={this.create_reference} style={{ height: "100%", whiteSpace: "nowrap" }}

							onclick={() => {
								let current_entry = this.current_entry ();
								let parameters = common.isset (current_entry) ? { entry_id: current_entry.entry_id } : null;
								this.fetch_entries ("logging", (current_entry) => {
									this.reference ("log_button").setState ({ selected: false });
								}, parameters);
							}// onClick;

						}>Log {this.logged_in () ? "out" : "in"}</SelectButton>
					</FadeControl>

				</div>

				<OverflowControl control_panel={this.reference ("history_panel")} main_panel={document.getElementById ("program_panel")}>
					<FadeControl visible={this.state.gadget_updated} dom_control={this.reference ("history_panel")}>
						<LogHistoryGadget id="history_panel" parent={this} entries={this.state.entries} />
					</FadeControl>
				</OverflowControl>

			</div>

		);

	}// render;


}// LoggingPanel;
