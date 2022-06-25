
import React from "react";

import Container from "client/controls/container";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";

import SelectList from "client/controls/lists/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import { isset, is_empty, is_function, is_promise, not_function, not_set, null_value } from "client/classes/common";

import { MasterContext } from "client/classes/types/contexts";
import { tracing } from "client/classes/types/constants";


const load_list_id = "load_list";


export default class LoadList extends BaseControl {


	container = React.createRef ();


	 state = { 

		list_data: null,

		item_selected: false,
		data_loading: false,

	}// state;


	static contextType = MasterContext;


	static defaultProps = {

		id: load_list_id,

		label: "LoadList",
		newButtonPage: null,

		data: null,

		dataIdField: null,
		dataTextField: null,

		listHeader: null,
		selectedItem: null,

		headerSelectable: false,
		animated: true,
		visible: true,

		onChange: null,

	}// defaultProps;


	load_data = (input_data) => {

		let update_state = data => {
			if (not_set (this.container.current)) return setTimeout (() => update_state (data));
			this.setState ({ 
				list_data: data,  
				data_loading: false,
			});
		}/* update_state */;

		if (is_promise (this.props.data)) return this.props.data.then (data => update_state (data));
		if (is_promise (input_data)) return input_data.then (data => update_state (data));

		update_state (input_data);

	}/* load_data */;


	constructor (props) {
		
		super (props);
		
		if (this.props.id.equals (load_list_id)) console.warn ("Your LoadList really should have a unique ID");
		if (tracing) console.log (`${props.id} list created`);

		this.load_data (props.data);

	}// constructor;


	shouldComponentUpdate (new_props) {
		if (this.props.data != new_props.data) return !!this.load_data (new_props.data);
		return true;
	}// shouldComponentUpdate;


	/*********/


	data_options = () => {

		let header = null_value (this.props.listHeader);

		if (is_promise (this.state.list_data)) return null;
		
		if (isset (this.props.newButtonPage) && is_empty (this.state.list_data)) return <button onClick={() => { 
			this.context.master_page.setState ({ page: this.props.newButtonPage })
		}}>New</button>
		
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


	/*********/


	render () {

		let list_id = `${this.props.id}_load_list`;

		return <Container ref={this.container}>

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