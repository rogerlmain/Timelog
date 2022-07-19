import React from "react";

import BaseControl	from "client/controls/abstract/base.control";
import Container	from "client/controls/container";

import { isset, is_empty, is_null, not_set } from "client/classes/common";
import { debugging } from "client/classes/types/constants";


const data_length = (data) => { return 8 }//return isset (data) ? Object.keys (data [0]).length : 0 }


class TreeBranch extends BaseControl {


	static defaultProps = {
		data: null,
		fields: null,
		standard: null,
		dataLength: 0,
		depth: 1,
	}// defaultProps;


	get_field_values = (data, field) => {
		let result = null;
		data.forEach (item => {
			if (is_null (result)) result = new Set ();
			result.add (item [field]);
		});
		return Array.from (result).sort ();
	}// get_field_values;


	data_list = () => {
		let result = null;
		this.props.data.forEach (item => {
			if (is_null (result)) result = [];
			result.push (<Container key={this.create_key ()} visible={this.props.depth > 1}><div style={{ gridColumn: `1 / span ${this.props.depth - 1}` }} /></Container>);
			Object.keys (item).forEach (key => result.push (<div key={this.create_key ()} className="item-cell">{item [key]}</div>))
		});
		return is_empty (result) ? null : result;
	}// data_list;


	/********/


	render () {

		if (is_empty (this.props.data)) return null;
		if (is_empty (this.props.fields)) return this.data_list ();

		let result = null;
		let field_values = this.get_field_values (this.props.data, this.props.fields [0]);

		field_values.forEach (value => {

			let field_data = null;

			this.props.data.forEach (item => {
				if (item [this.props.fields [0]] != value) return;
				if (is_null (field_data)) field_data = [];
				delete item [this.props.fields [0]];
				field_data.push (item);
			});

			if (is_null (result)) result = [];

			result.push (<Container key={this.create_key ()} inline={false}>

				<Container visible={this.props.depth > 1}><div style={{ gridColumn: `1 / span ${this.props.depth - 1}` }} /></Container>
				<div className="arrow-glyph glyph-cell"><div className="tree-glyph" /></div>
				<div style={{ gridColumn: `${this.props.depth + 1} / span ${this.props.dataLength - this.props.depth}` }}>{value}</div>

				<div style={{ gridColumn: `${this.props.depth + 1} / span ${this.props.dataLength - this.props.depth}` }}>
					<TreeBranch data={field_data} fields={this.props.fields.slice (1)} depth={this.props.depth + 1} dataLength={this.props.dataLength} />
				</div>

			</Container>);
		});

		return result;

	}// tree_branch;


}// TreeBranch;



export default class TreeView extends BaseControl {


	static defaultProps = {
		data: null,
		fields: null,
	}// defaultProps;


	constructor (props) {
		super (props);
		if (debugging) console.log (`${props.id} TreeView created`);
		if (not_set (props.id)) throw "TreeView requires and ID";
	}// constructor;


	/********/


	get_column_count = lists => {
		let count = 0;
		lists.forEach (item => {if (item.children.length > count) count = item.children.length} );
		return count;
	}/* get_column_count */;

	get_max_width = (lists, index) => {
		let max_width = 0;
		lists.forEach (item => { if (isset (item.children [index]) && (item.children [index].offsetWidth > max_width)) max_width = item.children [index].offsetWidth });
		return max_width;
	}/* get_max_width */;


	standardize = () => {

		let lists = document.querySelectorAll (`#${this.props.id} div.${this.props.standard}`);

		if (lists.length == 0) return setTimeout (this.standardize);

		for (let i = 0; i < this.get_column_count (lists); i++) {
			let width = this.get_max_width (lists,i);
			lists.forEach (item => { if (isset (item.children [i])) item.children [i].style.width = `${width}px` });
		}// for;

	}/* standardize */;


	/********/


	componentDidMount () {
		if (isset (this.props.standard)) this.standardize ();
	}// componentDidMount;
	

	render () {

		let length = data_length (this.props.data);

		return <Container>
		
		
		<div id={this.props.id} className={`${this.props.id}_treeview outlined`} style={{ 
			display: "grid",
			gridTemplateColumns: `repeat(${length}, min-content)`,
		}}><TreeBranch data={this.props.data} fields={this.props.fields} dataLength={length} /></div>

<button onClick={() => this.standardize (document.querySelectorAll (`#${this.props.id} div.${this.props.standard}`))}>Standardize</button>

</Container>

	}// render;


}// TreeView;