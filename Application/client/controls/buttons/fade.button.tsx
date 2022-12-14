import React from "react";
import SelectButton from "./select.button";

import BaseControl, { DefaultProps, DefaultState } from "client/controls/base.control";
import BaseFadePanel from "client/controls/panels/base.fade.panel";


interface FadeButtonProps extends DefaultProps { 
	static?: boolean;
	visible?: boolean;
	onClick?: Function;
}// FadeButtonProps;

interface FadeButtonState extends DefaultState {}


export default class FadeButton extends BaseControl<FadeButtonProps, FadeButtonState> {

	public static defaultProps: FadeButtonProps = { 
		static: true,
		visible: true,
		onClick: null
	}// defaultProps;

	public render () {
		return (
			<BaseFadePanel visible={this.props.visible} static={this.props.static}>
				<SelectButton onClick={this.props.onClick}>{this.props.children}</SelectButton>
			</BaseFadePanel>
		);
	}// render;

}// FadeButton;