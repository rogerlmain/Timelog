
import React from "react";

import Container from "client/controls/container";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";

import SelectList from "client/controls/lists/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import { isset, is_empty, is_null, is_promise, not_set, null_value } from "client/classes/common";

import { MasterContext } from "client/classes/types/contexts";
import { tracing } from "client/classes/types/constants";


const load_list_id = "load_list";


export default class LoadList extends BaseControl {


	 state = { 

		data: null,

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

		style: null,

		headerSelectable: false,
		disabled: false,

		animated: true,
		visible: true,

		onChange: null,

	}// defaultProps;


	constructor (props) {
		
		super (props);
		
		if (this.props.id.equals (load_list_id)) console.warn ("Your LoadList really should have a unique ID");
		if (tracing) console.log (`${props.id} list created`);

		this.state.data = this.props.data;
		
	}// constructor;


	/*********/


	data_list = () => {

		let header = null_value (this.props.listHeader);

		if (isset (this.props.newButtonPage) && is_empty (this.state.data)) return <button onClick={() => { 
			this.context.master_page.setState ({ page: this.props.newButtonPage })
		}}>New</button>
		
		return <SelectList id={this.props.id} data={this.state.data} value={this.props.selectedItem} disabled={this.props.disabled}

			style={this.props.style}

			hasHeader={isset (header)} headerText={header} 
			headerSelectable={this.props.headerSelectable}
			
			idField={this.props.dataIdField} textField={this.props.dataTextField}

			onChange={event => {
				this.setState ({ item_selected: true });
				this.execute (this.props.onChange, event);							
			}}>

		</SelectList>
		
	}// get_data;


	/*********/


	shouldComponentUpdate (new_props) {

		if (is_promise (new_props.data) || not_set (new_props.data)) return !!this.setState ({ data_loading: true });

		if (this.props.data != this.state.data) return !!this.setState ({ 
			data_loading: true,
			list_data: this.props.data
		});

		return true;

	}// shouldComponentUpdate;


	componentDidMount = () => this.shouldComponentUpdate (this.state);


	render () {

		let list_panel_id = `${this.props.id}_list_panel`;

		return <Container>

			<FadePanel id={`${this.props.id}_label_panel`} animated={this.props.animated} visible={this.props.visible}>
				<label htmlFor={this.props.id} style={{
					display: "block", 
					width: "100%",
				}}>{this.props.label}</label>
			</FadePanel>

			<FadePanel id={list_panel_id} animated={this.props.animated} visible={this.props.visible}>
				<EyecandyPanel id={`${list_panel_id}_eyecandy_panel`} text="Loading..." eyecandyVisible={this.state.data_loading} stretchOnly={true}>
					{this.data_list ()}
				</EyecandyPanel>
			</FadePanel>

		</Container>
	}// render;

}// LoadList;