import React from "React";
import BaseControl from "client/controls/abstract/base.control";


export default class CompanyAddressForm extends BaseControl {


	render () { 
// company_name: "Roger Main Programming Company",

// address_line_1: "6795 West 19th Place",
// address_line_2: "108",
// administrative_district_level_1: "Lakewood",
// locality: "Colorado",
// postal_code: "80214",
// country: "US"

// phone_number: "7203225154"

		return <div>

			<label htmlFor="company_name">Company</label>
			<input type="text" id="company_name" />

			<label htmlFor="address_1">Address</label>
			<input type="text" id="address_1" />

			<div />
			<input type="text" id="address_2" />

			<label htmlFor="city">City</label>
			<input type="text" id="city"  />

			<label htmlFor="state">State / Province</label>
			<input type="text" id="state" />

			<label htmlFor="postcode">Postal (Zip) Code</label>
			<input type="text" id="postcode" />

			<label htmlFor="country">Country</label>
			<select id="country" name="country">
				<option>USA</option>
			</select>

		</div>
	}// render;

}// CompanyAddressForm;