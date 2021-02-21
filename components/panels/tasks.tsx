import React, { SyntheticEvent } from "react";

import DatePicker from "react-datepicker";

import Database from "components/classes/database";
import EyecandyPanel from "components/controls/eyecandy.panel";
import BaseControl from "components/controls/base.control";
import ProjectSelecterGadget from "components/panels/gadgets/project.selecter.gadget";

import { globals } from "components/types/globals";
import { tasks_model } from "components/models/tasks";

import * as common from "components/classes/common";
import * as constants from "components/types/constants";


const default_task_duration: number = 14;


export default class TasksPanel extends BaseControl<any> {


	private project_code () {
		let project_control: ProjectSelecterGadget = this.reference ("project_selecter");
		return common.nested_value (project_control, "state", "current_project", "project_code");
	}// project_code;


	private default_due_date () {
		let current_time = new Date ();
		return current_time.setDate (current_time.getDate () + default_task_duration);
	}// default_due_date;


	private edit_task (event: SyntheticEvent) {
		// TO BE CREATED
	}// edit_task;


	private load_tasks (event: any) {
		let task_editor: EyecandyPanel = this.reference ("task_editor");

		tasks_model.fetch_tasks (event.target.value, (data: any) => {

			let response: any [] = ["There are no tasks defined"];

			if (common.not_empty (data)) {
				response.length = 0;
				(Array.isArray (data) ? data : [data]).forEach ((item: any) => {
					let row = <div  className="task-row">
						{/* <input type="hidden" name="task_id" value={item.task_id ?? constants.empty} /> */}
						<div>{item.name}</div>
						<button onClick={this.edit_task}>Edit</button>
					</div>;
					response.push (row);
				});
			}// if;

			this.setState ({ task_list: response }, task_editor.show.bind (task_editor));

		});
	}// load_tasks;


	private save_task () {

		let selecter: ProjectSelecterGadget = this.reference ("project_selecter");

		let parameters: FormData = new FormData (this.reference ("task_form") as HTMLFormElement);
		let parameter_values = parameters.toObject ();

		if (common.is_empty (parameter_values.task_name)) return;

		document.getElementById ("data_indicator").style.opacity = "1";
		parameters.append ("project_id", selecter.state.current_project.project_id);
		parameters.append ("task_id", this.state.task_id.toString ());
		parameters.append ("action", "save");

		Database.save_data ("tasks", parameters, (data) => {
			if (common.isset (parameter_values.task_id)) return;
			this.setState ({ task_id: data.task_id }, (() => {
				document.getElementById ("data_indicator").style.opacity = "0";
			}).bind (this));
		});

	}// save_task;


	private show_task_form () {
		let task_form_panel: EyecandyPanel = this.reference ("task_form_panel");
		if (common.isset (task_form_panel)) task_form_panel.show ();
	}// show_task_form;


	/********/


	public state= {
		task_list: null,

		task_id: 0,

		name: constants.empty,
		description: constants.empty,

		due_date: this.default_due_date (),

		estimate: 0,

		editor_style: constants.empty
	}// state;


	public render () {

		return (
			<div id="tasks_panel" className="horizontal-centering-container">

				<link rel="stylesheet" href="node_modules/react-datepicker/dist/react-datepicker.css" />
				<link rel="stylesheet" href="resources/styles/panels/projects.css" />
				<link rel="stylesheet" href="resources/styles/panels/tasks.css" />


				<ProjectSelecterGadget id="project_selecter" ref={this.create_reference} parent={this}
					onProjectChange={this.load_tasks.bind (this)}
					onLoad={() => { globals.home_page.setState ({ eyecandy_visible: false }) }}>
				</ProjectSelecterGadget>


				<EyecandyPanel id="task_editor" ref={this.create_reference} className={this.state.editor_style}>

					<div id="task_list_panel" className="form-panel">
						<div id="task_list">{this.state.task_list}</div>
						<button onClick={this.show_task_form.bind (this)}>New</button>
					</div>

					<EyecandyPanel id="task_form_panel" ref={this.create_reference} vanishing={true}
						beforeShowingContents={() => { this.setState ({ editor_style: "two-column-panel" }) }}>

						<form id="task_form" ref={this.create_reference}>

							<div style={{ textAlign: "right", marginBottom: "1em" }}>{this.project_code ()}</div>

							<div className="two-piece-form">
								<label htmlFor="task_name">Name</label>
								<input type="text" name="task_name" defaultValue={this.state.name} onBlur={this.save_task.bind (this)} />
							</div>

							<textarea id="task_description" name="task_description" placeholder="Description (optional)"
								defaultValue={this.state.description} onBlur={this.save_task.bind (this)} style={{
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
									value={this.state.due_date}>
								</DatePicker>
							</div>

							<div className="two-piece-form">
								<label htmlFor="estimate" style={{ whiteSpace: "nowrap" }}>Estimate (hours)</label>
								<input type="numeric" name="estimate" defaultValue={this.state.estimate} />
							</div>

						</form>
					</EyecandyPanel>

				</EyecandyPanel>

			</div>
		);
	}// render;

}// TasksPanel;