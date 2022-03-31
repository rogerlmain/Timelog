import * as common from "classes/common";

import React from "react";

import BaseControl from "controls/abstract/base.control";
import SelectList from "controls/select.list";

import LookupsModel from "models/lookups";


const us_country_code = 189;


export default class AddressForm extends BaseControl {


	state = {

		countries: null,
		districts: null,

		active_districts: null,

		country_id: us_country_code,
		district_id: 0

	}/* state */;


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
			<div className="horizontally-spaced-out">

				<input type="text" id="company_name" name="company_name" style={{ width: "17em", marginRight: "1em" }} />

				<div className="one-piece-form">
					<label htmlFor="use_account_name" className="mini-title">Just use<br />my name</label>
					<input type="checkbox" id="use_account_name" name="use_account_name" style={{ columnWidth: "min-content" }} />
				</div>

			</div>

			<break />

			<label htmlFor="street_address">Street address</label>
			<input type="text" id="street_address" name="street_address" />

			<input type="text" id="additional_address" name="additional_address" style={{ gridColumn: "2" }} />

			<label htmlFor="state">City</label>
			<div className="horizontally-spaced-out">

				<input type="text" id="city" name="city" style={{ width: "8em" }} maxLength={85} />

				<div className="one-piece-form">
					<label htmlFor="zip" title="Zip or Postal Code">Post Code</label>
					<input type="text" id="zip" name="zip"  style={{ width: "8em" }} maxLength={16}  />
				</div>

			</div>

			<label htmlFor="state" title="District, state or province">District</label>
			<SelectList id="district" data={this.state.active_districts} idField="id" textField="long_name" 
				style={{ width: "100%" }}
				hasHeader={true} maxLength={128} value={this.state.district_id}>
			</SelectList>

			<label htmlFor="country">Country</label>
			<SelectList id="country" data={this.state.countries} idField="id" textField="short_name" 
				value={this.state.country_id} onChange={event => this.setState ({ country_id: event.target.value })}>
			</SelectList>

			<break />

			<label htmlFor="primary_phone">Main phone number</label>
			<input type="text" id="primary_phone" name="primary_phone" className="full-width" maxLength={85} />
 
			<label htmlFor="second_phone">Second phone number</label>
			<input type="text" id="second_phone" name="second_phone" className="full-width" maxLength={85} />

		</div>
	}// render;

}// AddressForm;