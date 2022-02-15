import React from "react";

import BaseControl, { DefaultProps } from "client/controls/base.control";
import FadeControl from "client/controls/fade.control";
import SelectButton from "client/controls/select.button";

import { globals } from "client/types/globals";
import { popup_zindex } from "client/types/constants";


interface popupWindowInterface extends DefaultProps {
	open: any,
	modal: boolean,

	beforeOpening?: any,
	afterClosing?: any
}// popupWindowInterface;


export default class PopupWindow extends BaseControl<popupWindowInterface> {


	private id = null;
	private modal = null;


	public constructor (props) {
		super (props);
		this.modal = this.props.modal ?? true;
		this.id = this.props.id ?? "popup_window_" + Date.now ();
	}// componentDidMount;


	public render () {
		return (
			<FadeControl id={this.id} ref={this.create_reference} visible={this.props.open} className="full-size" zIndex={popup_zindex}

				beforeShowing={() => this.execute_event (this.props.beforeOpening)}
				afterHiding={() => this.execute_event (this.props.afterClosing)}>

				<link rel="stylesheet" href="/resources/styles/panels/gadgets/popup.window.css" />
				<div className="full-size popup-panel">
					{this.modal ? <div className="full-size centering-container popup-modal" /> : null}
					<div className="popup-window">
						<div className="popup-inset">
							{this.props.children}
							<SelectButton id="close_button" ref={this.create_reference} sticky={false} onclick={() => {
								globals.main_page.setState ({ popup_visible: false });
							}}>Close</SelectButton>
						</div>
					</div>
				</div>

			</FadeControl>
		);
	}// render;

}// PopupWindow;