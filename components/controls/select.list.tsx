import React from "react";

import { SyntheticEvent } from "react";

import * as common from "components/classes/common";
import * as constants from "components/types/constants";

import BaseControl, { defaultInterface } from "./base.control";


interface selectListInterface extends defaultInterface {
	children?: React.ReactElement<HTMLOptionElement>[];
	onchange?: any;
	selected_value?: number;
}// selectListInterface;


export default class SelectList extends BaseControl<selectListInterface> {


	private list_reference: React.RefObject<HTMLDivElement> = React.createRef ();

	private id = null;
	private textbox_id = null;
	private list_id = null;


	private list_elements () {
		let elements = Array.isArray (this.props.children) ? this.props.children : [this.props.children];
		return elements;
	}// list_elements;


	private list_items () {
		if (common.is_null (this.props.children)) return null;

		return this.list_elements ().map ((item: React.ReactElement<HTMLOptionElement>) => {

			if (common.is_null (item)) return null;

			return <div key={item.key}

				onClick={(event: SyntheticEvent) => {

					let list_item = (event.currentTarget as HTMLDivElement);

					this.setState ({
						selected_text: list_item.innerText,
						selected_value: (list_item.querySelector ("[type=hidden]") as HTMLInputElement).value,
						open: false
					}, () => {
						this.execute_event (this.props.onchange, {...event, list: this });
					});

				}}>

				<input type="hidden" key={`${item.key}_value`} value={item.props.value ?? 0} />
				{item.props.children}

			</div>

		});

	}// list_items;


	private get_selected_text (value: number) {
		let result = null;
		this.list_elements ().some ((element: any) => {
			if (common.is_null (element)) return false;
			if (parseInt (element.props.value) == value) {
				result = element.props.children;
				return true;
			}// if;
		});
		return result;
	}// get_selected_text;


	/********/


	public state = {
		selected_text: null,
		selected_value: null,
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

		this.setState ({
			selected_text: this.get_selected_text (this.props.selected_value),
			selected_value: this.props.selected_value
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


	public reset () {
		this.setState ({
			selected_text: null,
			selected_value: null
		});
	}// reset;


	public render () {

		let id = this.id_badge (this.props.id);

		return (
			<div id={id} className={`select-list ${common.isset (this.props.className) ? this.props.className : constants.empty}`}>

				<link rel="stylesheet" href="/resources/styles/controls/select.list.css" />

				<input type="hidden" name={id} value={this.state.selected_value ?? 0} />

				<div id={this.textbox_id} className="select-textbox"

					onClick={(event) => {
						this.setState ({ open: this.state.open ? false : true });
						event.stopPropagation ();
					}}>

					<div>{this.state.selected_text}</div>
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