import React from "react";
import Clock from "react-clock";
import NumberPicker from "controls/number.picker";

import BaseControl from "controls/base.control";


export default class TimePicker extends BaseControl {

	static defaultProps = { 
		value: null,
		onChange: null 
	}// defaultProps;


	render () {

		let military_hours = (this.props.value.getHours () % 12);
		let hours = military_hours ? military_hours : 12;

		return <div>
			
			<Clock id="test_clock" value={this.props [this.state.boundary]} renderSecondHand={false} />

			<div className="four-column-grid" style={{ marginTop: "1em", border: "solid 1px red" }}>
				<NumberPicker id="hours" min="1" max="12" value={hours} />
				<NumberPicker id="minutes" min="0" max="59" value={this.props.value.getMinutes ()} />
				<div id="meridian">
					<div className={military_hours < 13 ? "selected" : null}>AM</div>
					<div className={military_hours > 12 ? "selected" : null}>PM</div>
				</div>
			</div>

		</div>
	}// render;

}// TimePicker;
