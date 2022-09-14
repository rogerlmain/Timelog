import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import Container from "client/controls/container";

import { CheckboxCell } from "client/controls/abstract/input.control";

import { dom_element, isset, is_empty, is_function, is_null, nested_value, not_set } from "client/classes/common";

import "resources/styles/forms.css";


/********/


export default class ReportGrid extends BaseControl {


	static defaultProps = { 

		data: null,
		categories: null,
		tally: null, 	// categories that should be tallied

		header: null,
		row: null,
		footer: null,

	}// defaultProps;


	subset = (data, category) => {

		let result = null;

		data.forEach (row => {

			let new_row = structuredClone (row);

			delete new_row [category];

			if (not_set (result)) result = {}
			if (not_set (result [row [category]])) result [row [category]] = []

			result [row [category]].push (new_row);

		});

		return result;

	}// subset;


	report_items = data => {

		const add_row = (field, data) => {
			if (not_set (this.props [field])) return;
			if (is_null (result)) result = [];
			result.push (<Container key={this.create_key ()}>{this.props [field] (data)}</Container>);
		}/* add_row */;

		let result = null;

		add_row ("header", data);
		data.forEach (row => add_row ("row", row));
		
		return result;

	}// report_items;


	report_branch = (data, categories) => {

		const HeaderCell = props => { 

			let depth = this.props.categories.length - subcategories.length;
			let shading = 0x88 + (0x22 * depth);
			let header_color = `#${shading.toString (16)}${shading.toString (16)}${shading.toString (16)}`;
			
			return <div style={{ ...props.style, backgroundColor: header_color }}>{props.children}</div>

		}/* HeaderCell */;


		let result = null;

		let category = categories [0];
		let dataset = this.subset (data, category);
		let subcategories = categories.slice (1);

		Object.keys (dataset).forEach (key => {

			if (is_null (result)) result = [];

			result.push (<HeaderCell key={this.create_key ()} style={{ gridColumn: "1/-1" }}>{key}</HeaderCell>);

			switch (is_empty (subcategories)) {
				case true: result.push (this.report_items (dataset [key])); break;
				default: result.push (this.report_branch (dataset [key], subcategories)); break;
			}// switch;

		});

		return result;

	}/* report_branch */;


	render () {

		const cell_count = (object) => {

			let count = 0;

			if (isset (nested_value (object.props, "children"))) object.props.children.forEach (child => {
				if (dom_element (child)) return count++;
				if (is_function (child.type) && (child.type.name.equals ("Container"))) count += cell_count (child);
			});

			return count;

		}/* cell_count */;


		const max_cell_count = () => {
			const count = template => { return is_function (this.props [template]) ? cell_count (this.props [template] ({})) : 1 }
			return Math.max (count ("header"), count ("row"));//, count ("footer"));
		}/* max_cell_count */;


		if (is_null (this.props.data)) return null;

		
		return <div className="report-grid" 
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${max_cell_count ()}, min-content)`,
			}}>
			
			{this.report_branch (this.props.data, this.props.categories)}
			{is_function (this.props.footer) ? this.props.footer () : null}

		</div>

	}// render;


}// ReportGrid;