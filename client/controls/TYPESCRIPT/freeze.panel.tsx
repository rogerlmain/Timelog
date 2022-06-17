import * as React from "react";
import * as common from "client/classes/common";

import BaseControl from "controls/base.control";

import { SizeRecord } from "client/types/datatypes";


export default class FreezePanel extends BaseControl<any> {

	private id = null;
	private observer = null;

	public constructor (props: any) {
		super (props);
		this.id = this.id_badge (props.id);
	}// constructor;


	public componentDidMount () {

		let freeze_cell: HTMLDivElement = this.reference (this.id) as HTMLDivElement;

		if (common.is_null (this.observer)) this.observer = new MutationObserver (() => {

			let scroll_sizes: SizeRecord = common.scroll_sizes (freeze_cell);
			let style_sizes: SizeRecord = common.styled_sizes (freeze_cell);

			if (scroll_sizes.width > style_sizes.width) freeze_cell.style.width = `${scroll_sizes.width}px`;
			if (scroll_sizes.height > style_sizes.height) freeze_cell.style.height = `${scroll_sizes.height}px`;

		});

		this.observer.observe (freeze_cell, {
			attributes: true,
			childList: true,
			subtree: true,
			characterData: true
		});

	}// componentDidMount;


	public render () {
		return <div id={this.id} ref={this.create_reference} style={this.props.style}>{this.props.children}</div>;
	}// render;

}// FreezePanel;
