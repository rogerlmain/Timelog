import React from "react";

import * as common from "components/classes/common";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";


interface selectionListInterface extends defaultInterface {
	onchange?: any;

	value_field: string;
	output_field: string;

	label: string;

	visible: any;
	data: any;
}// selectionListInterface;


export default class SelectionList extends BaseControl<selectionListInterface> {

	public render () {
		return (

			<div id="project_list" style={{ display: "contents" }}>

				<FadeControl visible={this.props.visible}>
					<label htmlFor="project_selecter" className="form-item">{this.props.label}</label>
				</FadeControl>

				<FadeControl visible={this.props.visible}>
					<select id={this.props.id} ref={this.create_reference} name={this.props.id} className="form-item" defaultValue="placeholder"

						onChange={this.props.onchange}>

						<option key="placeholder" value="placeholder" disabled={true} />
						{common.isset (this.props.data) ? this.select_options (this.props.data, this.props.value_field, this.props.output_field) : this.props.children}

					</select>
				</FadeControl>

			</div>

		);
	}// render;

}// SelectionList;