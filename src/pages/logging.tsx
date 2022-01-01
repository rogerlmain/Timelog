import React, { BaseSyntheticEvent } from "react";

import * as common from "classes/common";

import Database from "classes/database";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";
import TaskTree from "pages/gadgets/task.tree";

import { EntryData } from "types/datatypes";
import { globals } from "types/globals";
import { TaskItem } from "models/tasks";


interface LoggingPageState extends DefaultState {
	current_task: null,

	history_loaded: false,
	gadget_updated: false,

	entries: null

}// LoggingPageState;


export default class LoggingPage extends BaseControl<DefaultProps, LoggingPageState> {

	private log_form: React.RefObject<HTMLFormElement> = React.createRef<HTMLFormElement> ();

	private task_tree: React.RefObject<TaskTree> = React.createRef<TaskTree> ();


	private load_entries (): any {
		let log_form = this.log_form;
		let parameters = null;
		if (common.is_null (log_form)) return null;
		parameters = new FormData (log_form.current);
		parameters.set ("action", "entries");

		// TEMPORARY - TRANSPLANT TO accounts MODEL CLASS
		Database.fetch_data ("logging", parameters).then ((result: any) => {
			this.setState ({ entries: result }, () => {
				this.setState ({ gadget_updated: true });
			});
		});

	}// load_entries;


	private log_and_fetch (additional_parameters: any = null) {
		let parameters = new FormData (this.log_form.current);
		if (common.isset (additional_parameters)) for (let key of Object.keys (additional_parameters)) {
			parameters.set (key, additional_parameters [key]);
		}// if;

		// TEMPORARY - TRANSPLANT TO accounts MODEL CLASS
		Database.fetch_data ("logging", parameters).then ((data: any) => {
			let response_string = JSON.stringify (data [0]);
			let current_entry: EntryData = EntryData.parse (response_string);
			common.clear_cookie ("current_entry");
			if (common.is_null (current_entry.end_time)) common.set_cookie ("current_entry", response_string);
			this.setState ({ entries: data }, () => { this.setState ({ gadget_updated: true }); });
		});

	}// log_and_fetch;


	private current_task (): TaskItem { 
		return common.isset (this.task_tree.current) ? this.task_tree.current.state.current_task : null 
	}// current_task;

	
	private task_selected (): boolean { 
		return common.isset (this.current_task ()) 
	}// task_selected;


	/********/


	public state: LoggingPageState = {

		current_task: null,

		history_loaded: false,
		gadget_updated: false,

		entries: null

	}// state;


	public componentDidMount () {
		globals.master_panel.setState ({ eyecandy_visible: false });
	}// componentDidMount;


	public render () {

		return (

			<div id="log_panel">

				<link rel="stylesheet" href="resources/styles/controls/treeview.css" />
				<link rel="stylesheet" href="resources/styles/pages/projects.css" />
				<link rel="stylesheet" href="resources/styles/pages/logging.css" />
				
				<div id="log_information_panel" className="two-piece-grid">

					<div>
						<TaskTree accountID={this.current_account ().account_id} ref={this.task_tree} 
							onClick={(event: BaseSyntheticEvent) => { this.setState ({ current_task: this.current_task () }) }}>
						</TaskTree>
					</div>

					<EyecandyPanel id="login_eyecandy"> {/* /*vanishing={true} /* visible={common.isset (this.state.current_task)} - Fix and reinstate * /
						eyecandyClass="border-panel" contentsClass="border-panel"> */}

						<div>
							Task details go here<br />
							(inside this vanishing fade control)
						</div>

					</EyecandyPanel>


{/* 					style={{ display: this.logged_in () ? null : "none" }}>

Logged in to ...

{(() => {

	let current_entry = common.get_cookie ("current_entry");
	return current_entry;

})()}
 
				</div>

<br />

				<div id="log_form_panel">

					<form id="log_form" encType="multipart/form-data">

						<div className="project-select-form">

							<ProjectSelecterGadget id="project_selecter" parent={this}
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


							<ExplodingPanel visible={this.state.project_selected} vanishing={true}>

								<SelectButton id="log_button" sticky={false} style={{ whiteSpace: "nowrap" }}

									onClick={() => {
										let current_entry = this.current_entry ();
										let parameters = common.isset (current_entry) ? { entry_id: current_entry.entry_id } : null;
										this.log_and_fetch (parameters);
									}// onClick;

								}>Log {this.logged_in () ? "out" : "in"}</SelectButton>

							</ExplodingPanel>

						</div>

					</form>

					<OverflowControl control_panel={this.reference ("history_panel")} main_panel={document.getElementById ("program_panel")}>
						<ExplodingPanel visible={this.state.gadget_updated && (this.state.entries.length > 0)} dom_control={this.reference ("history_panel")}>
							<LogHistoryGadget id="history_panel" parent={this} entries={this.state.entries} />
						</ExplodingPanel>
					</OverflowControl>
*/}
				</div>

			</div>

		);

	}// render;


}// LoggingPage;
