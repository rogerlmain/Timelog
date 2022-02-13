import React from "react";
import ReactDOMServer from "react-dom/server";

import * as common from "classes/common";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import FadePanel from "controls/panels/fade.panel";
import ResizePanel from "controls/panels/resize.panel";

import { globals } from "types/globals";


interface ExplodingPanelProps extends DefaultProps {

	id: string;

	static?: boolean;

	speed?: number;

	beforeShowing?: Function;
	beforeHiding?: Function;

	afterShowing?: Function;
	afterHiding?: Function;

}// ExplodingPanelProps;


interface ExplodingPanelState extends DefaultState {
	resizing: boolean;
	fade_visible: boolean;
	children: any;
}// ExplodingPanelState;


export default class ExplodingPanel extends BaseControl<ExplodingPanelProps, ExplodingPanelState> {


	public static defaultProps: ExplodingPanelProps = {

		id: null,

		static: true,

		speed: globals.settings.animation_speed,

		beforeShowing: null,
		beforeHiding: null,

		afterShowing: null,
		afterHiding: null

	}// ExplodingPanelProps;


	public state: ExplodingPanelState = {
		resizing: false,
		fade_visible: true,
		children: null
	}// state;


	public componentDidMount (): void {
		this.setState ({ children: this.props.children });
	}// componentDidMount;


	public componentDidUpdate (): any {
		if (this.same_element (this.state.children, this.props.children)) return;
		if (this.state.fade_visible) this.setState ({ fade_visible: false });
	}// componentDidUpdate;


	public render () {

		if (common.is_null (this.props.id)) throw "Exploding panel requires an ID";

		return (

			<ResizePanel id={`${this.props.id}_exploding_panel`} speed={Math.floor (this.props.speed / 2)} resize={this.state.resizing}

				afterResizing={() => this.setState ({ 
					resizing: false,
					fade_visible: true
				})}>

				<FadePanel id={`${this.props.id}_exploding_panel`} visible={this.state.fade_visible} speed={Math.floor (this.props.speed / 2)} static={this.props.static} 

					beforeHiding={() => this.execute.bind (this) (this.props.beforeHiding)}

					afterHiding={() => this.setState ({ children: this.props.children }, () => {
						this.execute.bind (this) (this.props.afterHiding);
						this.setState ({ resizing: true });
					})}

					beforeShowing={() => this.execute.bind (this) (this.props.beforeShowing)}
					afterShowing={() => this.execute.bind (this) (this.props.afterShowing)}>

					{this.state.children}

				</FadePanel>

			</ResizePanel>
		);
	}// render;


}// ExplodingPanel;