import "types/prototypes";

import * as constants from "types/constants";
import * as common from "classes/common";

import React from "react";

import ReactDOMServer, { renderToString } from "react-dom/server";

import { AccountData, EntryData } from "types/datatypes";
import { globals } from "types/globals";
import { underscore } from "types/constants";


export interface DefaultProps {

	id?: string;

	style?: React.CSSProperties;
	className?: string;

	disabled?: boolean;

	parent?: any;

	afterRender?: Function;			// synonym for onComponentUpdate
	onComponentUpdate?: Function;	// synonym for afterRender

	domControl?: HTMLElement;

	children?: any;

}/* DefaultProps */;


export interface DefaultState {}


export default abstract class BaseControl<iprops extends DefaultProps = DefaultProps, istate extends DefaultState = DefaultState> extends React.Component<iprops, istate> {

	private getState (name: string, fieldname: string) {
		let object = this.state [name];
		if (common.is_null (object)) return null;
		return object [fieldname];
	}// getState;


	/********/


	protected children () {
		return common.isset (this.props.children) ? this.props.children : <div style={{ 
			width: "1px",
			height: "1px",
			backgroundColor: "transparent"
		}} />;
	}// children;


	protected compare_elements (first_element: React.ReactElement, second_element: React.ReactElement) {
		return ReactDOMServer.renderToString (first_element) == ReactDOMServer.renderToString (second_element);
	}// compare_elements;


	protected controlStyleClass (): any {
		let result: any = {};
		if (common.isset (this.props.className)) result.className = this.props.className;
		if (common.isset (this.props.style)) result.style = this.props.style;
		return result;
	}// controlStyleClass;


	protected current_account (): AccountData {
		if (common.not_set (globals.current_account)) globals.current_account = AccountData.parse (common.get_cookie ("current_account"));
		return globals.current_account;
	}// current_account;


	protected current_entry (): EntryData {
		return EntryData.parse (common.get_cookie ("current_entry"));
	}// current_entry;


	protected dom (name: string, property: string = null): HTMLFormElement {
		let element = document.getElementById (name) as HTMLFormElement;
		if (common.is_null (property)) return element;
		if (common.is_null (element)) return null;
		return element [property];
	}// dom;


	protected execute (method: Function, ...parameters: any) {
		return new Promise ((resolve, reject) => {
			try {
				if (common.is_function (method)) method (...parameters);
				resolve (null);
			} catch (error) { reject (error) };
		});
	}// execute;


	protected id_badge (stub: any = null) {
		if (common.is_null (stub)) stub = this.constructor.name;
		return this.props.id ?? stub + underscore + Date.now ();
	}// id_badge;


	// Deprecated - use same_element instead

	// protected is_updated (...objects: any): boolean {
	// 	for (let i = 0; i < objects.length; i++) {
	// 		if (common.not_set (objects [i])) return false;
	// 		if (i == 0) continue;
	// 		switch (typeof objects [i]) {
	// 			case "object": if (!this.object_string (objects [i]).matches (this.object_string (objects [i - 1]))) return true; break;
	// 			default: if (objects [i] != objects [i-1]) return true;
	// 		}// switch;
	// 	}// for;
	// 	return false;
	// }// is_updated;


	// Deprecated - use same_element instead

	// protected changed (...objects: any): boolean {
	// 	for (let i = 0; i < objects.length; i++) {
	// 		if (i == 0) continue;
	// 		if (common.is_null (objects [i]) != common.is_null (objects [i - 1])) return true;
	// 		return this.is_updated (...objects);
	// 		// switch (typeof objects [i]) {
	// 		// 	case "object": if (!this.object_string (objects [i]).matches (this.object_string (objects [i - 1]))) return true; break;
	// 		// 	default: if (objects [i] != objects [i-1]) return true;
	// 		// }// switch;
	// 	}// for;
	// 	return false;
	// }// changed;


	protected react_element (object: any) {

		let item: any = null;

		if (React.isValidElement (object)) return true;

		if (object instanceof Array) {
			for (item of object) {
				if (common.is_null (item)) continue;
				if (!React.isValidElement (item)) return false;
			}// for;
			return true;
		}// if;

		return false;

	}// react_element;


	protected object_string (object: any): string {
		let result: string = null;
		if (typeof object == "string") return object;
		try {
			result = renderToString (object);
		} catch (except) {
			try {
				result = JSON.stringify (object);
			} catch (except) {}
		}// try;
		return result;
	}// object_string;
	
	
	protected same_element (first_element: React.ReactElement, second_element: React.ReactElement) {
		let first_string = ReactDOMServer.renderToString (first_element);
		let second_string = ReactDOMServer.renderToString (second_element);
		return first_string.matches (second_string);
	}// same_element;


	protected select_options (list: any, id_field: string, text_field: string) {
		if (common.is_null (list)) return null;
		let result = list.map ((item: any) => {
			return <option value={item [id_field]} key={item [id_field]}>{item [text_field]}</option>
		});
		return result;
	}// select_options;


	protected state_size (control: any = null) {
		if (common.is_null (control)) control = this;
		return {
			width: control.state.width,
			height: control.state.height
		}// return;
	}// state_size;


	protected state_value (state: string, field: string) {
		return this.getState (state, field) ?? constants.empty;
	}// state_value;


	/********/


//	public id: string = null;


	public add_class (value: string, class_name: string) {
		let classes = value.split (constants.space);
		for (let i = 0; i < classes.length; i++) {
			if (classes [i].matches (class_name)) return; // already exists;
		}// for;
		classes.push (class_name);
		return classes.join (constants.space);
	}// add_class;


	public remove_class (value: string, class_name: string) {
		let classes = value.split (constants.space);
		for (let i = 0; i < classes.length; i++) {
			if (classes [i].matches (class_name)) {
				classes.remove (i);
				break;
			}// if;
		}// for;
		classes.push (class_name);
		return classes.join (constants.space);
	}// remove_class;


	public get_width () {
		return common.isset (this.props.domControl) ? this.props.domControl.clientWidth : 0;
	}// get_width;


	public get_height () {
		return common.isset (this.props.domControl) ? this.props.domControl.clientHeight : 0;
	}// get_height;


	public set_visibility (property_value: any, comparison_value: any = null) {
		let comparison = common.is_null (comparison_value) ? (property_value == true) : (property_value == comparison_value);
		return comparison ? null : { display:  "none" }
	}// set_visibility;


	public signed_in () {
		return common.not_null (common.get_cookie ("current_account"));
	}// signed_in;


	public signed_out () {
		return !this.signed_in ();
	}// signed_out;


	public load_logging_status () {
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


	public logged_in (callback: Function = null) {
		return common.not_null (common.get_cookie ("current_entry"));
	}// logged_in;


	public logged_out () {
		return !this.logged_in ();
	}// logged_out;


	public mapping (array: Array<any>, callback: any) {
		if (common.is_null (array)) return;
		return array.map (callback);
	}// mapping;


	public componentDidUpdate () {
		this.execute (this.props.afterRender);
	}// componentDidUpdate;


	public refresh () { super.setState (this.state) }


	public render () { return this.props.children }


	public setState (values: any, callback: any = null) {

		let state_list: any = null;

		let string_value = (field: any) => {
			switch (typeof field) {
				case "object": return this.object_string (field);
				default: return (common.isset (field) ? field.toString () : constants.empty); 
			}// switch;
		}// string_value;

		if (common.is_null (values)) return super.setState (this.state, callback);

		Object.keys (values).forEach (key => {
			if (string_value (this.state [key]).matches (string_value (values [key]))) return null;
			if (common.is_null (state_list)) state_list = {}
			state_list [key] = values [key];
		});

		if (common.isset (state_list)) super.setState (state_list, callback);

		return null; // for use with getSnapshotBeforeUpdate which requires a return value

	}// setState;


	/**** Debugging ****/


	// protected debug_value (value: string = null) {
	// 	if (!constants.debugging) return null;
	// 	if (common.not_null (value)) return value;
	// 	return Math.random ().toString (36).substr (2);
	// }// debug_value;


	// Used in conjunction with a breakpoint to examine a value
	// without having to create an anonymous function
	public return_value (value: any) {
		return value;
	}// return_value;


	public show_states (cascade: boolean) {

		let append = (object: string, value: string) => { return `${common.is_null (object) ? constants.blank : object}${value}`; }

		let control_states: any = null;
		let child_states = null;

		let result = null;

		if (common.isset (this.state)) {
			Object.keys (this.state).forEach (key => {
				if (common.is_null (this.state [key])) return;
				control_states = append (control_states, `\n${key}: ${this.state [key]}`);
			});
		}// if;

		if (common.not_null (control_states)) result = append (result, `${this.props.id}: <${this.constructor.name}>\n${control_states}`);
		if (common.not_null (child_states)) result = append (result, `\n\n${child_states}`);

		return result;

	}// show_states;


	/********/


	public constructor (props: iprops, state: istate = ({} as istate)) {
		super (props);
		this.state = state;
	}// constructor;


}// BaseControl;


export class Container extends BaseControl {}


