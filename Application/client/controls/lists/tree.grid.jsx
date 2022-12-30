import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import TreeView from "client/controls/lists/tree.view";

import { isset, is_empty, is_function, is_null } from "client/classes/common";


export default class TreeGrid extends BaseControl {


	static defaultProps = { 
		data: null,
		header: null,
		footer: null,
	}// defaultProps;


	state = { widths: null }


	treeview = React.createRef ();


	/********/


	get_column_count = lists => {
		let count = 0;
		lists.forEach (item => {if (item.children.length > count) count = item.children.length} );
		return count;
	}/* get_column_count */;


	load_column_counts = () => {

		let column_count = null;
		let rows = document.querySelectorAll ("div.tree-grid-data");

		if (is_empty (rows)) return setTimeout (this.load_column_counts);

		column_count = this.get_column_count (rows);

		rows.forEach (row => {
			row.style.gridTemplateColumns = `repeat(${column_count}, min-content)`;
		});

	}/* load_column_counts */;


	/********/	


	get_max_width = (lists, index) => {

		let max_width = 0;

		lists.forEach (item => { 

			let child = item.children?.[index];

			if (is_null (child)) return;
			if (child.property ("grid-column-start") != child.property ("grid-column-end")) return;

			if (child.offsetWidth > max_width) max_width = child.offsetWidth;
			 
		});
		return max_width;
	}/* get_max_width */;


	get_cell_width = (index) => { return (isset (this.state.widths) && isset (this.state.widths [index])) ? `${this.state.widths [index]}px` :  null }


	load_widths = () => {

		let result = null;
		let lists = document.querySelectorAll (`div.tree-grid-data`);
		
		if (lists.length == 0) return setTimeout (this.load_widths);

		for (let i = 0; i < this.get_column_count (lists); i++) {
			let width = this.get_max_width (lists, i);
			if (is_null (result)) result = []
			result.push (width);
		}// for;

		this.setState ({ widths: result });

	}/* load_widths */;
	

	grid_data = (cells) => {

return cells;		

		let result = [];

		for (let i = 0; i < cells.props.children.length; i++) {

			// result.push (<div className="data-cell-thingy" key={this.create_key ()} style={{ width: this.get_cell_width (i) }} ref={React.createRef ()}>{cells.props.children [i]}</div>);

			result.push (React.cloneElement (cells.props.children [i], { 
				key: this.create_key (),
//				style: { ...cells.props.children [i].props.style, width: this.get_cell_width (i) },
			}));
			
		}// for;

		return result;

	}/* grid_data */;


	props_data = (property, data) => { return is_function (this.props [property]) ? this.props [property] (data) : null }

	header_data = data => { return this.props_data ("header", data) }
	row_data = data => { return this.props_data ("row", data) }
	footer_data = data => { return this.props_data ("footer", data) }


	/********/


	componentDidMount () { 
		this.load_widths ();
		this.load_column_counts ();
	}// componentDidMount;


	render () {

		const RowCell = props => { return <div className="one-column-table tree-grid-data">{props.children}</div> }

		return <TreeView ref={this.treeview} id="report_data" data={this.props.data} fields={this.props.fields} value={this.props.value}

			header={isset (this.props.header) ? data => { 
				let header_data = this.header_data (this.props.data);
				return <RowCell>{this.grid_data (header_data)}</RowCell> 
			} : null}

			row={isset (this.props.row) ? data => { 
				let row_data = this.row_data (data);
				return <div className="tree-grid-data" style={{
					display: "grid",
					gridTemplateColumns: `repeat(${row_data.props.children.length}, min-content)`,
				}}>{this.grid_data (row_data)}</div> 
			} : null}

			footer={isset (this.props.footer) ? data => { 
				let footer_data = this.footer_data (this.props.data);
				return <div className="tree-grid-data" style={{
					display: "grid",
//					gridTemplateColumns: `repeat(${footer_data.props.children.length}, min-content)`,
					gridTemplateColumns: `repeat(${6}, min-content)`,
				}}>{this.grid_data (footer_data)}</div>
			} : null}>

		</TreeView>

	}// render;


}// TreeGrid;
