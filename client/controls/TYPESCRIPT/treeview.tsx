import * as common from "client/classes/common";

import React, { BaseSyntheticEvent } from "react";

import BaseControl, { DefaultProps } from "client/controls/base.control";
import ExplodingPanel from "client/controls/panels/exploding.panel";

import * as constants from "types/constants";
import { TaskList } from "models/tasks";


interface TreeViewProperties extends DefaultProps { 
	text?: string;
	data?: Array<any>;
	branches?: Array<string>;
	id_field?: string;
	onClick?: Function;
}// TreeViewProperties;


interface treeNodeInterface extends DefaultProps { 
	onClick?: Function;
	value?: any;
}// treeNodeInterface;


export class TreeView extends BaseControl<TreeViewProperties> {


	private unique_values (data: Array<any>, branch: string) {

		let result: Array<any> = null;

		data.forEach ((item: any) => {
			if (common.is_null (result)) result = new Array<any> ();
			if (result.indexOf (item [branch]) < 0) result.push (item [branch]);
		});
		return result;

	}// unique_values;


	private data_values (data: Array<any>, field_name: string, field_value: any) {

		let result: Array<any> = null;

		data.forEach ((item: any) => {
			if (common.is_null (result)) result = new Array<any> ();
			if (item [field_name] == field_value) result.push (item);
		});
		return result;

	}// data_values;


	private get_branch_group (data: Array<any>, branches: Array<string>): Array<any> {

		let field_name = branches [0];
		let result: Array<any> = null;
		let data_values = this.unique_values (data, branches [0]);

		data_values.forEach ((branch: any) => {
			
			let data_items: TaskList = this.data_values (data, field_name, branch);

			if (common.is_null (result)) result = new Array<any> ();
			switch (branches.length) {
				case 1: result.push (<TreeNode onClick={this.props.onClick} value={data_items [0]}>{branch}</TreeNode>); break;
				default: result.push (<TreeView text={branch}>{this.get_branch_group (data_items, branches.slice (1))}</TreeView>); break;
			}// switch;

		});
		return result;

	}// get_branch_group;


	private parse_tree () {
		return this.get_branch_group (this.props.data, this.props.branches);
	}// get_task_tree;


	private render_node () {

		return (
			<div 
				onClick={(event: BaseSyntheticEvent) => {
					event.stopPropagation ();
					this.setState ({ open: !this.state.open });
				}}// onClick;
			
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(2, max-content)",
					columnGap: "0.25em",
					alignItems: "center",
					cursor: "pointer"
				}}>
			
				<div
					style={{
						width: "1em",
						height: "1em",
						display: "inline-flex",
						justifyContent: "flex-start",
						alignItems: "center"
					}}>
					<div className={`glyph ${this.state.open ? "open" : null}`} 
						style={{
							border: "solid 2px #666",
							width: "0.5em",
							height: "0.5em",
							borderTop: "none",
							borderLeft: "none",
							transform: `rotate(${this.state.open ? constants.empty : "-"}45deg)`
						}}>
					</div>
				</div>
				<div>{this.props.text}</div>

				<div />
				<ExplodingPanel id={`${this.props.id}_explode_panel`}>
					<ul id={this.props.id} className="treeview">{this.props.children}</ul>
				</ExplodingPanel>

			</div>
		);
	}// render;


	/********/


	public state = { open: false }

	public props: TreeViewProperties;


	public render () {
		if (common.isset (this.props.data) && common.isset (this.props.branches)) return this.parse_tree ();
		return this.render_node ();
	}// render;

}// TreeView;


export class TreeNode extends BaseControl<treeNodeInterface> {

	public props: treeNodeInterface;

	public render () {
		let result = <li className="treenode"
		
			onClick={(event: BaseSyntheticEvent) => {
				event.stopPropagation ();
				event.targetValue = this.props.value;
				this.execute (this.props.onClick, event);
			}} 
			style={{ cursor: common.isset (this.props.onClick) ? "pointer" : null }}>

			{this.props.children}
			
		</li>;
		return result;
	}// render;

}// TreeNode;
