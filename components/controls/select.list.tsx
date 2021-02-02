import React from "react";

import { SyntheticEvent } from "react";

import * as common from "components/classes/common";
import * as constants from "components/types/constants";

import BaseControl, { defaultInterface } from "./base.control";


interface selectListInterface extends defaultInterface {
	children?: React.ReactElement<HTMLOptionElement>[];
}// selectListInterface;


export default class SelectList extends BaseControl<selectListInterface> {


	private list_reference: React.RefObject<HTMLDivElement> = React.createRef ();

	private id = null;
	private textbox_id = null;
	private list_id = null;


	private list_items () {
		let elements = Array.isArray (this.props.children) ? this.props.children : [this.props.children];
		return elements.map ((item: React.ReactElement<HTMLOptionElement>) => {
			if (common.is_null (item)) return null;
			return (<div onClick={(event: SyntheticEvent) => {
				this.setState ({
					selection_text: event.currentTarget.innerHTML,
					open: false
				})
			}}>{item.props.children}</div>);
		});
	}// list_items;


	/********/


	public state = {
		selection_text: null,
		open: false
	}// state;


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

					onClick={() => {
						this.setState ({ open: this.state.open ? false : true })
					}}>

					<div dangerouslySetInnerHTML={{__html: this.state.selection_text}} />
					<div className="glyph-cell"><div className="select-textbox-glyph" /></div>
				</div>

				<div id={this.list_id} className="select-items" onChange={() => { alert ("here") }}
					style={{
						position: "absolute",
						display: this.state.open ? null : "none"
					}}

					ref={this.list_reference}>
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