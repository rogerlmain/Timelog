import { blank, underscore, debugging } from "components/types/constants";
import * as common from "components/classes/common";
import * as constants from "components/types/constants";
import * as datatypes from "components/types/datatypes";

import ReferenceList from 'components/classes/reference.list';

import * as React from 'react';


export interface defaultInterface {

	id?: string;
	className?: string;

	references?: ReferenceList;

	disabled?: boolean;

	parent?: any;
	style?: any;
	afterRender?: any;

	dom_control?: any;

}// defaultInterface;


export default class BaseControl<properties> extends React.Component<any> {


	private getState (name: string, fieldname: string) {
		let object = this.state [name];
		if (common.is_null (object)) return null;
		return object [fieldname];
	}// getState;


	/********/


	protected references: ReferenceList;


	protected add_reference (element: any, reference: any) {
		reference = this.create_reference (element);
		return reference;
	}// add_reference;


	protected current_account (): datatypes.account {
		return datatypes.account.parse (common.get_cookie ("current_account"));
	}// current_account;


	protected current_entry (): datatypes.entry {
		return datatypes.entry.parse (common.get_cookie ("current_entry"));
	}// current_entry;


	protected dom (name: string, property: string = null): HTMLFormElement {
		let element = document.getElementById (name) as HTMLFormElement;
		if (common.is_null (property)) return element;
		if (common.is_null (element)) return null;
		return element [property];
	}// dom;


	protected create_reference = element => {
		if (common.is_null (element)) return null;
		var element_id = (element instanceof HTMLElement) ? element.id : element.props.id;
		if (common.is_null (element_id)) return;
		if (common.is_null (this.references)) this.references = new ReferenceList ();
		if (common.is_null (this.references [element_id])) this.references [element_id] = React.createRef ();
		this.references [element_id].current = element;
		return this.references [element_id];
	}// create_reference;


	protected execute_event (event: any, ...parameters: any[]) {
		if (event != null) return event (...parameters);
	}// execute_event;


	protected id_badge (stub: any = null) {
		if (common.is_null (stub)) stub = this.constructor.name;
		return this.props.id ?? stub + underscore + Date.now ();
	}// id_badge;


	protected reference (name: string) {
		try {
			return this.references [name].current;
		} catch { return null; }
	}// reference;


	protected ref_state (reference: string, value: any) {
		this.reference (reference).setState (value);
	}// ref_state;


	protected select_options (list: any, id_field: string, text_value: string) {
		if (common.is_null (list)) return null;
		let result = list.map ((item: any) => {
			return <option value={item [id_field]} key={item [id_field]}>{item [text_value]}</option>
		});
		return result;
	}// select_options;


	protected state_value (state: string, field: string) {
		return this.getState (state, field) ?? constants.empty;
	}// state_value;


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
		return common.isset (this.props.dom_control) ? this.props.dom_control.clientWidth : 0;
	}// get_width;


	public get_height () {
		return common.isset (this.props.dom_control) ? this.props.dom_control.clientHeight : 0;
	}// get_height;


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


	public logged_in (callback: any = null) {
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
		this.execute_event (this.props.afterRender);
	}// componentDidUpdate;


	public render () { return this.props.children; }


	/**** Debugging ****/


	protected debug_value (value: string = null) {
		if (!debugging) return null;
		if (common.not_null (value)) return value;
		return Math.random ().toString (36).substr (2);
	}// debug_value;


	public show_states (cascade: boolean) {

		let append = (object: string, value: string) => { return `${common.is_null (object) ? blank : object}${value}`; }

		let control_states = null;
		let child_states = null;

		let result = null;

		if (common.isset (this.state)) {
			Object.keys (this.state).forEach (key => {
				if (common.is_null (this.state [key])) return;
				control_states = append (control_states, `\n${key}: ${this.state [key]}`);
			});
		}// if;
		if (cascade) Object.keys (this.references).forEach (key => {
			if (common.isset (this.references [key]) && (common.isset (this.references [key].show_states))) {
				child_states = this.references [key].show_states (cascade);
			}// if;
		});

		if (common.not_null (control_states)) result = append (result, `${this.props.id}: <${this.constructor.name}>\n${control_states}`);
		if (common.not_null (child_states)) result = append (result, `\n\n${child_states}`);

		return result;

	}// show_states;


	/********/


	constructor (props: any) {
		super (props);
		this.references = {};
	}// constructor;


}// BaseControl;