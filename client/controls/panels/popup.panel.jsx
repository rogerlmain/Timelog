import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";

import { not_set } from "client/classes/common";


export default class PopupPanel extends BaseControl {

	static defaultProps = { 
		onDesktopClick: null,
		visible: true,
	}// defaultProps;


	main_panel = React.createRef ();


	/********/

	
	componentDidMount () {
		if (not_set (this.main_panel.current)) return;
		this.main_panel.current.addEventListener ("onDesktopClick", this.props.onDesktopClick);
	}// componentDidMount;


	render () {
		return <div ref={this.main_panel} style={{ ...this.props.style, position: "absolute" }} onClick={event => event.stopPropagation ()}>
			<FadePanel id={`${this.props.id}_fade_panel`} visible={this.props.visible}>{this.props.children}</FadePanel>
		</div>
	}// render;

}// PopupPanel;
