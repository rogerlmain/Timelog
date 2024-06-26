import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import { default_settings } from "client/classes/types/constants";
import { isset, is_function, is_null, not_set } from "client/classes/common";


const header_value = null;
const highlight_classname = "dropdown-list-items";
const item_padding = "0.2em 0 0.2em 0.5em";


export default class DropDownList extends BaseControl {


	dropdown_panel = React.createRef ();
	dropdown_list = React.createRef ();

	item_list = React.createRef ();

	list_sleeve = React.createRef ();
	list_glyph = React.createRef ();

	active_selection = React.createRef ();


	state = { 

		opened: false,

		focused: false,
		losing_focus: false,

		refresh: false,

		selected_value: "0",
		selection_width: 0,
		
		list_class: null,

	}/* state */;


	static defaultProps = { 

		id: "dropdown_list",

		data: null,
		idField: null,
		textField: null,

		selectedValue: null,

		header: null,
		headerSelectable: false,
		headerVisible: false,

		onChange: null,

		speed: (default_settings.animation_speed / 3)
	
	}/* defaultProps */;


	constructor (props) {
		super (props);
		this.state.selected_value = this.props.selectedValue;
	}/* constructor */;


	/********/


	header_visible = () => isset (this.props.header) && ((this.state.selected_value < 1) || (this.props.headerSelectable) || (this.props.headerVisible));


	is_open = () => (this.list_sleeve.current?.offsetHeight > 0);


	list_click_handler = (event, child = null) => {

		let item = event?.currentTarget ?? event?.target;
		let value = item.getAttribute ("value");

		if (this.state.selected_value != value) this.execute (this.props.onChange, event);
		
		this.setState ({ selected_value: value }, () => {
			this.execute (child?.onClick);
			this.execute (this.props.onClick);
			this.close_list ();
		});

	}/* list_click_handler */;


	dropdown_list_items = list => {

		let result = null;
		let index = 1;

		if (isset (list)) list.forEach (child => {

			let preprocessed_text = is_function (this.props.textField);
			let value = is_function (this.props.idField) ? this.props.idField (child) : child?.[this.props.idField];

			if (is_null (result)) result = new Array ();

			result.push (<div id={`${this.props.id}_item_${index}`} value={value} key={index++} className="dropdown-child-item" 

				style={preprocessed_text ? null : { padding: item_padding }}
				onClick={event => this.list_click_handler (event, child)}>

				<span>{preprocessed_text ? this.props.textField (child) : (child?.[this.props.textField] ?? child?.props?.children)}</span>
				
			</div>);

		});

		return result;

	}/* dropdown_list_items */;		


	child_list = () => Array.concat (

		this.header_visible () ? [<div key="placeholder" style={{ 
			fontStyle: "italic", 
			padding: item_padding 
		}} value={header_value} onClick={this.props.headerSelectable ? this.list_click_handler : null}>{this.props.header}</div>] : null,

		this.dropdown_list_items (this.props.data),
		this.dropdown_list_items (this.props.children)

	)/* child_list */;


	open_list () {
		this.list_sleeve.current.style.maxHeight = `${this.item_list.current.offsetHeight}px`;
		this.list_glyph.current.style.transform = "rotate(225deg)";
	}/* open_list */;


	close_list () {
		this.list_sleeve.current.style.maxHeight = 0;
		this.list_glyph.current.style.transform = "rotate(45deg)";
	}/*  close_list */;


	start_transition () {

		this.item_list.current.className = null;
		this.execute (this.state.opened ? this.props.beforeClosing : this.props.beforeOpening);

		if (!this.state.opened) {
			this.dropdown_list.current.style.position = "absolute";
			this.list_sleeve.current.style.visibility = "visible";
		}/* if */;

	}/* start_transition */;


	end_transition () {
		this.setState ({ opened: !this.state.opened }, () => {

			this.execute (this.state.opened ? this.props.afterOpening : this.props.afterClosing);

			if (!this.state.opened) {
				this.dropdown_list.current.style.position = null;
				return this.list_sleeve.current.style.visibility = "hidden";
			}/* if */;

			this.item_list.current.className = highlight_classname;

		});
	}/* end_transition */;


	/********/


	componentDidMount () {

		document.addEventListener ("click", event => not_set (event.target.closest (`#${this.props.id}_dropdown_panel`)) ? this.setState ({ focused: false }, this.close_list.bind (this)) : null);

		this.list_sleeve.current.addEventListener ("transitionstart", this.start_transition.bind (this));
		this.list_sleeve.current.addEventListener ("transitionend", this.end_transition.bind (this));

		this.setState ({ refresh: true });

	}/* componentDidMount */;


	shouldComponentUpdate (props) {

		if (isset (this.props.data) && (not_set (this.props.idField))) throw "DropDownList requires an idField if data is supplied.";
		if (isset (this.props.data) && (not_set (this.props.textField))) throw "DropDownList requires a textField if data is supplied.";

		if (this.props.selectedValue != props.selectedValue) return !!this.setState ({ selected_value: props.selectedValue });
		if (this.props.data != props.data) return !!this.setState ({ refresh: true }); 
		
		return true;

	}/* shouldComponentUpdate */


	componentDidUpdate () {
		if (this.state.refresh)	{
			
			let max_width = 0;
			let list = Array.from (this.item_list.current.getElementsByTagName ("span"));

			list?.forEach (child => {
				if (child.offsetWidth > max_width) max_width = child.offsetWidth
			});

			this.setState ({ 
				refresh: false,
				selection_width: max_width,
			}, () => this.dropdown_panel.current.freeze ());

		}// if;
	}/* componentDidUpdate */


	render () {

		let item_list = this.child_list ();
		let active_item = isset (item_list) ? (isset (this.state.selected_value) ? item_list.find (item => this.state.selected_value.matches (item.props.value)) : item_list [0]) : null;
	
		return <div id={`${this.props.id}_dropdown_panel`} className="dropdown" ref={this.dropdown_panel} style={{ position: "relative" }}>
			<div className="dropdown-list" ref={this.dropdown_list} style={{ zIndex: this.state.focused ? 1 : 0 }}>

				<div className="active-dropdown-item bordered"
				
					style={{
						backgroundColor: this.state.focused ? "var(--highlight-color)" : "var(--background-color)",
						border: this.state.focused ? "solid 1px var(--highlight-border-color)" : "solid 1px var(--border-color)",
					}}
				
					onClick={event => this.setState ({ focused: true }, (this.state.opened ? this.close_list : this.open_list))}>

					<div className="active-dropdown-selection" ref={this.active_selection} style={{ paddingRight: "0.25em", width: `${this.state.selection_width}px`}}>{active_item}</div>

					<div id="item_list_glyph" ref={this.list_glyph} className="dropdown-glyph"
						style={{ transition: `transform ${this.props.speed}ms ease-in-out, top ${this.props.speed}ms ease-in-out` }}>
					</div>

				</div>

				<div id={`${this.props.id ?? "dropdown"}_list_sleeve`} ref={this.list_sleeve} className="dropdown-list-sleeve" 

					style={{ 
						maxHeight: 0,
						transition: `max-height ${this.props.speed}ms ease-in-out`,
						visibility: "hidden",
					}}>

					<div id="item_list" className={this.state.list_class} ref={this.item_list}>{item_list}</div>

				</div>

			</div>
		</div>
	}// render;


}// DropDownList;