import React from "react";

import BaseControl, { DefaultProps } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import SelectButton from "controls/buttons/select.button";

import { globals } from "types/globals";
import { popup_zindex } from "types/constants";


interface popupWindowInterface extends DefaultProps {
	open: any,
	modal: boolean,

	beforeOpening?: any,
	afterClosing?: any
}// popupWindowInterface;


export default class PopupWindow extends BaseControl<popupWindowInterface> {


	private modal = null;


	/********/


	public props: popupWindowInterface;


	public constructor (props) {
		super (props);
		this.modal = this.props.modal ?? true;
	}// componentDidMount;


	public render () {
		return (
			<ExplodingPanel visible={this.props.open} className="full-size" /* zIndex={popup_zindex} - probably redundant (use css?) */

				beforeShowing={() => this.execute (this.props.beforeOpening)}
				afterHiding={() => this.execute (this.props.afterClosing)}>

				<link rel="stylesheet" href="/resources/styles/pages/gadgets/popup.window.css" />
				<div className="full-size popup-panel">
					{this.modal ? <div className="full-size centering-container popup-modal" /> : null}
					<div className="popup-window">
						<div className="popup-inset">
							{this.props.children}
							<SelectButton id="close_button" sticky={false} onClick={() => {
								globals.master_panel.setState ({ popup_visible: false });
							}}>Close</SelectButton>
						</div>
					</div>
				</div>

			</ExplodingPanel>
		);
	}// render;

}// PopupWindow;