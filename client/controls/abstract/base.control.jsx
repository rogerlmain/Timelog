import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";
import ReactDOMServer, { renderToString } from "react-dom/server";

import Container from "client/controls/container";

import { default_settings } from "classes/types/constants";
import { get_keys, is_array, is_null, jsonify, not_array } from "classes/common";

//import "classes/types/prototypes";
import SettingsStorage from "client/classes/storage/settings.storage";


export default class BaseControl extends React.Component {

	constructor (props, state = {}) {
		super (props);
		this.state = state;
	}// constructor;


	/********/

	animation_speed = () => { return this.props.speed ?? SettingsStorage.animation_speed () ?? default_settings.animation_speed }
	children = props => { return is_array (props.children) ? props.children : [props.children] }
	compare_elements = (first_element, second_element) => { return ReactDOMServer.renderToString (first_element) == ReactDOMServer.renderToString (second_element) }
	context_item = (name) => { return common.isset (this.context) ? this.context [name] : null }
	current_entry = ()  => { return JSON.parse (localStorage.getItem ("current_entry")) }

	// Like forceUpdate except calls shouldComponentUpdate
	forceRefresh = () => { this.setState (this.state) }


	// Like setState but doesn't update if states match 
	// and returns a promise
	updateState = new_state => {
		return new Promise ((resolve, reject) => {
			try {
				if (jsonify (this.state).matches (jsonify (new_state))) resolve (true);
				this.setState (new_state, () => resolve (true));
			} catch (except) { reject (except) }
		});
	}// updateState;


	filtered_properties = (...used_properties) => {
		let properties = {...this.props};
		used_properties.forEach (property => delete properties [property]);
		return properties;
	}// filtered_properties;


	/********/


	children () {
		return common.isset (this.props.children) ? this.props.children : <div style={{ 
			width: "1px",
			height: "1px",
			backgroundColor: "transparent"
		}} />;
	}// children;


	controlStyleClass () {
		let result = {};
		if (common.isset (this.props.className)) result.className = this.props.className;
		if (common.isset (this.props.style)) result.style = this.props.style;
		return result;
	}// controlStyleClass;


	dom (name, property = null) {
		let element = document.getElementById (name);
		if (common.is_null (property)) return element;
		if (common.is_null (element)) return null;
		return element [property];
	}// dom;


	execute (method, ...parameters) {
		return new Promise ((resolve, reject) => {
			try {
				if (common.is_function (method)) resolve (method (...parameters));
				resolve ();
			} catch (error) { 
				alert (error);
				reject (error);
			};
		});
	}// execute;


	id_badge (stub = null) {
		if (common.is_null (stub)) stub = this.constructor.name;
		return this.props.id ?? stub + constants.underscore + Date.now ();
	}// id_badge;


	inherited_properties () {

		let properties = null;

		for (let key of get_keys (this.props)) {
			if (key in this.constructor.defaultProps) continue;
			if (common.is_null (properties)) properties = {}
			properties [key] = this.props [key];
		}// for;
		
		return properties;		

	}// inherited_properties;


	react_element (object) {

		let item = null;

		if (React.isValidElement (object)) return true;

		if (object instanceof Array) {
			for (item of object) {
				if (common.is_null (item) || (item === false)) continue;
				if (!this.react_element (item)) return false;
			}// for;
			return true;
		}// if;

		return false;

	}// react_element;


	object_string (object) {
		let result = null;
		if (typeof object == "string") return object;
		try {
			result = this.react_element (object) ? renderToString (object) : JSON.stringify (object);
		} catch (except) {
			let message = `Error on object_string: ${except}`;
			if (constants.globals.debugging) alert (message);
			console.log (message);
		}// try;
		return result;
	}// object_string;
	
	
	same_element (first_element, second_element, deep) {

		let first_string = ReactDOMServer.renderToString (first_element);
		let second_string = ReactDOMServer.renderToString (second_element);

		if (deep !== false) deep = true;

		switch (deep) {
			case true: return first_string.equals (second_string);
			default: return first_string.substring (0, first_string.indexOf (">") + 1).equals (second_string.substring (0, second_string.indexOf (">") + 1));
		}// switch;

	}// same_element;


	state_size (control = null) {
		if (common.is_null (control)) control = this;
		return {
			width: control.state.width,
			height: control.state.height
		}// return;
	}// state_size;


	state_equals (state, value) {
		return (common.isset (value) && value.equals (this.state [state]));
	}// state_equals;


	state_object_field (state, field) {
		let object = this.state [state];
		if (common.is_null (object)) return null;
		return object [field] ?? constants.empty;
	}// state_object_field;


	/********/


//	id = null;


	add_class (value, class_name) {
		let classes = value.split (space);
		for (let i = 0; i < classes.length; i++) {
			if (classes [i].equals (class_name)) return; // already exists;
		}// for;
		classes.push (class_name);
		return classes.join (space);
	}// add_class;


	remove_class (value, class_name) {
		let classes = value.split (space);
		for (let i = 0; i < classes.length; i++) {
			if (classes [i].equals (class_name)) {
				classes.remove (i);
				break;
			}// if;
		}// for;
		classes.push (class_name);
		return classes.join (space);
	}// remove_class;


	get_width () {
		return common.isset (this.props.domControl) ? this.props.domControl.clientWidth : 0;
	}// get_width;


	get_height () {
		return common.isset (this.props.domControl) ? this.props.domControl.clientHeight : 0;
	}// get_height;


	set_visibility (property_value, comparison_value = null) {
		let comparison = common.is_null (comparison_value) ? (property_value == true) : (property_value == comparison_value);
		return comparison ? null : { display:  "none" }
	}// set_visibility;


	signed_in () {
		return common.isset (localStorage.getItem ("credentials"));
	}// signed_in;


	signed_out () {
		return !this.signed_in ();
	}// signed_out;


	mapping (array, callback) {
		if (common.is_null (array)) return;
		return array.map (callback);
	}// mapping;


	componentDidUpdate () {
		this.execute (this.props.afterRender);
	}// componentDidUpdate;


	render () { return this.props.children }


	/**** Debugging ****/


	// Used in conjunction with a breakpoint to examine a value
	// without having to create an anonymous function
	return_value (value) {
		return value;
	}// return_value;


	show_states (cascade) {

		let append = (object, value) => { return `${common.is_null (object) ? constants.blank : object}${value}`; }

		let control_states = null;
		let child_states = null;

		let result = null;

		if (common.isset (this.state)) {
			get_keys (this.state).forEach (key => {
				if (common.is_null (this.state [key])) return;
				control_states = append (control_states, `\n${key}: ${this.state [key]}`);
			});
		}// if;

		if (common.not_null (control_states)) result = append (result, `${this.props.id}: <${this.constructor.name}>\n${control_states}`);
		if (common.not_null (child_states)) result = append (result, `\n\n${child_states}`);

		return result;

	}// show_states;


	validate_ids (props, parent_only = false) {

		let control = this.constructor.name;
		let children = props.children;

		if (common.is_null (props.id)) throw `${control} requires an ID`;
		
		if (parent_only) return true;
		if (common.not_set (children)) return true;

		if (!Array.isArray (children)) children = [children];
		children.map (child => { if (common.isset (child.props) && common.not_set (child.props.id)) throw `${control} (${props.id}) child (${child.type.name}) must have a unique ID` });

	}// validate_ids;


	/**** React Component Methods ****/


	shouldComponentUpdate (next_props, next_state, next_context) {
		if (jsonify (this.props) != jsonify (next_props)) return true;
		if (jsonify (this.state) != jsonify (next_state)) return true;
		if (jsonify (this.context) != jsonify (next_context)) return true;
		return false;
	}// shouldComponentUpdate;


}// BaseControl;
