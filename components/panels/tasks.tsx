import React from "react";

import DatePicker from "react-datepicker";

import ProjectSelecterGadget from "./gadgets/project.selecter.gadget";
import BaseControl from "components/controls/base.control";

import { globals } from "components/types/globals";
import { tasks_model } from "components/models/tasks";

import * as common from "components/classes/common";
import * as constants from "components/types/constants";

import EyecandyPanel from "components/controls/eyecandy.panel";


const default_task_duration: number = 14;


export default class TasksPanel extends BaseControl<any> {


	private default_due_date () {
		let current_time = new Date ();
		return current_time.setDate (current_time.getDate () + default_task_duration);
	}// default_due_date;


	private load_tasks (event: any) {
		let task_editor: EyecandyPanel = this.reference ("task_editor");

		tasks_model.fetch_tasks (event.target.value, (data: any) => {

			let response = ["There are no tasks defined"];

			if (common.not_empty (data)) {
				response.length = 0;
				data.forEach ((item: any) => response.push (item));
			}// if;

			this.setState ({ task_list: response }, task_editor.show.bind (task_editor));

		});
	}// load_tasks;


	private save_task () {
		// TO BE DEFINED
	}// save_task;


	private show_task_form () {
		let task_form: EyecandyPanel = this.reference ("task_form");
		task_form.show ();
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

					<div id="task_list_panel">
						<div className="one-column-form form-panel">
							<div id="task_list">{this.state.task_list}</div>
							<button onClick={this.show_task_form.bind (this)}>New</button>
						</div>
					</div>

					<EyecandyPanel id="task_form" ref={this.create_reference} vanishing={true}
						beforeShowingContents={() => { this.setState ({ editor_style: "two-column-panel" }) }}>

						<div id="task_form_panel">

							<input type="hidden" id="project_id" name="project_id" value={this.state.task_id} />

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

						</div>
					</EyecandyPanel>

				</EyecandyPanel>

			</div>
		);
	}// render;

}// TasksPanel;