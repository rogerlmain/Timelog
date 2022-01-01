import * as React from "react";

import BaseControl, { DefaultProps } from "./base.control";


interface eyecandyInterface extends DefaultProps {
	text: String;
	subtext?: String;
}// eyecandyInterface;


export default class Eyecandy extends BaseControl<eyecandyInterface> {

	public props: eyecandyInterface;

	render () {
		return (
			<div className="eyecandy-cell">
				<div><img src="resources/images/eyecandy.gif" /></div>
				<div>
					<div>{this.props.text ?? "Processing..."}</div>
					<div>{this.props.subtext ?? "One moment, please"}</div>
				</div>
			</div>
		);
	}// render;

}// ExplodingPanel;