import React from "react";

import BaseControl	from "client/controls/abstract/base.control";
import Container	from "client/controls/container";

import { isset, is_empty, is_null, nested_value, notify, not_set } from "client/classes/common";
import { debugging, space, underscore } from "client/classes/types/constants";


const benchmark_distance = 200;


const data_length = (data) => { return 8 }//return isset (data) ? Object.keys (data [0]).length : 0 }


const branch_style = { 
	marginLeft: "1.5em",
//					transition: `height ${speed}ms ease-in-out`,
	transition: `height 1000ms ease-in-out`,
	overflow: "hidden",
}// branch_style;


class TreeItem extends BaseControl {


	tree_branch = React.createRef ();


	state = { open: false }


	static defaultProps = {
		data: null,
		fields: null,
		fieldValue: null,
	}// defaultProps;



	// componentDidMount () {

	// 	let node = this.tree_branch.current;

	// 	node.addEventListener ("transitionend", event => {
	// 		if (event.propertyName != "height") return;
	// 		if (node.clientHeight == node.children [0].scrollHeight) node.style.height = null;
	// 		// this.setState ({ open: !this.state.open });
	// 	});

	// }// componentDidMount;


	render () {

		// let field_data = null;
		let node_height = nested_value (this.tree_branch.current, "children", 0, "scrollHeight") ?? 0;
		// let speed = 500;//Math.floor (this.animation_speed () * (node_height / benchmark_distance));


		// this.props.data.forEach (item => {

		// 	let new_item = null;

		// 	if (item [this.props.fields [0]] != this.props.fieldValue) return;

		// 	Object.keys (item).forEach (key => {
		// 		if (this.props.fields [0].includes (key)) return;
		// 		if (is_null (new_item)) new_item = {};
		// 		new_item [key] = item [key];
		// 	});

		// 	if (is_null (field_data)) field_data = [];
		// 	field_data.push (new_item);

		// });

		
		return <Container key={this.create_key ()} inline={false}>
{/* 
			<div style={{
				marginLeft: `${this.props.level}em`,
				cursor: `pointer`,
			}}

			onClick={event => {
				

				// this.tree_branch.current.style.height = `${this.tree_branch.current.children [0].scrollHeight}px`;
				// event.preventDefault ();

				this.setState ({ open: !this.state.open });
				
//				, () => {

// let node_height = nested_value (this.tree_branch.current, "children", 0, "scrollHeight") ?? 0;
				
// notify (`open: ${this.state.open}`, `height: ${this.tree_branch.current.style.height}`, `scroll: ${this.tree_branch.current.children [0].scrollHeight}px`, `node height: ${node_height}`)

// }
// 				);				

				// this.tree_branch.current.style.height = this.state.open ? `${node_height}px` : "0px";

//				document.getElementById ("test_output").innerHTML = `height: ${this.tree_branch.current.style.height}`



				}}>
				<div id={`${this.props.fieldValue.toString ().replace (space, underscore).toLowerCase ()}_glyph`}>

					<div style={{
						transition: `transform 500ms ease-in-out`,
						transform: `rotate(${this.state.open ? "90deg" : 0})`,
					}} className="arrow-glyph"><div className="tree-glyph" /></div>

					{this.props.fieldValue}

				</div>			
			</div>
*/}

			<button onClick={() => this.setState ({ open: !this.state.open })}>Doit</button>

			<div id={`${this.props.fieldValue.toString ().replace (space, underscore).toLowerCase ()}_branch`} ref={this.tree_branch}
				style={{ ...branch_style, 
					height: (this.state.open ? `${node_height}px` : 0),


					
				}}>


<div style={{ 
	width: "200px",
	height: "100px",
}} />

				{/* <div className="tree-node"><TreeBranch data={field_data} fields={this.props.fields.slice (1)} depth={this.props.depth + 1} dataLength={this.props.dataLength} /></div> */}
			</div>

		</Container>

	}// render;

}// TreeItem;


/********/


class TreeBranch extends BaseControl {


	static defaultProps = {
		data: null,
		fields: null,
		standard: null,
		dataLength: 0,
		depth: 1,
	}// defaultProps;


	/********/


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
			result.push (<div key={this.create_key ()}>{Object.values (item)}</div>);
		});
		return is_empty (result) ? null : result;
	}// data_list;


	/********/


	render () {

let value = "2022";		

		return <TreeItem key={this.create_key ()} data={this.props.data} fields={this.props.fields} fieldValue={value} />


		// if (is_empty (this.props.data)) return null;
		// if (is_empty (this.props.fields)) return this.data_list ();

		// let result = null;
		// let field_values = this.get_field_values (this.props.data, this.props.fields [0]);

		// field_values.forEach (value => {
		// 	if (is_null (result)) result = [];
		// 	result.push (
			
		// 	<TreeItem key={this.create_key ()} data={this.props.data} fields={this.props.fields} fieldValue={value} />
			
			
		// 	);
		// });

		// return result;

	}// render;


}// TreeBranch;


/********/


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


	/******** /


	get_column_count = lists => {
		let count = 0;
		lists.forEach (item => {if (item.children.length > count) count = item.children.length} );
		return count;
	}/* get_column_count * /;

	get_max_width = (lists, index) => {
		let max_width = 0;
		lists.forEach (item => { if (isset (item.children [index]) && (item.children [index].offsetWidth > max_width)) max_width = item.children [index].offsetWidth });
		return max_width;
	}/* get_max_width * /;


	standardize = () => {

return;		

		let lists = document.querySelectorAll (`#${this.props.id} div.${this.props.standard}`);

		if (lists.length == 0) return setTimeout (this.standardize);

		for (let i = 0; i < this.get_column_count (lists); i++) {
			let width = this.get_max_width (lists,i);
			lists.forEach (item => { if (isset (item.children [i])) item.children [i].style.width = `${width}px` });
		}// for;

	}/* standardize */;


	/********/


//	componentDidUpdate () { this.standardize () }


	render () {

		let length = data_length (this.props.data);

		return <Container>
		
		<div id={this.props.id} className={`treeview outlined`}>
			<TreeBranch data={this.props.data} fields={this.props.fields} dataLength={length} />
		</div>
{/* 
<button onClick={() => this.standardize (document.querySelectorAll (`#${this.props.id} div.${this.props.standard}`))}>Standardize</button>
*/}

		</Container>

	}// render;


}// TreeView;