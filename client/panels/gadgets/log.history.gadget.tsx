import * as common from "client/classes/common";

import BaseControl, { DefaultProps } from "controls/base.control";
import { text_highlights } from "client/types/constants";
import TimeFormatter from "client/types/time.format";
import React from "react";


interface logHistoryGadgetInterface extends DefaultProps {
	entries?: any;
}// logHistoryGadgetInterface;


export default class LogHistoryGadget extends BaseControl<logHistoryGadgetInterface> {


	protected references = { history_panel: null }


	/********/


	public render () {

		let response = (
			<div id="history_panel" ref={this.props.dom_control}>

				<div className="log-title">
					<div>Start Time</div>
					<div>End Time</div>
					<div>Logged Time</div>
				</div>

				{common.isset (this.props.entries) ? this.props.entries.map ((item: any) => {
					let elapsed_time = Math.round (((common.isset (item.end_time) ? Date.parse (item.end_time) : new Date ().getTime ()) - Date.parse(item.start_time)) / 1000);
					let overtime_hours = elapsed_time / 3600;
					let overtime = (overtime_hours > 24) ? text_highlights.error : (overtime_hours > 8) ? text_highlights.warning : null;
					let end_time = common.isset (item.end_time) ? TimeFormatter.format (item.end_time, TimeFormatter.formats.compact) : null;
					return (
						<div key={item.entry_id} className="log-entry">
							<div>{TimeFormatter.format (item.start_time, TimeFormatter.formats.compact)}</div>
							<div>{end_time}</div>
							<div style={overtime}>{TimeFormatter.elapsed (elapsed_time)}</div>
						</div>
					);
				}) : null}
			</div>
		);

		return response;

	}// render;

}// LogHistoryGadget;


