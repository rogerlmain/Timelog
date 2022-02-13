import React, { BaseSyntheticEvent } from "react";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";

import TasksModel, { TaskItem } from "models/tasks";

import { AccountsList } from "models/accounts";
import { TreeView } from "controls/treeview";

interface TaskTreeProperties extends DefaultProps {
	accountID: number;
	onClick: Function;
}// TaskTreeProperties;


interface TaskTreeState extends DefaultState {
	tasks: any;
	current_task: any;
}// TaskTreeState;


export default class TaskTree extends BaseControl<TaskTreeProperties, TaskTreeState> {


	public state: TaskTreeState = { 
		tasks: null,
		current_task: null
	}// state;


	public props: TaskTreeProperties;


	public componentDidMount () {
		TasksModel.fetch_tasks_by_assignee (this.props.accountID, (result: AccountsList) => this.setState ({ tasks: result }));
	}// componentDidMount;


	public render () {
		return (
			<TreeView data={this.state.tasks} id_field="task_id" 
				branches={["client_name", "project_name", "task_name"]} 
				onClick={(event: BaseSyntheticEvent) => {
					this.setState ({ current_task: (event.targetValue as TaskItem)}, () => this.execute (this.props.onClick, event));
				}}>
			</TreeView>
		);
	}// render;


}// TaskTree;