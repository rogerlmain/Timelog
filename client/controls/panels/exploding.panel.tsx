import React from "react";

import * as common from "classes/common";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ResizePanel, { iResizable, resize_state } from "controls/panels/resize.panel";
import FadePanel from "controls/panels/fade.panel";

import { globals } from "types/globals";


interface ExplodingPanelProps extends DefaultProps {

	id: string;

	speed?: number;

	beforeShowing?: Function;
	beforeHiding?: Function;

	afterShowing?: Function;
	afterHiding?: Function;

}// ExplodingPanelProps;


interface ExplodingPanelState extends DefaultState {

	children: any;

	resize: resize_state;

	animate: boolean;
	visible: boolean;	

}// ExplodingPanelState;


export default class ExplodingPanel extends BaseControl<ExplodingPanelProps, ExplodingPanelState> implements iResizable {


	public static defaultProps: ExplodingPanelProps = {

		id: null,

		speed: globals.settings.animation_speed,

		beforeShowing: null,
		beforeHiding: null,

		afterShowing: null,
		afterHiding: null

	}// ExplodingPanelProps;


	public state: ExplodingPanelState = {

		children: null,

		resize: resize_state.false,

		animate: false,
		visible: false

	}// state;


	public constructor (props: ExplodingPanelProps) {
		super (props);
		this.state.children = this.props.children;
		this.state.visible = common.isset (this.props.children);
	}// constructor;


	public componentDidMount = () => this.setState ({ animate: true });


	public shouldComponentUpdate (next_props: Readonly<ExplodingPanelProps>, next_state: Readonly<ExplodingPanelState>, next_context: any): boolean {

		let updated = !this.same_element (next_state.children, next_props.children);

		if (updated) switch (next_state.visible) {
			case true: this.setState ({ visible: false }); break;
			default: this.setState ({ children: next_props.children }, () => this.setState ({ resize: resize_state.animate })); break;
		}// if / switch;

 		return true; 

  	}// shouldComponentUpdate;


	public render () {

		let target_speed = Math.floor (this.props.speed / 2);

		if (common.is_null (this.props.id)) throw "Exploding panel requires an ID";

		return (

			<div style={{ border: "solid 1px red"}}>

			<FadePanel id={`${this.props.id}_exploding_panel_fade_panel`} speed={target_speed} animate={this.state.animate} visible={this.state.visible}
				afterHiding={() => this.setState ({ children: this.props.children }, () => this.setState ({ resize: resize_state.animate }))}
				afterShowing={() => this.execute (this.props.afterShowing)}>

				<ResizePanel id={`${this.props.id}_exploding_panel_resize_panel`} 
					speed={target_speed} resize={this.state.resize} parent={this}
					afterResizing={() => this.setState ({ visible: true })}>

					{this.state.children}

				</ResizePanel>
				
			</FadePanel>

			</div>
		);
	}// render;


}// ExplodingPanel