import * as common from "classes/common";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import SelectList from "controls/select.list";

import LookupsModel from "models/lookups";


const us_country_code = 189;


export default class DeluxeAccountForm extends BaseControl {


	state = {

		countries: null,
		districts: null,

		active_districts: null,

		country_id: us_country_code,
		district_id: 0

	}/* state */;


	get_country_districts (districts) {
	}// get_country_districts;


	componentDidMount () {
		LookupsModel.get_countries ().then (result => this.setState ({ countries: result }, () => {
			LookupsModel.get_districts ().then (result => this.setState ({ districts: result }));
		}));
	}// componentDidMount;


	shouldComponentUpdate (new_props, new_state) {
		if  (common.is_null (this.state.districts) && (common.isset (new_state.districts)) || (new_state.country_id != this.state.country_id)) {

			let districts = null;

			for (let district of new_state.districts) {
				if (district.reference_id != new_state.country_id) continue;
				if (common.is_null (districts)) districts = new Array ();
				districts.push (district);
			}// for;

			this.setState ({ active_districts: districts });
			return false;

		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {

		return <div className="one-piece-form">

			<label>Company name</label>
			<div className="one-piece-subform">
				<input type="text" id="company_name" name="company_name" />
				<label htmlFor="use_account_name">Use my name</label>
				<input type="checkbox" id="use_account_name" name="use_account_name" style={{ columnWidth: "min-content" }} />
			</div>

			<label htmlFor="street_address">Street address</label>
			<input type="text" id="street_address" name="street_address" />

			<input type="text" id="additional_address" name="additional_address" style={{ gridColumn: "2" }} />

			<label htmlFor="state">City</label>
			<div className="two-piece-subform">

				<input type="text" id="city" name="city" style={{ width: "8em" }} maxLength={85} />

				<label htmlFor="state" title="District, state or province">District</label>



				<SelectList id="district" data={this.state.active_districts} idField="id" textField="long_name" 
					hasHeader={true} maxLength={128} value={this.state.district_id} 
					
					style={{ width: "8em" }}
					>
					
				</SelectList>

				<label htmlFor="zip" title="Zip or Postal Code">Post Code</label>
				<input type="text" id="zip" name="zip"  style={{ width: "8em" }} maxLength={16}  />

			</div>

			<label htmlFor="country">Country</label>
			<SelectList id="country" data={this.state.countries} idField="id" textField="short_name" 
				value={this.state.country_id} onChange={event => 
{				
alert (event.target.value);					
					this.setState ({ country_id: event.target.value })
}					
				}>
			</SelectList>

		</div>
	}// render;

}// DeluxeAccountForm;