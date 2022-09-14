
import React from "react";

import BaseControl from "client/controls/abstract/base.control";

import SelectList from "client/controls/lists/select.list";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import { debugging, isset, is_null, is_promise, null_value } from "client/classes/common";

import { MasterContext } from "client/classes/types/contexts";
import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";


const load_list_id = "load_list";


export default class LoadList extends BaseControl {


	eyecandy_panel = React.createRef ();


	state = {
		data: undefined, // cannot initialize to null because parent may want null.
		eyecandy_visible: false,
	}// state;


	/*********/


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

		hAlign: horizontal_alignment.left,
		vAlign: vertical_alignment.center,

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

		this.state.data = this.props.data;
		
		if (debugging ()) console.log (`${props.id} list created`);

	}// constructor;


	/*********/


	select_list = () => {

		let header = null_value (this.props.listHeader);

		if (is_null (this.state.data)) return null;

		if (isset (this.props.newButtonPage)) return <button onClick={() => { 
			this.context.master_page.setState ({ page: this.props.newButtonPage })
		}}>New</button>
		
		return <SelectList id={this.props.id} data={this.state.data} value={this.props.selectedItem} disabled={this.props.disabled}

			style={this.props.style}

			hasHeader={isset (header)} headerText={header} 
			headerSelectable={this.props.headerSelectable}
			
			idField={this.props.dataIdField} textField={this.props.dataTextField}

			onChange={event => this.execute (this.props.onChange, event)}>

		</SelectList>
		
	}// select_list;


	/*********/


	shouldComponentUpdate (new_props) {

		if (is_promise (new_props.data)) {
			if ((new_props.data.pending) && (!this.state.eyecandy_visible)) return !setTimeout (() => this.setState ({ eyecandy_visible: true }));
			return true;
		}// if;
		
		if (isset (new_props.data) && (new_props.data != this.props.data)) return !!this.eyecandy_panel.current?.exploding_panel?.current?.animate (() => this.setState ({ 
			data: new_props.data,
			eyecandy_visible: false,
		}));

		return true;

	}// shouldComponentUpdate;


	componentDidMount = this.forceRefresh;


	render () {

		let list_panel_id = `${this.props.id}_list_panel`;

		return <EyecandyPanel id={`${list_panel_id}_eyecandy_panel`} ref={this.eyecandy_panel} text="Loading..." 
		
			hAlign={this.props.hAlign} vAlign={this.props.vAlign} stretchOnly={true}
			eyecandyVisible={this.state.eyecandy_visible} 

			onEyecandy={() => this.props.data.then (data => this.setState ({ 
				data: data,
				eyecandy_visible: false,
			}))}>

			{is_promise (this.state.data) ? null : this.select_list ()}

		</EyecandyPanel>

	}// render;

}// LoadList;