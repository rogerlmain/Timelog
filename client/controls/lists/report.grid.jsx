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

		billable: false,

	}// defaultProps;


	cell_count = object => {

		const has_children = item => Array.isArray (item?.props?.children) && (item?.props?.children?.length > 0);

		const count_children = item => {

			let count = 0;

			if (!has_children (item)) return isset (item?.props) ? 1 : 0;
			item?.props?.children?.forEach (child => count += count_children (child));
			return count;

		}/* count_children */;

		let result = count_children (this.props?.["header"] ());

		return result;

	}/* cell_count */;


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

		add_row ("header", data?.[0]);
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

		if (is_null (this.props.data)) return null;
		
		return <div className="report-grid" 
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${this.cell_count ()}, min-content)`,
			}}>
			
			{this.report_branch (this.props.data, this.props.categories)}
			{is_function (this.props.footer) ? this.props.footer (this.props.data) : null}

		</div>

	}// render;


}// ReportGrid; 	