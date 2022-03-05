import React from "react";
import ReactDOMServer, { renderToString } from "react-dom/server";

import { globals } from "types/globals";
import { isset, is_null, is_function, not_null } from "classes/common";

import { empty, blank, underscore } from "types/constants";

import "types/prototypes";


export default class BaseControl extends React.Component {

	compare_elements = (first_element, second_element) => { return ReactDOMServer.renderToString (first_element) == ReactDOMServer.renderToString (second_element) }

	current_entry = ()  => { return JSON.parse (localStorage.getItem ("current_entry")) }


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
				if (is_function (method)) resolve (method (...parameters));
				resolve ();
			} catch (error) { reject (error) };
		});
	}// execute;


	// Like forceUpdate except calls shouldComponentUpdate
	forceRefresh = () => { this.setState (this.state) }


	id_badge (stub = null) {
		if (is_null (stub)) stub = this.constructor.name;
		return this.props.id ?? stub + underscore + Date.now ();
	}// id_badge;


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


	object_string (object) {
		let result = null;
		if (typeof object == "string") return object;
		try {
			result = this.react_element (object) ? renderToString (object) : JSON.stringify (object);
		} catch (except) {
			let message = `Error on object_string: ${except}`;
			if (globals.debugging) alert (message);
			console.log (message);
		}// try;
		return result;
	}// object_string;
	
	
	same_element (first_element, second_element) {
		let first_string = ReactDOMServer.renderToString (first_element);
		let second_string = ReactDOMServer.renderToString (second_element);
		return first_string.matches (second_string);
	}// same_element;


	select_options (list, id_field, text_field) {
		if (is_null (list)) return null;
		let result = list.map ((item) => {
			return <option value={item [id_field]} key={item [id_field]}>{item [text_field]}</option>
		});
		return result;
	}// select_options;


	state_size (control = null) {
		if (is_null (control)) control = this;
		return {
			width: control.state.width,
			height: control.state.height
		}// return;
	}// state_size;


	state_equals (state, value) {
		return (isset (value) && value.matches (this.state [state]));
	}// state_equals;


	state_object_field (state, field) {
		let object = this.state [state];
		if (is_null (object)) return null;
		return object [field] ?? empty;
	}// state_object_field;


	/********/


//	id = null;


	add_class (value, class_name) {
		let classes = value.split (space);
		for (let i = 0; i < classes.length; i++) {
			if (classes [i].matches (class_name)) return; // already exists;
		}// for;
		classes.push (class_name);
		return classes.join (space);
	}// add_class;


	remove_class (value, class_name) {
		let classes = value.split (space);
		for (let i = 0; i < classes.length; i++) {
			if (classes [i].matches (class_name)) {
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


	load_logging_status () {
		if (this.logged_in ()) return;

		let data = new FormData ();
		data.append ("action", "log_status");

		fetch ("/logging", {
			body: data,
			method: "post"
		}).then (response => response.json ()).then ((data) => {
			common.set_cookie ("current_entry", JSON.stringify (data [0]));
		});
	}// load_logging_status;


	logged_in (callback = null) {
		return not_null (common.get_cookie ("current_entry"));
	}// logged_in;


	logged_out () {
		return !this.logged_in ();
	}// logged_out;


	mapping (array, callback) {
		if (is_null (array)) return;
		return array.map (callback);
	}// mapping;


	componentDidUpdate () {
		this.execute (this.props.afterRender);
	}// componentDidUpdate;


	refresh () { super.setState (this.state) }


	render () { return this.props.children }


	setState (values, callback = null) {

		let state_list = null;

		let string_value = (field) => {
			switch (typeof field) {
				case "object": return this.object_string (field);
				default: return (isset (field) ? field.toString () : empty); 
			}// switch;
		}// string_value;

		if (is_null (values)) return super.setState (this.state, callback);

		Object.keys (values).forEach (key => {
			if (string_value (this.state [key]).matches (string_value (values [key]))) return null;
			if (is_null (state_list)) state_list = {}
			state_list [key] = values [key];
		});

		if (isset (state_list)) super.setState (state_list, callback);

		return null; // for use with getSnapshotBeforeUpdate which requires a return value

	}// setState;


	/**** Debugging ****/

	// debug_value (value = null) {
	// 	if (!constants.debugging) return null;
	// 	if (common.not_null (value)) return value;
	// 	return Math.random ().toString (36).substr (2);
	// }// debug_value;


	// Used in conjunction with a breakpoint to examine a value
	// without having to create an anonymous function
		return_value (value) {
		return value;
	}// return_value;


	show_states (cascade) {

		let append = (object, value) => { return `${is_null (object) ? blank : object}${value}`; }

		let control_states = null;
		let child_states = null;

		let result = null;

		if (isset (this.state)) {
			Object.keys (this.state).forEach (key => {
				if (is_null (this.state [key])) return;
				control_states = append (control_states, `\n${key}: ${this.state [key]}`);
			});
		}// if;

		if (not_null (control_states)) result = append (result, `${this.props.id}: <${this.constructor.name}>\n${control_states}`);
		if (not_null (child_states)) result = append (result, `\n\n${child_states}`);

		return result;

	}// show_states;


	/********/


	constructor (props, state = {}) {
		super (props);
		this.state = state;
	}// constructor;


}// BaseControl;




