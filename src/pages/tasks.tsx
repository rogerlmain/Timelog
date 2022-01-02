import React, { SyntheticEvent, BaseSyntheticEvent } from "react";

import DatePicker from "react-datepicker";

import * as common from "classes/common";
import * as constants from "types/constants";

import Database from "classes/database";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import EyecandyPanel from "controls/panels/eyecandy.panel";
import ProjectSelectorGadget from "pages/gadgets/project.selector.gadget";
import TasksModel from "models/tasks";

import MiscModel from "models/misc";
import AccountsModel, { AccountsList } from "models/accounts";

import { AccountData } from "types/datatypes";
import { globals } from "types/globals";

import SelectList from "controls/select.list";


const default_task_duration: number = 14;


interface TaskState extends DefaultState {
	task_list: any;
	task_data: any;
	selected_project: any;

	project_members: any;
	statuses: any;

	editor_open: boolean,
}// TaskState;


export default class TasksPanel extends BaseControl<DefaultProps, TaskState> {


	private project_selector: React.RefObject<ProjectSelectorGadget> = React.createRef<ProjectSelectorGadget> ();

	private task_editor: React.RefObject<EyecandyPanel> = React.createRef<EyecandyPanel> ();
	private task_form_panel: React.RefObject<EyecandyPanel> = React.createRef<EyecandyPanel> ();

	private task_form: React.RefObject<HTMLFormElement> = React.createRef<HTMLFormElement> ();
	

	private project_code () {
		let project_control: ProjectSelectorGadget = this.project_selector.current;
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


	private load_task (event: SyntheticEvent) {

		let project_selector: ProjectSelectorGadget = this.project_selector.current;
		let selected_row = event.currentTarget;
		let task_id = parseInt ((selected_row.querySelector ("input[type=hidden][name=task_id]") as HTMLInputElement).value);
		let project_id = this.state.selected_project;

		this.setState ({ editor_open: true }, () => this.show_task_form ((callback: any) => {
			TasksModel.fetch_task (task_id, (result: any) => this.setState ({ task_data: result }, () => {
				AccountsModel.fetch_by_project (project_id, (result: AccountsList) => this.setState ({ project_members: result }, () => {
					MiscModel.fetch_statuses ((result: any) => this.setState ({ statuses: result }, callback));
				}));
			}));
		}));

	}// load_task;


	private update_task_list (project_id: number, callback: any = null) {

		TasksModel.fetch_tasks_by_project (project_id, (data: any) => {

			let account: AccountData = this.current_account ();
			let response: any [] = ["There are no tasks defined"];

			if (common.not_empty (data)) {
				response.length = 0;
				(Array.isArray (data) ? data : [data]).forEach ((item: any) => {
					let row = <div className="task-row" key={`task_${item.task_id}`} onClick={this.load_task.bind (this)}>
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

		this.setState ({ selected_project: event.target.value });
//		task_editor.show ((callback: Function) => { this.update_task_list (event.target.value, callback); });
	}// load_tasks;


	private current_task (field: string) {
		let default_value = (field == "due_date") ? this.default_due_date () : constants.empty;
		let result = (common.isset (this.state.task_data) ? (common.isset (this.state.task_data [field]) ? this.state.task_data [field] : default_value) : default_value);
		return result;
	}// current_task;


	private save_task () {

		let selector: ProjectSelectorGadget = this.project_selector.current;

		let parameters: FormData = new FormData (this.task_form.current as HTMLFormElement);
		let parameter_values = parameters.toObject ();

		if (common.is_empty (parameter_values.task_name)) return;

		document.getElementById ("data_indicator").style.opacity = "1";
		parameters.append ("project_id", this.state.selected_project);
		parameters.append ("task_id", this.current_task ("task_id"));
		parameters.append ("action", "save");

		Database.save_data ("tasks", parameters).then ((data: any) => {
			if (common.isset (parameter_values.task_id)) return;
			this.setState ({ task_id: data.task_id }, (() => {
				this.update_task_list (this.state.selected_project);
				document.getElementById ("data_indicator").style.opacity = "0";
			}).bind (this));
		});

	}// save_task;


	/********/


	public state: TaskState = {

		task_list: null,
		task_data: null,
		selected_project: null,

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


				<ProjectSelectorGadget id="project_selector" ref={this.project_selector} parent={this}
					onProjectChange={(event: BaseSyntheticEvent) => {
						this.setState ({ selected_project: event.target.value }, () => this.load_tasks.bind (this));
					}}
					onLoad={() => { globals.master_panel.setState ({ eyecandy_visible: false }) }}>
				</ProjectSelectorGadget>


				<EyecandyPanel ref={this.task_editor}>

					<div className="two-column-grid outlined">

						<div id="task_list_panel" className="form-panel">
							<div id="task_list">{this.state.task_list}</div>
							<button onClick={() => this.show_task_form ((callback: Function) => {
								this.setState ({
									task_data: null,
									selected_project: null
								});
								this.execute (callback);
							})}>New</button>
						</div>
{/* 
						<FreezePanel id="task_editor_panel" className="centering-container">
*/}							
							<EyecandyPanel ref={this.task_form_panel} /* shrinking={false}
								 /* eyecandyClass="border-panel" contentsClass="border-panel" - Fix and reinstate? */>

								<form id="task_form" ref={this.task_form}>

									<div style={{ textAlign: "right", marginBottom: "1em" }}>{this.project_code ()}</div>

									<div className="one-piece-form">
										<label htmlFor="task_name">Name</label>
										<input type="text" name="task_name" defaultValue={this.state_value ("task_data", "task_name")} 
											onBlur={this.save_task.bind (this)} maxLength={45}>
										</input>
									</div>

									<textarea id="task_description" name="task_description" placeholder="Description (optional)"
										defaultValue={this.current_task ("task_description")} onBlur={this.save_task.bind (this)}>
									</textarea>

									<div className="one-piece-form">
										<label htmlFor="due_date">Due Date (Deadline)</label>
										<DatePicker id="due_date"
											onChange={(date: Date) => {
												this.setState ({ due_date: date }, () => {
													this.forceUpdate ();
												});
											}}

											// selected={this.default_due_date ()}
											// defaultValue={this.current_task ("deadline")}
											
											>
											
										</DatePicker>
									</div>

									<div className="one-piece-form">

										<label htmlFor="estimate">Estimate (hours)</label>
										<input type="numeric" id="estimate" name="estimate" defaultValue={this.current_task ("estimate")} />

										<break />

										<label htmlFor="assignee">Assigned to</label>
										<SelectList id="assignee_id" data={this.state.project_members} id_field="account_id" text_field="username"
											value={this.current_task ("assignee_id")} onChange={this.save_task.bind (this)}>
										</SelectList>

										<break />

										<label htmlFor="status">Status</label>
										<SelectList id="status_id" data={this.state.statuses} id_field="status_id" text_field="name" 
											value={this.current_task ("status_id")} onChange={this.save_task.bind (this)}>
										</SelectList>

									</div>

								</form>

							</EyecandyPanel>
{/* 
						</FreezePanel>
*/}
					</div>

				</EyecandyPanel>

			</div>
		);
	}// render;

}// TasksPanel;