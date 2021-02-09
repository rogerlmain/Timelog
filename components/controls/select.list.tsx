import React from "react";

import { SyntheticEvent } from "react";

import * as common from "components/classes/common";
import * as constants from "components/types/constants";

import BaseControl, { defaultInterface } from "./base.control";


interface selectListInterface extends defaultInterface {
	children?: React.ReactElement<HTMLOptionElement>[];
	onchange?: any;
}// selectListInterface;


export default class SelectList extends BaseControl<selectListInterface> {


	private list_reference: React.RefObject<HTMLDivElement> = React.createRef ();

	private id = null;
	private textbox_id = null;
	private list_id = null;


	private list_items () {
		if (common.is_null (this.props.children)) return null;

		let elements = Array.isArray (this.props.children) ? this.props.children : [this.props.children];

		return elements.map ((item: React.ReactElement<HTMLOptionElement>) => {
			if (common.is_null (item)) return null;
			return (<div
				onClick={(event: SyntheticEvent) => {
					this.setState ({
						selected_entry: event.currentTarget,
						selection_text: event.currentTarget.innerHTML,
						open: false
					}, () => {
						this.execute_event (this.props.onchange, {...event, list: this });
					});
				}}>
				<input type="hidden" name="value" defaultValue={item.props.value} />
				{item.props.children}
			</div>);
		});

	}// list_items;


	private selected_text () {
		if (common.is_null (this.state.selected_entry)) return null;
		return this.state.selected_entry.innerText;
	}// selected_text ();


	private selected_value () {
		try {
			return this.state.selected_entry.querySelector ("[type=hidden]").value;
		} catch (except) { return null }
	}// selected_value;


	/********/


	public state = {
		selected_entry: null,
		open: false
	}// state;


	public componentDidMount () {
		let dropdown: HTMLElement = document.getElementById (this.list_id) as HTMLElement;
		document.body.addEventListener ("click", () => {
			if (dropdown.visible ()) this.setState ({ open: false });
		});
		document.body.addEventListener ("keyup", (event) => {
			if ((event.isComposing || event.key.matches ("Escape", true)) && (dropdown.visible ())) this.setState ({ open: false });
		});
	}// componentDidMount;


	public componentDidUpdate () {

		let list = document.getElementById (this.list_id);

		if (list.innerHTML != constants.empty) {

			let textbox = document.getElementById (this.textbox_id);

			let current_width = parseInt (list.style.width);
			let new_width = common.dimensions (list).width;

			let glyph_width = textbox.querySelector (".glyph-cell").clientWidth;

			if (isNaN (current_width)) current_width = 0;

			if (current_width > 0) {
				current_width -= glyph_width;
				new_width -= glyph_width;
			}// if;

			if (current_width != new_width) {
				list.style.width = `${new_width + glyph_width}px`;
				textbox.style.width = `${new_width + glyph_width}px`;
			}// if;

		}// if;
	}// componentDidUpdate;


	public render () {
		return (
			<div id={this.id_badge (this.props.id)} className={`select-list ${common.isset (this.props.className) ? this.props.className : constants.empty}`}>

				<link rel="stylesheet" href="/resources/styles/controls/select.list.css" />

				<div id={this.textbox_id} className="select-textbox"

					onClick={(event) => {
						this.setState ({ open: this.state.open ? false : true });
						event.stopPropagation ();
					}}>

					<div dangerouslySetInnerHTML={{__html: this.selected_text ()}} />
					<div className="glyph-cell"><div className="select-textbox-glyph" /></div>
				</div>

				<div id={this.list_id} className="select-items" style={{ display: this.state.open ? null : "none" }} ref={this.list_reference}>
					{this.list_items ()}
				</div>
			</div>
		);
	}// render;


	public constructor (props) {
		super (props);
		this.id = this.id_badge (props.id);
		this.textbox_id = `${this.id}_textbox`;
		this.list_id = `${this.id}_list`;
	}// constructor;


}// SelectList;