import * as common from "classes/common";

import BaseControl, { DefaultProps } from "controls/base.control";


interface overflowControlInterface extends DefaultProps {
	control_panel: any;
	main_panel: any;
}// overflowControlInterface;


const offset = 25;


export default class OverflowControl extends BaseControl<overflowControlInterface> {


	public componentDidUpdate () {

		let control = this.props.control_panel;

		if (common.is_null (control)) return;

		let control_rect = this.props.control_panel.getBoundingClientRect ();
		let main_rect = this.props.main_panel.getBoundingClientRect ();

		let difference = control_rect.bottom - main_rect.bottom;

		if (difference <= -offset) return;

		control.style.overflowY = "scroll";
		control.style.height = Math.round (control_rect.height) - (difference + offset);

	}// componentDidUpdate;


	render () { return this.props.children; }

}// OverflowControl;