import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import Container from "client/controls/container";

import { debugging } from "client/classes/types/constants";

import { isset, is_array, is_empty, is_function, is_null, is_object, nested_value, not_array, not_function, not_null, not_object, not_set, pause, randomized } from "client/classes/common";

import "resources/styles/controls.css";


const TreeViewContext = React.createContext (null);

const benchmark_distance = 200;


class Subtree extends BaseControl {

	static defaultProps = { 
		data: null,
		level: 0,
	}// defaultProps;

	render () {

		if (is_object (this.props.data)) return <TreeBranch data={this.props.data} level={this.props.level} speed={this.props.animation_speed} />
		if (is_array (this.props.data)) return <TreeContents data={this.props.data} level={this.props.level}  />

		return isset (this.props.data) ? this.props.data : null;

	}// render;

}// Subtree;


/********/


class TreeNode extends BaseControl {

	static defaultProps = {

		header: null,
		data: null,

		level: 0,
		index: 0,

	}// defaultProps;


	static contextType = TreeViewContext;


	state = { opened: false }

	node = React.createRef ();


	/********/
	

	componentDidMount () { 

		let node = this.node.current;

		node.addEventListener ("transitionend", event => {
			if (event.propertyName != "height") return;
			if (node.offsetHeight == node.children [0].scrollHeight) node.style.height = null;
		});

	}// componentDidMount;


	render () {

		let node_height = nested_value (this.node.current, "children", 0, "scrollHeight") ?? 0;

		return <div>
			<div className="two-column-table tree-opener">
				<div className="list-opener"

					style={{
						marginLeft: `${this.props.level}em`,
						transition: `transform ${Math.floor (this.animation_speed () / 2)}ms ease-in-out`,
						transform: `rotate(${this.state.opened ? "90deg" : 0})`,
						cursor: `pointer`,
					}}
					
					onClick={() => {
						if (this.state.opened) this.node.current.style.height = this.node.current.children [0].offsetHeight;
						setTimeout (() => this.setState ({ opened: !this.state.opened }));
					}}>
					
					<div className="arrow-glyph">
 						<Container visible={not_set (this.context.glyph)}>&gt;</Container>
						<Container visible={isset (this.context.glyph)}>{this.context.glyph}</Container>
					</div>
					
				</div>
				<div>{this.props.header}</div>
			</div>
			<div ref={this.node} className="tree-node" style={{
				height: (this.state.opened ? `${node_height}px` : 0),
				transition: `height ${Math.floor (this.animation_speed () * (node_height / benchmark_distance))}ms ease-in-out`,
				overflow: `hidden`,
			}}><Subtree data={this.props.data} level={this.props.level + 1} /></div>

		</div>
	}// render;

}// TreeNode;


class TreeBranch extends BaseControl {

	static defaultProps = {
		data: null,
		level: 0,
	}// defaultProps;


	render () {

		let result = null;
		let index = 0;
		
		for (let [key, value] of Object.entries (this.props.data)) {
			if (is_null (result)) result = [];
			result.push (<TreeNode key={Math.random () * 1000} header={key} index={index} data={value} level={this.props.level} />);
		}// for;

		return <div className="tree-branch">{result}</div>
		

	}// render;
	
}// TreeBranch;


/********/


class TreeContents extends BaseControl {


	static defaultProps = {
		data: null,
		level: 0,
	}// defaultProps;


	static contextType = TreeViewContext;


	/********/


	array_list = item => {
	
		let result = null;

		for (let value of item) {
			if (is_null (result)) result = [];
			value.push (<div key={value}>{value}</div>);
		}// for;

		return result;
	
	}/* array_list */;


	object_list = item => {

		let result = null;

		for (let [key, value] of Object.entries (item)) {
			if (is_null (result)) result = [];
			result.push (<div className="two-column-grid" key={key}>
				<div>{key}</div>
				<div>{`: ${value}`}</div>
			</div>)
		}// for;

		return result;

	}/* object_list */;


	default_format = (item, level) => {
				
		let values = [];

		let style = { 
			display: `inline-grid`,
			gridTemplateColumns: `repeat(${nested_value (this.props, "children.length") ?? 1}, min-content)`,
			columnGap: `1em`,
			marginLeft: `${level}em` 
		}// style;

		if (is_object (item)) values.push (this.object_list (item))
		else if (is_array (item)) values.push (this.array_list (item))
		else values.push (item);

		return <div style={style} key={this.create_key ("default_format")}>{values}</div>

	}// default_format;


	/********/


	render () {

		let result = null;
		let styles = { marginLeft: `${this.props.level + 1}em` }

		for (let item of this.props.data) {
			if (is_null (result)) result = [];
			result.push (is_function (this.context.format) ? this.context.format (item, this.props.level) : this.default_format (item, this.props.level));
		}// for;

		return <div className="tree-list" style={styles}>{result}</div>			
			
	}// render;


}/* TreeContents */;


/********/


export default class TreeView extends BaseControl {


	static defaultProps = {

		data: null,
		nodeFields: null,

		format: null,

		glyph: null,

	}// defaultProps;


	constructor (props) {

		super (props);
		
		if (debugging) console.log (`${props.id} TreeView created`);

		if (not_null (props.data) && not_object (props.data) && not_array (props.data)) throw "\"data\" must be of type Object or Array.";
		if (not_null (props.nodeFields) && not_array (props.nodeFields)) throw "\"nodeFields\" must be of type Array.";
		if (not_null (props.format) && not_function (props.format)) throw "\ormat\" must be a function.";

	}// constructor;


	/********/


	sorted_data (data, fields) {

		let result = null;

		if (not_array (data)) return null;
		if (not_array (fields)) return data;

		for (let item of data) {

			let next_node = null;
			
			if (not_set (result)) result = {};
			next_node = result;

			for (let index = 0; index < fields.length; index++) {

				let field = item [fields [index]];

				if (not_set (next_node [field])) next_node [field] = (index == (fields.length - 1)) ? [] : {};
				next_node = next_node [field];

			}// for;

			delete item.year;
			delete item.month;
			delete item.day;

			next_node.push (item);

		}// for;

		return result;

	}// sorted_data;


	/********/


	shouldComponentUpdate (props) {
		if (props != this.props) return true;
		return true;
	}
	
	
	render () { 
		return <TreeViewContext.Provider 

			value={{
				format: this.props.format,
				glyph: this.props.glyph,
			}}>

			<Subtree level={0} data={this.sorted_data (this.props.data, this.props.nodeFields)} />

		</TreeViewContext.Provider>
	}// render;

	
}// TreeView;