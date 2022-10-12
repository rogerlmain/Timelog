import * as constants from "client/classes/types/constants";
import * as common from "client/classes/common";

import React from "react";
import ReactDOMServer from "react-dom/server";

import ActivityLog from "client/classes/activity.log";
import SettingsStorage from "client/classes/storage/settings.storage";

import { default_settings } from "client/classes/types/constants";
import { isset, is_null, get_keys, is_array, jsonify } from "client/classes/common";


const random_factor = 1000;


export default class BaseControl extends React.Component {


	constructor (props, state = {}) {
		super (props);
		this.state = state;
	}// constructor;


	/********/

	
	animation_speed = () => { return this.props.speed ?? SettingsStorage.animation_speed () ?? default_settings.animation_speed }
	transition_style = (property) => { return `${property} ${SettingsStorage.animation_speed ()}ms ease-in-out` }

	context_item = (name) => { return isset (this.context) ? this.context [name] : null }
	current_entry = ()  => { return JSON.parse (localStorage.getItem ("current_entry")) }

	same_elements (first_element, second_element) { return ReactDOMServer.renderToString (first_element).equals (ReactDOMServer.renderToString (second_element)) };
	same_objects (first_element, second_element) { return (jsonify (first_element) == jsonify (second_element)) }

	same_parents (first_element, second_element) { 

		const lead_tag = element => {

			let dom_string = ReactDOMServer.renderToString (element);
			let dom_element = new DOMParser ().parseFromString (dom_string, "text/html")?.body?.children [0];

			let result = isset (dom_element) ? (dom_element.innerHTML ? dom_element.outerHTML.slice (0, dom_element.outerHTML.indexOf (dom_element.innerHTML)) : dom_element.outerHTML) : null;

			return result;

		}/* lead_tag */;

		return lead_tag (first_element) == lead_tag (second_element);

	}// same_parents;


	different_elements (first_element, second_element) { return !this.same_elements (first_element, second_element) }
	different_objects  (first_element, second_element) { return !this.same_objects (first_element, second_element) }
	different_parents (first_element, second_element) { return !this.same_parents (first_element, second_element) }


	// Like forceUpdate except calls shouldComponentUpdate
	forceRefresh = (callback = null) => { 
		
//		let children = Array.arrayify (this.props.children);

		this.setState (this.state, callback);
//		if (children) children.forEach (child => child?.forceRefresh ());
	
	}


	renderState = (new_state, callback) => this.setState (new_state, () => this.forceUpdate (callback));


	// Like setState but doesn't update if states match 
	updateState = (new_state, callback) => { 

		let update_required = false;

		for (let key of Object.keys (new_state)) {

			let state_item = this.state [key];
			let new_item = new_state [key];

			if (jsonify (state_item) != jsonify (new_item)) {
				update_required = true;
				break;
			}// if;

		}// for;

		if (update_required) this.setState (new_state, callback);
	}// update_state;


	filtered_properties = (...used_properties) => {
		let properties = {...this.props};
		used_properties.forEach (property => delete properties [property]);
		return properties;
	}// filtered_properties;


	create_key = prefix => { return `${prefix}_${(new Date ().getTime () * random_factor) + (Math.random () * random_factor)}` }


	/********/


	children () {
		return isset (this.props.children) ? this.props.children : <div style={{ 
			width: "1px",
			height: "1px",
			backgroundColor: "transparent"
		}} />;
	}// children;


	controlStyleClass () {
		let result = {};
		if (isset (this.props.className)) result.className = this.props.className;
		if (isset (this.props.style)) result.style = this.props.style;
		return result;
	}// controlStyleClass;


	dom (name, property = null) {
		let element = document.getElementById (name);
		if (is_null (property)) return element;
		if (is_null (element)) return null;
		return element [property];
	}// dom;


	execute (method, ...parameters) {
		return new Promise ((resolve, reject) => {
			try {
				if (common.is_function (method)) return resolve (method (...parameters));
				resolve ();
			} catch (error) { 
				ActivityLog.log_error (error);
				reject (error);
			};
		});
	}// execute;


	run (method, ...parameters) { return (common.is_function (method)) ? method (...parameters) : null }


	get_id (control) {
		if (is_null (control) || is_null (control?.props?.id)) return `control_${Date.now ()}`;
		return `${control.props.id}_${Date.now ()}`;
	}// get_id;


	inherited_properties () {

		let properties = null;

		for (let key of get_keys (this.props)) {
			if (key in this.constructor.defaultProps) continue;
			if (is_null (properties)) properties = {}
			properties [key] = this.props [key];
		}// for;
		
		return properties;		

	}// inherited_properties;


	react_element (object) {

		let item = null;

		if (React.isValidElement (object)) return true;

		if (object instanceof Array) {
			for (item of object) {
				if (is_null (item) || (item === false)) continue;
				if (!this.react_element (item)) return false;
			}// for;
			return true;
		}// if;

		return false;

	}// react_element;


	state_equals (state, value) {
		return (isset (value) && value.equals (this.state [state]));
	}// state_equals;


	state_object_field (state, field) {
		let object = this.state [state];
		if (is_null (object)) return null;
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
		return isset (this.props.domControl) ? this.props.domControl.clientWidth : 0;
	}// get_width;


	get_height () {
		return isset (this.props.domControl) ? this.props.domControl.clientHeight : 0;
	}// get_height;


	set_visibility (property_value, comparison_value = null) {
		let comparison = is_null (comparison_value) ? (property_value == true) : (property_value == comparison_value);
		return comparison ? null : { display:  "none" }
	}// set_visibility;


	signed_in () {
		return isset (localStorage.getItem ("credentials"));
	}// signed_in;


	signed_out () {
		return !this.signed_in ();
	}// signed_out;


	mapping (array, callback) {
		if (is_null (array)) return;
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

		let append = (object, value) => { return `${is_null (object) ? constants.blank : object}${value}`; }

		let control_states = null;
		let child_states = null;

		let result = null;

		if (isset (this.state)) {
			get_keys (this.state).forEach (key => {
				if (is_null (this.state [key])) return;
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

		if (is_null (props.id)) throw `${control} requires an ID`;
		
		if (parent_only) return true;
		if (common.not_set (children)) return true;

		if (Array.arrayify (children)) children = [children];
		children.map (child => { if (isset (child.props) && common.not_set (child.props.id)) throw `${control} (${props.id}) child (${child.type.name}) must have a unique ID` });

	}// validate_ids;


	/**** React Component Methods ****


	shouldComponentUpdate (new_props, new_state, new_context) {

		let xx = jsonify (new_props);
		let yx = jsonify (new_state);
		let zx = jsonify (new_context);
		let ax = jsonify (this.props);
		let bx = jsonify (this.state);
		let cx = jsonify (this.context);


		if (jsonify (this.props) != jsonify (new_props)) return true;
		if (jsonify (this.state) != jsonify (new_state)) return true;
		if (jsonify (this.context) != jsonify (new_context)) return true;
		return false;
	}// shouldComponentUpdate;

	
	/********/
	

}// BaseControl;
