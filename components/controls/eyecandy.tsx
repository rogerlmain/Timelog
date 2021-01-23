import * as React from "react";

import BaseControl from "./base.control";
import FadeControl from "./fade.control";


interface eyecandy {
	visible: boolean;

	text: String;
	subtext?: String;

	beforeShowing?: any;
	afterShowing?: any;
	afterHiding?: any;
}// eyecandy;


export default class Eyecandy extends BaseControl<eyecandy> {

	render () {

		var subtext = (this.props.subtext != null) ? <div>{this.props.subtext}</div> : null;

		return (
			<FadeControl id={this.id_badge ("Eyecandy")} visible={this.props.visible}

				beforeShowing={this.props.beforeShowing}
				afterShowing={this.props.afterShowing}
				afterHiding={this.props.afterHiding}>

				<div className="eyecandy-cell">
					<div><img src="resources/images/eyecandy.gif" /></div>
					<div>
						<div>{this.props.text}</div>
						{subtext}
					</div>
				</div>
			</FadeControl>
		);
	}// render;

}// FadeControl;