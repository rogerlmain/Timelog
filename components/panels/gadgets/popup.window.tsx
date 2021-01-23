import React from "react";

import BaseControl, { defaultInterface } from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";


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
		let window = (<div className="popup-window">{this.props.children}</div>);
		if (this.modal) window = <div className="full-size centering-container popup-modal">{window}</div>;
		return (
			<div id={this.id} className="full-size" style={{ ...this.props.style }}>
				<link rel="stylesheet" href="/resources/styles/panels/gadgets/popup.window.css" />
				{/* <FadeControl visible={this.props.open} beforeShowing={() => { alert ("about to show"); }}> */}
					<div className="full-size popup-panel">{window}</div>
				{/* </FadeControl> */}
			</div>
		);
	}// render;

}// PopupWindow;