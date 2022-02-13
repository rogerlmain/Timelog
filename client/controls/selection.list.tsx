import React from "react";

import * as common from "classes/common";

import BaseControl, { DefaultProps } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";


interface selectionListProps extends DefaultProps {

	id: string;

	onChange?: any;

	value_field: string;
	output_field: string;

	label: string;

	visible: any;
	data: any;

}// selectionListProps;


export default class SelectionList extends BaseControl<selectionListProps> {


	public props: selectionListProps;


	public render () {
		return (

			<div id="project_list" style={{ display: "contents" }}>

				<ExplodingPanel visible={this.props.visible}>
					<label htmlFor="project_selector" className="form-item">{this.props.label}</label>
				</ExplodingPanel>

				<ExplodingPanel visible={this.props.visible}>
					<select id={this.props.id} name={this.props.id} className="form-item" defaultValue="placeholder"

						onChange={this.props.onChange}>

						{common.isset (this.props.data) ? this.select_options (this.props.data, this.props.value_field, this.props.output_field) : this.props.children}

					</select>
				</ExplodingPanel>

			</div>

		);
	}// render;

}// SelectionList;