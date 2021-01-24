import React from "react";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import SelectButton from "components/controls/select.button";

import { globals } from "components/types/globals";


interface popupWindowInterface extends defaultInterface {
	open: any,
	modal: boolean
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
			<FadeControl id={this.id} ref={this.create_reference} visible={this.props.open} className="full-size"
				beforeShowing={() => {

					this.reference (this.id).dom_control.current.style.zIndex = 10

				}}
				afterHiding={() => {

					this.reference (this.id).dom_control.current.style.zIndex = -1

				}}>
				<link rel="stylesheet" href="/resources/styles/panels/gadgets/popup.window.css" />
				<div className="full-size popup-panel">
					{this.modal ? <div className="full-size centering-container popup-modal" /> : null}
					<div className="popup-window">
						<div className="popup-inset">
							{this.props.children}
							<SelectButton id="close_button" onclick={() => {
								globals.main_page.setState ({ popup_visible: false });
							}}>Close</SelectButton>
						</div>
					</div>
				</div>
			</FadeControl>
		);
	}// render;

}// PopupWindow;