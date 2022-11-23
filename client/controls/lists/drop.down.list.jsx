import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import { default_settings } from "client/classes/types/constants";
import { isset, is_function, is_null, not_set } from "client/classes/common";


const header_value = -1;


export default class DropDownList extends BaseControl {


	dropdown = React.createRef ();
	dropdown_list = React.createRef ();

	item_list = React.createRef ();

	list_sleeve = React.createRef ();
	list_glyph = React.createRef ();

	active_selection = React.createRef ();


	state = { 

		opened: false,

		focused: false,
		losing_focus: false,

		selected_value: null,

	}/* state */;


	static defaultProps = { 

		id: "dropdown_list",

		data: null,
		idField: null,
		textField: null,

		header: null,
		headerSelectable: false,
		headerVisible: false,

		onChange: null,

		speed: default_settings.animation_speed 
	
	}/* defaultProps */;


	/********/


	header_visible = () => isset (this.props.header) && ((this.state.selected_value == 0) || (this.props.headerSelectable) || (this.props.headerVisible));


	is_open = () => (this.list_sleeve.current?.offsetHeight > 0);


	data_items () {

		let result = null;
		let index = 1;

		this.props.data?.forEach (child => {

			let value = is_function (this.props.idField) ? this.props.idField (child) : child [this.props.idField];
			let text = is_function (this.props.textField) ? this.props.textField (child) : child [this.props.textField];
	
			if (is_null (result)) result = new Array ();

			result.push (<div id={`${this.props.id}_item_${index}`} value={value} key={index++} className="dropdown-child-item" onClick={event => {

				this.setState ({ selected_value: value }, () => {
					this.execute (child.onClick);
					this.active_selection.current.innerHTML = event.target.innerHTML;
					this.close_list ();
				});				
	
			}}>{text}</div>);
		});

		return result;

	}/* data_items */


	child_list () {

		let result = null;
		let index = 1;

		if (this.header_visible ()) result = [<div key="placeholder" style={{ fontStyle: "italic" }} value={header_value}>{this.props.header}</div>];
		if (isset (this.props.data)) result = isset (result) ? result.concat (this.data_items ()) : this.data_items ();

		this.props.children?.forEach (child => {

			if (is_null (result)) result = new Array ();

			result.push (<div value={child.value} key={index++} className="dropdown-child-item" onClick={event => {
				this.setState ({ selected_value: child.value }, () => {
					this.execute (child.onClick);
					this.active_selection.current.innerHTML = event.target.innerHTML;
					this.close_list ();
				});				
			}}>{child.props.children}</div>);

		});

		return result;

	}/* child_list */;


	open_list () {
		this.list_sleeve.current.style.maxHeight = `${this.item_list.current.offsetHeight}px`;
		this.list_glyph.current.style.transform = "rotate(225deg)";
		this.list_glyph.current.style.transform = "2px";
	}/* open_list */;


	close_list () {
		this.list_sleeve.current.style.maxHeight = 0;
		this.list_glyph.current.style.transform = "rotate(45deg)";
		this.list_glyph.current.style.transform = "-1px";
	}/*  close_list */;


	start_transition () {
		this.execute (this.state.opened ? this.props.beforeClosing : this.props.beforeOpening);
		if (!this.state.opened) this.list_sleeve.current.style.visibility = "visible";
	}/* start_transition */;


	end_transition () {
		this.setState ({ opened: !this.state.opened }, () => {
			this.execute (this.state.opened ? this.props.afterOpening : this.props.afterClosing);
			if (!this.state.opened) {
			
				this.list_sleeve.current.style.visibility = "hidden";
				
				if (this.state.losing_focus) this.setState ({ 
					focused: false,
					losing_focus: false,
				});

			}// if;

		});
	}/* end_transition */;


	/********/


	componentDidMount () {

		document.addEventListener ("click", event => not_set (event.target.closest (`#${this.props.id}_main_panel`)) ? this.setState ({ losing_focus: true }, this.close_list) : null);

		this.list_sleeve.current.addEventListener ("transitionstart", this.start_transition.bind (this));
		this.list_sleeve.current.addEventListener ("transitionend", this.end_transition.bind (this));

		this.active_selection.current.style.width = `${this.item_list.current.offsetWidth}px`;

		this.dropdown.current.style.width = `${this.dropdown_list.current.offsetWidth}px`;
		this.dropdown.current.style.height = `${this.dropdown_list.current.offsetHeight}px`;

	}/* componentDidMount */;


	render () {
		return <div id={`${this.props.id}_main_panel`} className="dropdown" ref={this.dropdown}>
			<div className="dropdown-list" ref={this.dropdown_list} style={{ zIndex: this.state.focused ? 1 : 0 }}>
				<div className="active-dropdown-item bordered"
				
					style={{
						backgroundColor: this.state.focused ? "var(--highlight-color)" : "var (--border-color)",
						border: this.state.focused ? "solid 2px var(--highlight-border-color)" : "solid 1px var(--border-color)",
					}}
				
					onClick={() => this.setState ({ focused: true }, () => this.state.opened ? this.close_list () : this.open_list ())}>

					<div id="item_list_glyph" ref={this.list_glyph} className="dropdown-glyph"
						style={{ transition: `transform ${this.props.speed}ms ease-in-out, top ${this.props.speed}ms ease-in-out` }}>
					</div>

					<div className="active-dropdown-selection" ref={this.active_selection} />

				</div>

				<div id={`${this.props.id ?? "dropdown"}_list_sleeve`} ref={this.list_sleeve} className="dropdown-list-sleeve" 

					style={{ 
						maxHeight: 0,
						transition: `max-height ${this.props.speed}ms ease-in-out`,
						visibility: "hidden",
					}}>

					<div id="item_list" className="dropdown-list-items" ref={this.item_list}>{this.child_list ()}</div>

				</div>
			</div>
		</div>
	}// render;


}// QuickTest;
