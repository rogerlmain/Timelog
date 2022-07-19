import React from "react";

import Container 		from "client/controls/container";
import BaseControl		from "client/controls/abstract/base.control";
import TreeView 		from "client/controls/lists/tree.view";

import OptionStorage	from "client/classes/storage/options.storage";

import { date_formats, debugging, space, tracing } from "client/classes/types/constants";
import { isset, is_null, not_set } from "client/classes/common";


export default class TreeGrid extends BaseControl {


	state = { grid_style: null }


	static defaultProps = { data: null }


	constructor (props) {
		super (props);
		if (debugging) console.log (`${props.id} TreeGrid created`);
	}// constructor;


	list_entries (data) {

		let result = null;

		Object.values (data).forEach (datum => {
			if (is_null (result)) result = [];
			result.push (<div key={this.create_key ("tree_grid")}>{datum}</div>);
		});

		return result;

	}// list_entries;


	/******** /


	componentDidUpdate () {

		const get_widths = lists => {

			let result = null;

			lists.forEach (item => { 
				for (let i = 0; i < item.children.length; i++) {

					let child = item.children [i];

					if (is_null (result)) result = {}
					if (not_set (result [i]) || (result [i] < child.scrollWidth)) result [i] = child.scrollWidth;

				}// for;
			});

			return result;

		}/* get_widths * /;

		let lists = document.querySelectorAll ("div.tree-list div.array-list");
		if ((lists.length > 0) && not_set (this.state.grid_style)) this.setState ({ columns: `${Object.values (get_widths (lists)).join ("px ")}px` });

	}// componentDidUpdate;


	componentDidMount = this.componentDidUpdate;


	*/


	render () {

		let can_bill = OptionStorage.can_bill ();
		let column_count = isset (this.props.data) ? Object.values (this.props.data [0]).length : 0;

		return <TreeView data={this.props.data} />
		
		// nodeFields={["year", "month", "day"]} 

		// 	glyph={<div className="tree-glyph" />}

		// 	format={entry => {
		// 		return <div key={this.create_key ("array_list")} className="array-list"

		// 			style={{
		// 				display: "grid",
		// 				gridTemplateColumns: isset (this.state.columns) ? this.state.columns : `repeat(${column_count}, min-content)`,
		// 			}}>

		// 			{this.list_entries (entry)}

		// 		</div>
		// 	}}
			
		// 	footer={entries => {
		// 		return <Container>
		// 			<div style={{ gridColumn: "1 / 4"}} />
		// 			<div>[total hours]</div>
		// 			<div>[total cost]</div>
		// 		</Container>
		// 	}}>

		// </TreeView>

	}// render;

}// TreeGrid;


