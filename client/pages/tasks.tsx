import React, { SyntheticEvent, BaseSyntheticEvent } from "react";

import * as common from "classes/common";
import * as constants from "types/constants";

import Database from "classes/database";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";
import TaskSelectorGadget from "pages/gadgets/task.selector.gadget";
import TasksModel from "models/tasks";

import MiscModel from "models/misc";
import AccountsModel, { AccountsList } from "models/accounts";

import TaskForm from "pages/forms/task.form";

import { AccountData, TaskData } from "types/datatypes";
import { globals } from "types/globals";

import SelectList from "controls/select.list";


const default_task_duration: number = 14;


interface TaskState extends DefaultState {

	task_data: any;
	selected_task: any;

	// deprecated ?

	task_list: any;

	project_members: any;
	statuses: any;

	editor_open: boolean,

	task_loading: boolean;

}// TaskState;


export default class TasksPanel extends BaseControl<DefaultProps, TaskState> {


	private project_selector: React.RefObject<TaskSelectorGadget> = React.createRef<TaskSelectorGadget> ();

	private task_editor: React.RefObject<EyecandyPanel> = React.createRef<EyecandyPanel> ();
	private task_form_panel: React.RefObject<EyecandyPanel> = React.createRef<EyecandyPanel> ();


	private project_code () {
		let project_control: TaskSelectorGadget = this.project_selector.current;
		return common.nested_value (project_control, "state", "current_project", "project_code");
	}// project_code;


	private default_due_date () {
		let current_time = new Date ();
		return current_time.setDate (current_time.getDate () + default_task_duration);
	}// default_due_date;


	private show_task_form (callback: Function) {
		let task_form_panel: EyecandyPanel = this.task_form_panel.current;
		if (common.not_set (task_form_panel)) return;
//		task_form_panel.show (callback);
	}// show_task_form;


	private fetch_task (event: BaseSyntheticEvent) {

		let project_selector: TaskSelectorGadget = this.project_selector.current;
		let selected_row = event.currentTarget;
		let task_id = parseInt ((selected_row.querySelector ("input[type=hidden][name=task_id]") as HTMLInputElement).value);
		let project_id = this.state.selected_task;

		this.setState ({ editor_open: true }, () => this.show_task_form ((callback: any) => {
			TasksModel.fetch_task (task_id, (result: any) => this.setState ({ task_data: result }, () => {
				AccountsModel.fetch_by_project (project_id, (result: AccountsList) => this.setState ({ project_members: result }, () => {
					MiscModel.fetch_statuses ((result: any) => this.setState ({ statuses: result }, callback));
				}));
			}));
		}));

	}// fetch_task;


	private update_task_list (project_id: number, callback: any = null) {

		TasksModel.fetch_tasks_by_project (project_id, (data: any) => {

			let account: AccountData = this.current_account ();
			let response: any [] = ["There are no tasks defined"];

			if (common.not_empty (data)) {
				response.length = 0;
				(Array.isArray (data) ? data : [data]).forEach ((item: any) => {
					let row = <div className="task-row" key={`task_${item.task_id}`} onClick={this.fetch_task.bind (this)}>
						<input type="hidden" name="task_id" value={item.task_id ?? constants.empty} />
						<div className="text-cell">
							{account.programmer () ? `(${item.task_id}) ` : null}
							{item.name}
						</div>
						<div className="status-cell">{item.status}</div>
					</div>;
					response.push (row);
				});
			}// if;

			this.setState ({ task_list: response }, callback);

		});

	}// update_task_list;


	private load_tasks (event: BaseSyntheticEvent) {

		let task_editor: EyecandyPanel = this.task_editor.current;

		this.setState ({ selected_task: event.target.value });
//		task_editor.show ((callback: Function) => { this.update_task_list (event.target.value, callback); });
	}// load_tasks;


	private current_task (field: string) {
		let default_value = (field == "due_date") ? this.default_due_date () : constants.empty;
		let result = (common.isset (this.state.task_data) ? (common.isset (this.state.task_data [field]) ? this.state.task_data [field] : default_value) : default_value);
		return result;
	}// current_task;


	/********/


	public state: TaskState = {

		task_list: null,
		task_data: null,
		selected_task: null,

		task_loading: false,

		project_members: null,
		statuses: null,

		editor_open: false,

	}// state;


	public render () {

		return (
			<div id="tasks_panel" className="horizontal-centering-container">

				<link rel="stylesheet" href="node_modules/react-datepicker/dist/react-datepicker.css" />
				<link rel="stylesheet" href="resources/styles/pages/projects.css" />
				<link rel="stylesheet" href="resources/styles/pages/tasks.css" />


				<TaskSelectorGadget id="project_selector" ref={this.project_selector} parent={this}
					onTaskChange={(event: BaseSyntheticEvent) => {
						this.setState ({ selected_task: event.target.value }, () => this.load_tasks.bind (this));
					}}
					onLoad={() => { globals.master_panel.setState ({ eyecandy_visible: false }) }}>
				</TaskSelectorGadget>


				<EyecandyPanel afterEyecandy={(event: BaseSyntheticEvent) => this.fetch_task (event)}>
					<TaskForm taskData={this.state.task_data} onSave={(data: TaskData) => this.setState ({ project_data: data })} />
				</EyecandyPanel>

			</div>
		);
	}// render;

}// TasksPanel;