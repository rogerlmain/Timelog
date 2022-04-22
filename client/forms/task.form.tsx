import * as common from "classes/common";
import * as constants from "types/constants";

import FormControl from "controls/form.control";
import React from "react";
import DatePicker from "react-datepicker";

import { DefaultProps, DefaultState } from "controls/base.control";
import { TaskData } from "types/datatypes";


interface TaskFormProps extends DefaultProps {
	taskData: TaskData;
	onSave?: any;
}// TaskFormState;


interface TaskFormState extends DefaultState {
	task_data: TaskData;
}// TaskFormState;


export default class TaskForm extends FormControl<TaskFormProps, TaskFormState> {

	private task_data (field: string) { return common.isset (this.state.task_data) ? this.state.task_data [field] : (common.isset (this.props.taskData) ? this.props.taskData [field] : constants.blank) }
	private set_data (value: Object) { return this.setState ({ project_data: { ...this.state.task_data, ...value }}) }

	private task_form: React.RefObject<HTMLFormElement> = React.createRef<HTMLFormElement> ();
	
	private save_task () {

		// let selector: TaskSelectorGadget = this.project_selector.current;

		// let parameters: FormData = new FormData (this.task_form.current as HTMLFormElement);
		// let parameter_values = parameters.toObject ();

		// if (common.is_empty (parameter_values.task_name)) return;

		// document.getElementById ("data_indicator").style.opacity = "1";
		// parameters.append ("project_id", this.state.selected_project);
		// parameters.append ("task_id", this.current_task ("task_id"));
		// parameters.append ("action", "save");

		// Database.save_data ("tasks", parameters).then ((data: any) => {
		// 	if (common.isset (parameter_values.task_id)) return;
		// 	this.setState ({ task_id: data.task_id }, (() => {
		// 		this.update_task_list (this.state.selected_project);
		// 		document.getElementById ("data_indicator").style.opacity = "0";
		// 	}).bind (this));
		// });

		this.props.onSave ();

	}// save_task;


	/********/


	public static defaultProps: TaskFormProps = {
		taskData: null
	}// defaultProps;


	public state: TaskFormState = {
		task_data: null
	}// state;


	public render () {
		return (

			<form id="task_form" ref={this.task_form}>

				<div className="two-column-grid outlined">

					<div style={{ textAlign: "right", marginBottom: "1em" }}>{/*this.project_code ()*/}</div>

					<div className="one-piece-form">
						<label htmlFor="task_name">Name</label>
						<input type="text" name="task_name" defaultValue={this.state_object_field ("task_data", "task_name")} 
							onBlur={this.save_task.bind (this)} maxLength={45}>
						</input>
					</div>

					<textarea id="task_description" name="task_description" placeholder="Description (optional)"
						defaultValue={this.task_data ("task_description")} onBlur={this.save_task.bind (this)}>
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
						<input type="numeric" id="estimate" name="estimate" defaultValue={this.task_data ("estimate")} />

						<br />
{/* 
						<label htmlFor="assignee">Assigned to</label>
						<SelectList id="assignee_id" data={this.state.project_members} id_field="account_id" text_field="username"
							value={this.current_task ("assignee_id")} onChange={this.save_task.bind (this)}>
						</SelectList>

						<br />

						<label htmlFor="status">Status</label>
						<SelectList id="status_id" data={this.state.statuses} id_field="status_id" text_field="name" 
							value={this.current_task ("status_id")} onChange={this.save_task.bind (this)}>
						</SelectList>
*/}
					</div>

				</div>

			</form>

		);
	}// render;

}// TaskForm;