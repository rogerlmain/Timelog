import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import FadePanel from "client/controls/panels/fade.panel";

import { not_set } from "client/classes/common";

import "resources/styles/pages/gadgets/popups.css";


export default class PopupPanel extends BaseControl {


	state = { showing: false }


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

		let styles = {
			...this.props.style,
			position: "absolute",
			zIndex: (this.state.showing ? 1 : -1)
		}// styles;

		if (!this.state.showing) styles = { ...styles, width: 0, height: 0 }

		return <div id={this.props.id ?? "popup_panel"} ref={this.main_panel} className="popup-panel" style={styles} onClick={event => event.stopPropagation ()}>
			<FadePanel id={`${this.props.id}_fade_panel`} 

				beforeShowing={() => this.setState ({ showing: true })}
				afterHiding={() => this.setState ({ showing: false })}

				visible={this.props.visible}>

				{this.props.children}

			</FadePanel>
		</div>
	}// render;

}// PopupPanel;
