import React, { BaseSyntheticEvent } from "react";

import * as common from "classes/common";

import Database from "classes/database";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";
import TaskTree from "pages/gadgets/task.tree";

import { EntryData } from "types/datatypes";
import { globals } from "types/globals";
import { TaskItem } from "models/tasks";
import ProjectSelectorGadget from "./gadgets/selectors/project.selector.gadget";


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
				
				<div id="log_information_panel" className="two-column-form">

					<ProjectSelectorGadget id="logging_project_selector" parent={this} />

					<EyecandyPanel id="login_eyecandy">

						<div>
							Task details go here<br />
							(inside this vanishing fade control)
						</div>

					</EyecandyPanel>

				</div>

			</div>

		);

	}// render;


}// LoggingPage;
