import React, { SyntheticEvent } from "react";

import DatePicker from "react-datepicker";

import * as common from "client/classes/common";
import * as constants from "client/types/constants";
import * as datatypes from "client/types/datatypes";

import Database from "client/classes/database";
import BaseControl from "controls/base.control";
import EyecandyPanel from "client/controls/eyecandy.panel";
import FreezePanel from "client/controls/freeze.panel";
import ProjectSelectorGadget from "client/panels/gadgets/project.selector.gadget";

import { globals } from "client/types/globals";
import { TasksModel } from "client/models/tasks";
import { vertical_alignment } from "client/types/constants";
import TeamSelectorGadget, { TeamGroup } from "./gadgets/team.selector.gadget";


const default_task_duration: number = 14;


export default class TasksPanel extends BaseControl<any> {


	private project_code () {
		let project_control: ProjectSelectorGadget = this.reference ("project_selector");
		return common.nested_value (project_control, "state", "current_project", "project_code");
	}// project_code;


	private default_due_date () {
		let current_time = new Date ();
		return current_time.setDate (current_time.getDate () + default_task_duration);
	}// default_due_date;


	private show_task_form (callback: Function = null) {
		let task_form_panel: EyecandyPanel = this.reference ("task_form_panel");
		if (common.not_set (task_form_panel)) return;
		task_form_panel.show (callback ?? ((command: Function) => command ()));
	}// show_task_form;


	private load_task (event: SyntheticEvent) {

		let selected_row = event.currentTarget;
		let task_id = (selected_row.querySelector ("input[type=hidden][name=task_id]") as HTMLInputElement).value;
		let project_selector: ProjectSelectorGadget = this.reference ("project_selector");

		this.setState ({ task_data: {} }, () => {
			this.reference ("team_panel").setState ({
				organization_id: project_selector.state.current_project.project_id,
				record_id: task_id
			});
			this.forceUpdate (() => this.show_task_form ((callback: any) => TasksModel.fetch_task (parseInt (task_id), (result: any) => {
				this.setState ({ task_data: result }, callback);
			})));
		});

	}// load_task;


	private load_tasks (event: any) {

		let task_editor: EyecandyPanel = this.reference ("task_editor");

		this.setState ({ selected_project: event.target.value });

		task_editor.show ((callback: any) => TasksModel.fetch_tasks (event.target.value, (data: any) => {

			let account: datatypes.account = this.current_account ();
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

		}));
	}// load_tasks;


	private current_task (field: string) {
		let default_value = (field == "due_date") ? this.default_due_date () : constants.empty;
		let result = (common.isset (this.state.task_data) ? (common.isset (this.state.task_data [field]) ? this.state.task_data [field] : default_value) : default_value);
		return result;
	}// current_task;


	private save_task () {

		let selector: ProjectSelectorGadget = this.reference ("project_selector");

		let parameters: FormData = new FormData (this.reference ("task_form") as HTMLFormElement);
		let parameter_values = parameters.toObject ();

		if (common.is_empty (parameter_values.task_name)) return;

		document.getElementById ("data_indicator").style.opacity = "1";
		parameters.append ("project_id", selector.state.current_project.project_id);
		parameters.append ("task_id", this.current_task ("task_id"));
		parameters.append ("action", "save");

		Database.save_data ("tasks", parameters, (data) => {
			if (common.isset (parameter_values.task_id)) return;
			this.setState ({ task_id: data.task_id }, (() => {
				document.getElementById ("data_indicator").style.opacity = "0";
			}).bind (this));
		});

	}// save_task;


	/********/


	public state = {
		task_list: null,
		task_data: null,
		selected_project: null,

		editor_style: constants.empty,
	}// state;


	public render () {


		const editor_style = {
			paddingRight: "2em",
			marginRight: "2em",
			borderRight: "solid 1px black"
		};


		const get_editor_style = () => {
			let task_editor: EyecandyPanel = this.reference ("task_editor");
			if (common.not_set (task_editor) || (!(task_editor.state.contents_visible || task_editor.state.eyecandy_visible))) return null;
			return editor_style;
		}// get_editor_style


		return (
			<div id="tasks_panel" className="horizontal-centering-container">

				<link rel="stylesheet" href="node_modules/react-datepicker/dist/react-datepicker.css" />
				<link rel="stylesheet" href="resources/styles/panels/projects.css" />
				<link rel="stylesheet" href="resources/styles/panels/tasks.css" />


				<ProjectSelectorGadget id="project_selector" ref={this.create_reference} parent={this}
					onProjectChange={this.load_tasks.bind (this)}
					onLoad={() => { globals.home_page.setState ({ eyecandy_visible: false }) }}>
				</ProjectSelectorGadget>


				<EyecandyPanel id="task_editor" ref={this.create_reference} className="two-column-grid" align={vertical_alignment.top}>

					<div id="task_list_panel" className="form-panel"

						style={ get_editor_style () }>

						<div id="task_list">{this.state.task_list}</div>
						<button onClick={() => this.show_task_form ((callback: Function) => {
							this.setState ({
								task_data: null,
								selected_project: null
							});
							this.execute_event (callback);
						})}>New</button>
					</div>

					<FreezePanel id="task_editor_panel" className="centering-container">
						<EyecandyPanel id="task_form_panel" ref={this.create_reference} vanishing={true}>
							<div id="task_form" ref={this.create_reference}>

								<div style={{ textAlign: "right", marginBottom: "1em" }}>{this.project_code ()}</div>

								<div className="two-piece-form">
									<label htmlFor="task_name">Name</label>
									<input type="text" name="task_name" defaultValue={this.state_object_field ("task_data", "task_name")} onBlur={this.save_task.bind (this)} />
								</div>

								<textarea id="task_description" name="task_description" placeholder="Description (optional)"
									defaultValue={this.current_task ("task_description")} onBlur={this.save_task.bind (this)} style={{
										margin: "1em 0",
										width: "100%",
										resize: "vertical"
									}}>
								</textarea>

								<div className="two-piece-form">
									<label htmlFor="due_date">Due Date (Deadline)</label>
									<DatePicker id="due_date"
										onChange={(date: Date) => {
											this.setState ({ due_date: date }, () => {
												this.forceUpdate ();
											});
										}}
										selected={this.default_due_date ()}
										defaultValue={this.current_task ("deadline")}>
									</DatePicker>
								</div>

								<div className="two-piece-form">
									<label htmlFor="estimate" style={{ whiteSpace: "nowrap" }}>Estimate (hours)</label>
									<input type="numeric" name="estimate" defaultValue={this.current_task ("estimate")} />
								</div>

								<div style={{ marginTop: "2em" }}>


									<TeamSelectorGadget id="team_panel" ref={this.create_reference}
										parent={this} group={TeamGroup.task} record_id={this.state.selected_project}>
									</TeamSelectorGadget>

								</div>
							</div>
						</EyecandyPanel>
					</FreezePanel>

				</EyecandyPanel>

			</div>
		);
	}// render;

}// TasksPanel;