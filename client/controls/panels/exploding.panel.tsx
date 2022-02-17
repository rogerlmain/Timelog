import React from "react";

import * as common from "classes/common";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import FadePanel from "controls/panels/fade.panel";
import ResizePanel from "controls/panels/resize.panel";

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
	resize: boolean;
	visible: boolean;	
}// ExplodingPanelState;


export default class ExplodingPanel extends BaseControl<ExplodingPanelProps, ExplodingPanelState> {


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
		resize: false,
		visible: false
	}// state;


	public componentDidMount(): void {
		if (common.isset (this.props.children)) this.setState ({ visible: true });
	}// componentDidMount;


  	public shouldComponentUpdate (next_props: Readonly<ExplodingPanelProps>, next_state: Readonly<ExplodingPanelState>, next_context: any): boolean {

		// let updated = common.isset (next_state.children) && (!this.same_element (next_state.children, next_props.children));

		// if (updated) {
		// 	switch (next_state.visible) {
		// 		case true: this.setState ({ visible: false }); break;
		// 		default: 

		this.setState ({ children: next_props.children });  // break;

		// 	}// switch;
 		// 	return false;
		// }// if;

 		// return updated; 
		return true;

  	}// shouldComponentUpdate;


	public render () {

		let target_speed = Math.floor (this.props.speed / 2);

		if (common.is_null (this.props.id)) throw "Exploding panel requires an ID";


		return (

			<div style={{ border: "solid 1px red"}}>

			<FadePanel id={`${this.props.id}_exploding_panel_fade_panel`} speed={target_speed}
				visible={(() => {
					
					return this.state.visible
				
				})()} 
				
				>

				<ResizePanel id={`${this.props.id}_exploding_panel_resize_panel`} speed={target_speed} resize={this.state.resize}
					afterResizing={() => this.setState ({ visible: true })}>

{/*
					beforeHiding={() => this.execute.bind (this) (this.props.beforeHiding)}

					afterHiding={() => this.setState ({ children: this.props.children }, () => {
						this.execute.bind (this) (this.props.afterHiding);
						this.setState ({ resizing: true });
					})}

					beforeShowing={() => this.execute.bind (this) (this.props.beforeShowing)}
					afterShowing={() => this.execute.bind (this) (this.props.afterShowing)}>
*/}

					{this.state.children}

				</ResizePanel>
			</FadePanel>

			</div>
		);
	}// render;


}// ExplodingPanel