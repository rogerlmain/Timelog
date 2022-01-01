import * as React from "react";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import BaseFadePanel from "controls/panels/base.fade.panel";
import ResizePanel from "controls/panels/resize.panel";

import { globals } from "types/globals";


interface ExplodingPanelProps extends DefaultProps {

	visible: boolean;
	static?: boolean;
	pulsing?: boolean;	// Determines if 

	speed?: number;

	beforeShowing?: Function;
	beforeHiding?: Function;
	afterShowing?: Function;
	afterHiding?: Function;

}// ExplodingPanelProps;


interface ExplodingPanelState extends DefaultState {
	resize_open: boolean;
	fade_visible: boolean;
}// ExplodingPanelState;


export default class ExplodingPanel extends BaseControl<ExplodingPanelProps, ExplodingPanelState> {

	public static defaultProps: ExplodingPanelProps = {

		visible: false,
		static: true,

		speed: globals.settings.animation_speed,

		beforeShowing: null,
		beforeHiding: null,
		afterShowing: null,
		afterHiding: (callback: Function) => callback ()

	}// ExplodingPanelProps;


	public state: ExplodingPanelState = {
		resize_open: false,
		fade_visible: false
	}// state;


	public componentDidMount(): void {
		if (this.props.visible && this.props.static) this.setState ({
			resize_open: true,
			fade_visible: true
		});
	}// componentDidMount;


	public componentDidUpdate (): void {
		if (this.props.visible && !this.state.resize_open) this.setState ({ resize_open: true });
		if (!this.props.visible && this.state.fade_visible) this.setState ({ fade_visible: false });
	}// componentDidUpdate;


	public render () {
		return (
			<div {...this.controlStyleClass ()}>
				<ResizePanel visible={this.state.resize_open} speed={Math.floor (this.props.speed / 2)} static={this.props.static}
					beforeOpening={() => this.execute (this.props.beforeShowing)}
					afterOpening={() => this.setState ({ fade_visible: true })}
					afterClosing={() => this.execute (this.props.afterHiding)}>

					<BaseFadePanel visible={this.state.fade_visible} speed={Math.floor (this.props.speed / 2)} static={this.props.static}
						beforeHiding={() => this.execute (this.props.beforeHiding)}
						afterHiding={() => (this.props.pulsing ? this.setState ({ resize_open: false }) : this.execute (this.props.afterHiding, () => this.setState ({ resize_open: false })))}
						afterShowing={() => this.execute (this.props.afterShowing)}>

						{this.children ()}

					</BaseFadePanel>

				</ResizePanel>
			</div>

		);
	}// render;

	

}// ExplodingPanel;