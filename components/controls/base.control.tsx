import { blank, underscore, debugging } from "components/types/constants";
import * as common from "components/classes/common";
import * as datatype from "components/types/datatypes";

import ReferenceList from 'components/classes/reference.list';

import * as React from 'react';


export interface defaultInterface {

	id?: string;
	className?: string;

	parent?: any;
	style?: any;
	afterRender?: any;

	dom_control?: any;

	references?: ReferenceList;

}// defaultInterface;


export default class BaseControl<properties> extends React.Component<any> {


	constructor (props: any) {
		super (props);
		this.references = {};
	}// constructor;


	/********/


	public get_width () {
		return common.isset (this.props.dom_control) ? this.props.dom_control.clientWidth : 0;
	}// get_width;


	public get_height () {
		return common.isset (this.props.dom_control) ? this.props.dom_control.clientHeight : 0;
	}// get_height;


	public signed_in () {
		return common.not_null (this.get_cookie ("current_account"));
	}// signed_in;


	public signed_out () {
		return !this.signed_in ();
	}// signed_out;


	public logged_in () {
		return common.not_null (this.get_cookie ("current_entry"));
	}// logged_in;


	public logged_out () {
		return !this.logged_in ();
	}// logged_out;


	/********/


	public componentDidUpdate () {
		this.execute_event (this.props.afterRender);
	}// componentDidUpdate;


	public render () { return this.props.children; }


	/********/


	protected references: ReferenceList;


	protected current_account (): datatype.account {
		return datatype.account.parse (this.get_cookie ("current_account"));
	}// current_account;


	protected current_entry (): datatype.entry {
		return datatype.entry.parse (this.get_cookie ("current_entry"));
	}// current_entry;


	protected add_reference = (element, reference) => {
		reference = this.create_reference (element);
		return reference;
	}// add_reference;


	protected create_reference = element => {
		if (common.is_null (element)) return null;
		var element_id = (element instanceof HTMLElement) ? element.id : element.props.id;
		if (common.is_null (element_id)) return;
		if (common.is_null (this.references)) this.references = new ReferenceList ();
		if (common.is_null (this.references [element_id])) this.references [element_id] = React.createRef ();
		this.references [element_id].current = element;
		return this.references [element_id];
	}// create_reference;


	protected execute_event (event) {
		if (event != null) event ();
	}// execute_event;


	protected fetch_items (view: any, parameters: any, callback: any) {

		let form_data = (parameters instanceof FormData);

		let fetch_parameters: RequestInit = {
			method: "post",
			credentials: "same-origin",
			body: form_data ? parameters : JSON.stringify (parameters)
		}// fetch_parameters;

		if (!form_data) fetch_parameters ["headers"] = {
			"Accept": "application/json",
			"Content-Type": "application/json"
		}// if;

		fetch (`/${view}`, fetch_parameters).then (response => {
			return response.json ()
		}). then (callback);
	}// fetch_items;


	protected get_cookie (name: any) {
		const cookies = document.cookie.split (";");
		for (var cookie of cookies) {
			var parts = cookie.split ("=");
			if (parts.length != 2) return null;
			if (parts [0].trim () != name) continue;
			return parts [1];
		}// for;
	}// get_cookie;


	protected id_badge (stub: any = null) {
		if (common.is_null (stub)) stub = this.constructor.name;
		return this.props.id ?? stub + underscore + Date.now ();
	}// id_badge;


	protected set_cookie (name: string, value: any) {
		document.cookie = `${name}=${value}`;
	}// set_cookie;


	protected delete_cookie (name: any) {
		document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
	}// delete_cookie;

	protected clear_cookie (name: any) { this.delete_cookie (name); }


	protected reference (name: string) {
		try {
			return this.references [name].current;
		} catch { return null; }
	}// reference;


	protected ref_state = (reference: string, value: any) => {
		this.reference (reference).setState (value);
	}// ref_state;


	protected get_state = (name: string, fieldname: string) => {
		let ref = this.reference (name);
		return common.isset (ref) ? ref.state [fieldname] : null;
	}// get_state;


	protected select_options (list: any, id_field: string, text_value: string) {
		if (common.is_null (list)) return null;
		return list.map ((item: any) => { return <option value={item [id_field]} key={item [id_field]}>{item [text_value]}</option> });
	}// select_options;


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


}// BaseControl;