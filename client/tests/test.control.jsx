import "regenerator-runtime/runtime.js";
import "classes/types/prototypes";

import "resources/styles/main.css";

import React from "react";

import Container from "controls/container";

import BaseControl		from "client/controls/abstract/base.control";

import { date_formats } from "client/classes/types/constants";
import { not_set, is_null } from "client/classes/common";



export default class TreeTest extends BaseControl {


	static defaultProps = { data: null }


	state = { data: null }


	format_data = data => {

		let result = null;

		if (not_set (data)) return result;

		data.forEach (item => {

			let start_time = Date.validated (item.start_time);

			let data_item = {
				...item,
				year: start_time.get_year (),
				month: start_time.get_month_name (),
				day: `${start_time.get_weekday_name ()} ${start_time.get_appended_day ()}`,
			}// data_item;

			if (is_null (result)) result = [];
			result.push (data_item);

		});

		this.setState ({ data: result });

	}/* format_data */;


	componentDidMount () {
		ReportsModel.fetch_by_project (163).then (data => this.format_data (data));
	}// componentDidMount;


	render () { 
		return <div id="report_panel">
		
		<ReportGrid data={this.state.data} fields={["year", "month", "day"]} 

			row={data => { 
				return <Container>
					<div style={{border: "solid 2px blue"}}>XXX{new Date (data.start_time).format (date_formats.report_datetime)}XXX</div>
					<div>{new Date (data.end_time).format (date_formats.report_datetime)}</div>
					<div onClick={() => alert (JSON.stringify (data))}>{data.notes}</div>
					<div>{data.total_time}</div>
					<Container visible={OptionStorage.can_bill ()}><div>{data.total_due}</div></Container>
					<Container visible={OptionStorage.can_bill ()}><CheckboxCell /></Container>
				</Container>
			}}
		
			footer={data => {
				return <Container>

{/* 					
					<div className="span-all-columns"><hr style={{borderColor: "blue"}} /></div>
					<div style={{ gridColumn: "1/3", border: "solid 2px green" }} />
*/}

					<div style={{ gridColumn: "1/3" }} />
					<div>Total Time</div>
					<div>Total Due</div>
					<CheckboxCell />

				</Container>
			}}>

		</ReportGrid>

		</div>

	}// render;


}// TreeTest;


