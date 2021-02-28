import * as React from "react";

import * as common from "components/classes/common";
import * as datatype from "components/types/datatypes";

import Database from "components/classes/database";
import BaseControl from "components/controls/base.control";
import OverflowControl from "components/controls/overflow.control";
import FadeControl from "components/controls/fade.control";

import SelectButton from "components/controls/select.button";

import LogHistoryGadget from "components/panels/gadgets/log.history.gadget";
import ProjectSelecterGadget from "./gadgets/project.selecter.gadget";
import { globals } from "components/types/globals";


export default class LoggingPanel extends BaseControl<any> {


	private load_entries () {
		let log_form = this.reference ("log_form");
		let parameters = null;
		if (common.is_null (log_form)) return null;
		parameters = new FormData (log_form);
		parameters.set ("action", "entries");

		// TEMPORARY - TRANSPLANT TO accounts MODEL CLASS
		Database.fetch_rows ("logging", parameters, (result: any) => {
			this.setState ({ entries: result }, () => {
				this.setState ({ gadget_updated: true });
			});
		});

	}// load_entries;


	private log_and_fetch (additional_parameters: any = null) {
		let parameters = new FormData (this.reference ("log_form"));
		if (common.isset (additional_parameters)) for (let key of Object.keys (additional_parameters)) {
			parameters.set (key, additional_parameters [key]);
		}// if;

		// TEMPORARY - TRANSPLANT TO accounts MODEL CLASS
		Database.fetch_rows ("logging", parameters, (data: any) => {
			let response_string = JSON.stringify (data [0]);
			let current_entry: datatype.entry = datatype.entry.parse (response_string);
			common.clear_cookie ("current_entry");
			if (common.is_null (current_entry.end_time)) common.set_cookie ("current_entry", response_string);
			this.setState ({ entries: data }, () => { this.setState ({ gadget_updated: true }); });
		});

	}// log_and_fetch;


	/********/


	public state = {

		project_selected: false,

		history_loaded: false,
		gadget_updated: false,

		entries: null

	}// state;


	public componentDidMount () {
		globals.home_page.setState ({ eyecandy_visible: false });
	}// componentDidMount;


	public render () {

		return (

			<div id="log_panel">

				<link rel="stylesheet" href="resources/styles/panels/projects.css" />
				<link rel="stylesheet" href="resources/styles/panels/logging.css" />


				<div id="log_information_panel"
					style={{ display: this.logged_in () ? null : "none" }}>

Logged in to ...

{(() => {

	let current_entry = common.get_cookie ("current_entry");
	return current_entry;

})()}

				</div>

<br />

				<div id="log_form_panel">

					<form id="log_form" ref={this.create_reference} encType="multipart/form-data">

						<div className="project-select-form">

							<ProjectSelecterGadget id="project_selecter" ref={this.create_reference} parent={this}
								onClientChange={() => {
									this.setState ({
										gadget_updated: false,
										project_selected: false
									})
								}}
								onProjectChange={() => {
									this.setState ({
										gadget_updated: false,
										project_selected: true
									}, this.load_entries.bind (this))
								}}>
							</ProjectSelecterGadget>


							<FadeControl visible={this.state.project_selected} vanishing={true}>

								<SelectButton id="log_button" ref={this.create_reference} sticky={false} style={{ whiteSpace: "nowrap" }}

									onclick={() => {
										let current_entry = this.current_entry ();
										let parameters = common.isset (current_entry) ? { entry_id: current_entry.entry_id } : null;
										this.log_and_fetch (parameters);
									}// onClick;

								}>Log {this.logged_in () ? "out" : "in"}</SelectButton>

							</FadeControl>

						</div>

					</form>

					<OverflowControl control_panel={this.reference ("history_panel")} main_panel={document.getElementById ("program_panel")}>
						<FadeControl visible={this.state.gadget_updated && (this.state.entries.length > 0)} dom_control={this.reference ("history_panel")}>
							<LogHistoryGadget id="history_panel" parent={this} entries={this.state.entries} />
						</FadeControl>
					</OverflowControl>

				</div>

			</div>

		);

	}// render;


}// LoggingPanel;
