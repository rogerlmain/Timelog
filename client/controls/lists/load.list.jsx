
import React from "react";

import Container from "client/controls/container";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";

import SelectList from "client/controls/lists/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import { isset, is_empty, is_promise, not_set, null_value } from "client/classes/common";

import { MasterContext } from "client/classes/types/contexts";


const load_list_id = "load_list";


export default class LoadList extends BaseControl {


	 state = { 

		list_data: null,

		item_selected: false,
		data_loading: false,

	}// state;


	static contextType = MasterContext;


	static defaultProps = {

		id: load_list_id,

		label: "LoadList",
		newOptionPage: null,

		dataIdField: null,
		dataTextField: null,

		listHeader: null,
		selectedItem: null,

		headerSelectable: false,
		animated: true,
		visible: true,

		onChange: null,

	}// defaultProps;


	constructor (props) {

		super (props);

		if (this.props.id.equals (load_list_id)) console.warn ("Your LoadList really should have a unique ID");
		this.get_data ();

	}// constructor;


	/*********/


	data_options = () => {

		let header = null_value (this.props.listHeader);

		if (is_promise (this.state.list_data)) return null;
		if (isset (this.props.newOptionPage) && is_empty (this.state.list_data)) return <button onClick={() => { this.context.master_page.setState ({ page: this.props.newOptionPage }) }}>New</button>
		
		return <SelectList id={this.props.id} data={this.state.list_data} value={this.props.selectedItem}

			hasHeader={isset (header)} headerText={header} 
			headerSelectable={this.props.headerSelectable}
			idField={this.props.dataIdField} textField={this.props.dataTextField}

			onChange={event => {
				this.setState ({ item_selected: true });
				this.execute (this.props.onChange, event);							
			}}>

		</SelectList>
		
	}// data_options;


	get_data = (force = false) => {

		if (not_set (this.state.list_data)) {
			this.state.list_data = this.run (this.props.getData);
			if (is_promise (this.state.list_data)) {

				this.state.data_loading = true;
				
				this.state.list_data.then (data => this.setState ({ 
					list_data: data,
					data_loading: false,
				}));

			}// if;
		}// if;

		if (force) this.forceUpdate ();

		return this.state.list_data;

	}// get_data;


	/*********/


	shouldComponentUpdate (new_props) {

		if (this.props.getData != new_props.getData) {
			this.state.list_data = null;
			this.get_data (true);
			return false;
		}// if;

		return true;
	
	}// shouldComponentUpdate;


	render () {

		let list_id = `${this.props.id}_load_list`;

		return <Container>

			<FadePanel id={`${this.props.id}_label_panel`} animated={this.props.animated} visible={this.props.visible}>
				<label htmlFor={list_id} style={{
					display: "block", 
					width: "100%",
				}}>{this.props.label}</label>
			</FadePanel>

			<FadePanel id={`${this.props.id}_list_panel`} animated={this.props.animated} visible={this.props.visible}>
				<EyecandyPanel id={list_id} text="Loading..." eyecandyVisible={is_promise (this.state.list_data) || this.state.data_loading}>
					{this.data_options ()}
				</EyecandyPanel>
			</FadePanel>

		</Container>

	}// render;

}// LoadList;