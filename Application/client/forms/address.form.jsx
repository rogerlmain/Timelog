import React from "react";

import AccountStorage from "client/classes/storage/account.storage";

import DynamicInput from "client/controls/inputs/dynamic.input";
import SelectList from "client/controls/lists/select.list";
import Container from "client/controls/container";

import BaseControl from "client/controls/abstract/base.control";
import PhoneNumberInput from "client/controls/inputs/phone.number.input";

import LookupsModel from "client/classes/models/lookups.model";

import { blank } from "client/classes/types/constants";
import { isset, is_null, not_set } from "client/classes/common";


const us_country_code = 236;
const default_district_name = "District";


export default class AddressForm extends BaseControl {


	name_checkbox = React.createRef ();


	state = {

		countries: null,
		districts: null,

		active_districts: null,

		country_id: us_country_code,
		district_id: null,

		company_name: blank,

	}/* state */;


	get_country () {
		if (isset (this.state.countries)) for (let country of this.state.countries) {
			if (country.id == this.state.country_id) return country;
		}// if;
		return null;
	}// get_country;


	get_district () {
		if (isset (this.state.districts)) for (let district of this.state.districts) {
			if (district.id == this.state.district_id) return district;
		}// if;
		return null;
	}// get_district;


	district_name () {

		let district = this.get_district ();

		if (is_null (this.state.countries) || is_null (this.state.country_id)) return default_district_name;
		if (is_null (this.state.district_id)) return this.get_country ().description ?? default_district_name;

		return (isset (district) && isset (district.description)) ? district.description : default_district_name;

	}// district_name;


	componentDidMount () {
		LookupsModel.get_countries ().then (result => this.setState ({ countries: result }, () => {
			LookupsModel.get_districts ().then (result => this.setState ({ districts: result }));
		}));


this.setState ({
	company_name: "Betty's Boutique",
	district_id: 277
});


	}// componentDidMount;


	shouldComponentUpdate (new_props, new_state) {
		if  ((is_null (this.state.districts) && isset (new_state.districts)) || (new_state.country_id != this.state.country_id)) {

			let districts = null;

			for (let district of new_state.districts) {
				if (district.reference_id != new_state.country_id) continue;
				if (is_null (districts)) districts = new Array ();
				districts.push (district);
			}// for;

			this.setState ({ active_districts: districts });
			return false;

		}// if;
		return true;
	}// shouldComponentUpdate;


	render () {

		return <div className="vertically-spaced-out">
		
			<div className="span-columns fully-centered">
				<div className="one-piece-form">

					<label htmlFor="company_name">Company name</label>
					<div className="horizontally-spaced-out">

						<DynamicInput id="company_name" value={this.state.company_name} required={true} style={{ width: "16em", marginRight: "1em" }} 
							onChange={event => this.name_checkbox.current.checked = event.target.value.equals (AccountStorage.friendly_name ())}>
						</DynamicInput>

						<div className="one-piece-form">
							<label htmlFor="use_account_name_for_company" className="mini-title">Just use<br />my name</label>
							<input id="use_account_name_for_company" name="use_account_name_for_company" ref={this.name_checkbox}
								type="checkbox" style={{ columnWidth: "min-content" }}
								onChange={event => this.setState ({ company_name: event.target.checked ? AccountStorage.friendly_name () : blank })}>
							</input>
						</div>

					</div>

				</div>
			</div>

			<div className="span-columns fully-centered">
				<div className="one-piece-form">
					
					<label htmlFor="street_address">Street address</label>
					<input type="text" id="street_address" name="street_address" required={true}
					
		defaultValue="6795 West 19th Pl." />

					<input type="text" id="additional_address" name="additional_address" style={{ gridColumn: "2" }}
					
		defaultValue="108" />

					<label htmlFor="state">City</label>
					<div className="horizontally-spaced-out">

						<input type="text" id="city" name="city" style={{ width: "10em" }} maxLength={85} required={true}
						
		defaultValue="Lakewood" />

						<div className="one-piece-form" style={{ marginLeft: "1em" }}>
							<label htmlFor="zip" title="Zip or Postal Code">Post Code</label>
							<input type="text" id="zip" name="zip"  style={{ width: "5em" }} maxLength={16} required={true} 
		defaultValue="80214" />
						</div>

					</div>

					<label htmlFor="district" title="District, state or province">{this.district_name ()}</label>
					<Container visible={not_set (this.state.active_districts)}>
						<input type="text" id="district" name="district" maxLength={255} />
					</Container>
					<Container visible={isset (this.state.active_districts)}>
						<SelectList id="district" data={this.state.active_districts} idField="id" textField="long_name" 
							style={{ width: "100%" }} required={true} header={blank}
							selectedValue={this.state.district_id} onChange={event => this.setState ({ district_id: event.target.value })}>
						</SelectList>
					</Container>

					<label htmlFor="country">Country</label>
					<SelectList id="country" data={this.state.countries} idField="id" textField="long_name" 
						style={{ width: "100%" }} required={true}
						selectedValue={this.state.country_id} onChange={event => this.setState ({ 
							country_id: event.target.value,
							district_id: null
						})}>
					</SelectList>

				</div>
			</div>

			<div className="span-columns fully-centered">
				<div className="one-piece-form">

					<label htmlFor="primary_phone">Main phone</label>
					<PhoneNumberInput id="primary_phone" name="primary_phone" 
						className="full-width" style={{ width: "10em" }} maxLength={85} 
						country_id={this.state.country_id} required={true}
						
	defaultValue="+1 (720) 322-5154"
						
						>
					</PhoneNumberInput>

					<label htmlFor="second_phone">Second phone</label>
					<PhoneNumberInput id="second_phone" name="second_phone" 
						className="full-width" style={{ width: "10em" }} maxLength={85}
						country_id={this.state.country_id}>
					</PhoneNumberInput>

				</div>
			</div>


			<div className="one-piece-form">

				<label htmlFor="email">Email</label>
				<input type="email" id="email_address" name="email_address" className="full-width" maxLength={255} required={true}
				
	//defaultValue="rex@rogerlmain.com" />
	defaultValue="joe@bloggs.com" />


			</div>

		</div>
	}// render;

}// AddressForm;