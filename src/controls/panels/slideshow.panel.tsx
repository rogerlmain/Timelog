import * as React from "React";

import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";
import { globals } from "types/globals";


interface SlideshowPanelProps extends DefaultProps {
	index: number;
	visible?: boolean;
	static?: boolean;
	pulsing?: boolean;
	speed?: number;

	beforeShowing?: Function;
	afterShowing?: Function;

	beforeHiding?: Function;
	afterHiding?: Function;
}// SlideshowPanelProps;


interface SlideshowPanelState extends DefaultState {
	active_index: number;
	contents: any;
	visible: boolean;
}// SlideshowPanelProps;


export default class SlideshowPanel extends BaseControl<SlideshowPanelProps, SlideshowPanelState> {


	public static defaultProps: SlideshowPanelProps = {
		index: 0,
		visible: false,
		static: false,
		pulsing: true,

		speed: globals.settings.animation_speed,

		beforeShowing: null,
		afterShowing: null,

		beforeHiding: null,
		afterHiding: null
	}// defaultProps;


	public state: SlideshowPanelState = {
		visible: this.props.visible,
		active_index: this.props.index,
		contents: null
	}// SlideshowPanelState;


	public componentDidUpdate (): void {
		if (this.state.active_index == this.props.index) return;
		this.setState ({ visible: false });
	}// shouldComponentUpdate;


	public render () {
		return (
			<ExplodingPanel visible={this.state.visible} speed={this.props.speed} static={true} pulsing={this.props.pulsing}
			
				beforeShowing={this.props.beforeShowing}
				afterShowing={this.props.afterShowing}

				beforeHiding={this.props.beforeHiding}
				afterHiding={() => this.setState ({ active_index: this.props.index }, () => this.setState ({ visible: true }, this.props.afterHiding))}>

				{(this.state.active_index == 0) ? null : this.props.children [this.state.active_index - 1]}
			</ExplodingPanel>
		);
	}// render;

}// SlideshowPanel;