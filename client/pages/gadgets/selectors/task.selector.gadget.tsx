import React, { BaseSyntheticEvent } from "react";

import BaseControl, { DefaultProps } from "controls/base.control";
import SelectList from "controls/select.list";
import TasksModel from "models/tasks";

import ProjectSelectorGadget from "pages/gadgets/selectors/project.selector.gadget";


interface TasksPageProps extends DefaultProps {

	id: string;

	onLoad?: Function;
	onProjectChange?: Function;
	onTaskChange: Function;

}// tasksPageProps;


interface TasksPageState {

	tasks: any;

	task_id: number;

}// state;


export default class TaskSelectorGadget extends BaseControl<TasksPageProps, TasksPageState> {

	private task_list: React.RefObject<SelectList> = React.createRef ();

	private task_selector_id: any = null;


	private load_tasks (callback: Function = null) {
		TasksModel.fetch_tasks_by_project (this.state.task_id, (data: Object) => {
			this.setState ({ tasks: data }, () => {
				this.setState ({ tasks_loaded: true }, callback);
			});
		});
	}// load_tasks;


	/********/


	public props: TasksPageProps;

	public state: TasksPageState;


	public constructor (props: any) {
		super (props);
		this.task_selector_id = `${this.props.id}_task_selector`;
	}// constructor;


	public render () {
		return (
			<div id={this.props.id} className="two-column-grid task-selector-form">

				<ProjectSelectorGadget id="project_selector" hasHeader={true} headerSelectable={false}
					onProjectChange={(event: BaseSyntheticEvent) => {
						this.setState ({ project_id: event.target.value }, () => this.load_tasks (this.props.onProjectChange));
					}}>
				</ProjectSelectorGadget>

				<label htmlFor={this.task_selector_id}>Task</label>

				<SelectList id={this.task_selector_id} ref={this.task_list} className="form-item" style={{ width: "100%" }}
					onChange={this.props.onTaskChange}>
					<option value={0} style={{ fontStyle: "italic" }}>New</option>
					{this.select_options (this.state.tasks, "task_id", "task_name")}
				</SelectList>

			</div>
		);
	}// render;

}// TaskSelectorGadget;