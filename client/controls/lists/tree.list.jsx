import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import { debugging } from "client/classes/types/constants";
import { isset, is_array, is_empty, is_null, is_object, nested_value, not_array, not_function, not_null, not_object, not_set, pause, randomized } from "client/classes/common";


class TreeView extends BaseControl {


	static defaultProps = { 
		data: null,
		level: 0,
	 }// defaultProps;
	 

	render () {

		if (is_object (this.props.data)) return <ObjectTree data={this.props.data} level={this.props.level} speed={this.props.animation_speed} />
		if (is_array (this.props.data)) return <ArrayTree data={this.props.data} level={this.props.level} />

		return isset (this.props.data) ? <div>{this.props.data}</div> : null;

	}// render;

}// TreeView;


/********/


class TreeNode extends BaseControl {

	static defaultProps = {
		header: null,
		data: null,
		level: 0,
		index: 0,
	}// defaultProps;

	state = { opened: false }

	node = React.createRef ();


	/********/


	componentDidMount () { 

		let node = this.node.current;

		node.addEventListener ("transitionend", event => {
			if (event.propertyName != "height") return;
			if (node.offsetHeight == node.scrollHeight) node.style.height = null;
		});

	}// componentDidMount;


	render () {
		return <div>
			<div className="two-column-table">
				<div className="list-opener"

					style={{ 
						marginLeft: `${this.props.level}em`,
						transition: `transform ${this.animation_speed ()}ms ease-in-out`,
						transform: `rotate(${this.state.opened ? "90deg" : 0})`,
						cursor: `pointer`,
					}}
					
					onClick={() => {

						let node = this.node.current;

						if (this.state.opened) node.style.height = `${node.offsetHeight}px`;
						setTimeout (() => this.setState ({ opened: !this.state.opened }));
					
					}}>
					
					&gt;
					
				</div>
				<div>{this.props.header}</div>
			</div>
			<div ref={this.node} style={{
				height: (this.state.opened ? `${nested_value (this.node.current, "scrollHeight")}px` : 0),
				transition: `height ${this.animation_speed ()}ms ease-in-out`,
				overflow: `hidden`,
			}}><TreeView data={this.props.data} level={this.props.level + 1} /></div>
		</div>
	}// render;

}// TreeNode;


class ObjectTree extends BaseControl {


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

		return result;

	}// render;
	
}// ObjectTree;


/********/


class ArrayTree extends BaseControl {

	static defaultProps = {

		data: null,
		level: 0,

		itemFormatter: null,

	}// defaultProps;


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


	/********/


	render () {

		let result = null;

		for (let item of this.props.data) {

			let value = isset (this.props.itemFormatter) ? this.props.itemFormatter (item) : null;

			if (is_null (value)) {
				
				value = [];

				if (is_object (item)) value.push (this.object_list (item))
				else if (is_array (item)) value.push (this.array_list (item))
				else value.push (value);

			}// if;

			if (is_null (result)) result = [];

			result.push (<div style={{ 
				marginLeft: `${this.props.level}em`,
				// height: 0,
				// overflow: "hidden",
			}} key={randomized (new Date ().getTime ())}>{value}</div>);
		}// for;

		return result;

	}// render;


}/* ArrayTree */;


/********/


export default class TreeList extends BaseControl {


	static defaultProps = {
		data: null,
		nodeFields: null,
	}// defaultProps;


	constructor (props) {

		super (props);
		
		if (debugging) console.log ("Creating tree list");

		if (not_null (props.data) && not_object (props.data) && not_array (props.data)) throw "\"data\" must be of type Object or Array.";
		if (not_null (props.nodeFields) && not_array (props.nodeFields)) throw "\"nodeFields\" must be of type Array.";
		if (not_null (props.itemFormatter) && not_function (props.itemFormatter)) throw "\"itemFormatter\" must be a function.";

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


	render () { return <TreeView data={this.sorted_data (this.props.data, this.props.nodeFields)} level={0} /> }

}// TreeList;