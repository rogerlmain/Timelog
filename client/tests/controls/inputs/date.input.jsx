import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";
import BaseControl from "client/controls/abstract/base.control";

import DateInput from "client/controls/inputs/date.input";


export default class LoadListTest extends BaseControl {


	state = { use_dates: false }


	/********/


	constructor (props) {
		super (props);
	}// constructor;


	/********/


	render () {
		return <div className="outlined full-width fully-centered" style={{ border: "solid 1px blue" }}>
			<div>

				<DateInput id="date_range_start" disabled={!this.state.use_dates} value={this.state.start_date} onChange={value => this.setState ({ start_date: value })} />

				<br /><br />

				<div className="horizontally-aligned">
					<input type="checkbox" id="use_date_range" onClick={event => this.setState ({ use_dates: event.target.checked })} />
					<label htmlFor="use_date_range">Date range</label>
				</div>

				<br /><br />

				<div className="two-column-grid">
					<button onClick={() => this.setState ({ client_data: this.client_list ()})}>Load clients</button>
					<button onClick={() => this.forceRefresh ()}>Force refresh</button>
				</div>

			</div>
		</div>
	}// render;


}// LoadListTest;


