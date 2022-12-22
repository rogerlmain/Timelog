
import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";
import DropDownList from "client/controls/lists/drop.down.list";

import { debugging, isset, is_null, not_set } from "client/classes/common";

import { MasterContext } from "client/classes/types/contexts";
import { horizontal_alignment, vertical_alignment } from "client/classes/types/constants";


const load_list_id = "load_list";


export default class LoadList extends BaseControl {


	eyecandy_panel = React.createRef ();


	state = { eyecandy_visible: false }


	/*********/


	static contextType = MasterContext;


	static defaultProps = {

		id: load_list_id,

		label: "LoadList",
		newButtonPage: null,

		data: null,

		dataIdField: null,
		dataTextField: null,

		header: null,
		headerSelectable: false,

		selectedItem: null,

		hAlign: horizontal_alignment.left,
		vAlign: vertical_alignment.center,

		style: null,

		disabled: false,

		animated: true,
		visible: true,

		onChange: null,
		onEyecandy: null,

	}// defaultProps;


	constructor (props) {
		
		super (props);
		
		if (this.props.id.equals (load_list_id)) console.warn ("Your LoadList really should have a unique ID");

		this.state.eyecandy_visible = is_null (this.props.data);

		if (debugging ()) console.log (`${props.id} list created`);

	}// constructor;


	/*********/


	select_list = () => {

		let new_button = isset (this.props.newButtonPage);
		let single_option = ((this.props.data?.key_length () == 1) && not_set (this.props.header));

		let form_style = {
			...this.props.style,
			columnGap: (new_button && isset (this.props.data)) ? "0.25em" : null,
			gridTemplateColumns: "1fr min-content",
		}// form_style;

		if (is_null (this.props.data)) return null;
		
		if (this.props.hAlign == horizontal_alignment.stretch) form_style.width = "100%";
		if (this.props.vAlign == vertical_alignment.stretch) form_style.height = "100%";

		return <div className={new_button ? "two-column-grid" : null} style={form_style}>

			{single_option ? <div className="vertically-aligned">{this.props.data [Object.keys (this.props.data) [0]].name}</div> : 
			
			<DropDownList id={this.props.id} 
			
				data={this.props.data} selectedValue={this.props.selectedItem} disabled={this.props.disabled}
				style={this.props.style}

				header={this.props.header} 
				headerSelectable={this.props.headerSelectable}
				
				idField={this.props.dataIdField} textField={this.props.dataTextField}

				onChange={event => this.execute (this.props.onChange, event)}>

			</DropDownList>}

			{new_button && <button onClick={() => this.context.master_page.set_page (this.props.newButtonPage)}>New</button>}

		</div>
		
	}// select_list;


	/*********/


	render () {

		let list_panel_id = `${this.props.id}_list_panel`;

		this.rendered = true;

		return <EyecandyPanel id={`${list_panel_id}_eyecandy_panel`} ref={this.eyecandy_panel} text="Loading..." 

			onEyecandy={this.props.onEyecandy}
		
			hAlign={this.props.hAlign} vAlign={this.props.vAlign} stretchOnly={true}
			eyecandyVisible={not_set (this.props.data)}>

			{this.select_list ()}

		</EyecandyPanel>

	}// render;

}// LoadList;