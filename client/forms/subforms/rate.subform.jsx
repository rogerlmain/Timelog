import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";
import CurrencyInput from "client/controls/inputs/currency.input";

import Container from "client/controls/container";

import { blank } from "client/classes/types/constants";
import { numeric_value, nested_value } from "client/classes/common";
import { page_names } from "client/master";

import { MasterContext } from "client/classes/types/contexts";


export const rate_types = {
	hourly		: 1,
	flat_rate	: 2,
}// rate_types;


export default class RateSubform extends BaseControl {


	state = { 
		project_rate: null,
		client_rate: null,
		current_rate: null,
	}// state;


	static defaultProps = { 
		clientId: null,
		projectId: null,
		onChange: null,
	}// defaultProps;


	static contextType = MasterContext;


	componentDidMount () {
		ProjectStorage.default_rate (this.props.projectId).then (result => this.setState ({ project_rate: result }, () => {
			ClientStorage.default_rate (this.props.clientId).then (result => this.setState ({ client_rate: result }, () => {
				this.setState ({ current_rate: this.state.project_rate ?? this.state.client_rate ?? OptionsStorage.default_rate () ?? 0 });
			}));
		}));
		return false;
	}// componentDidMount;


	render () {

		let company_rate = OptionsStorage.default_rate ();
		let project_rate = (this.state.current_rate ?? blank);

		let company_rate_selected = (company_rate == this.state.current_rate);
		let client_rate_selected = (this.state.client_rate == this.state.current_rate);

		let input_key = (company_rate_selected | (client_rate_selected << 1 ));


		return <Container visible={OptionsStorage.can_bill ()}>
			<label htmlFor="billing_rate">Rate</label>
			<div className="one-piece-form">


				<div className="left-aligned">
					<CurrencyInput key={input_key} id="billing_rate" className="rate-field" maxLength={3}
						defaultValue={project_rate} disabled={this.props.disabled} onBlur={this.props.onChange} 
						onInput={event => this.setState ({ current_rate: numeric_value (event.target.value) })}>
					</CurrencyInput>
				</div>

				<div className="vertically-spaced-out">

					<input key={company_rate_selected} type="checkbox" id="company_default" name="company_default" title="Use the company default"
						defaultChecked={company_rate_selected}
						onChange={event => 
						this.setState ({ current_rate: company_rate })}>
					</input>

					<Container visible={(nested_value (this.context, "master_page", "state", "page") == page_names.projects) && (company_rate != this.state.client_rate)}>
						<input key={client_rate_selected} type="checkbox" id="client_default" name="client_default" title="Use this client's default"
							defaultChecked={client_rate_selected}
							onChange={() => this.setState ({ current_rate: this.state.client_rate })}>
						</input>
					</Container>

				</div>

			</div>
		</Container>
	}// render;

}// RateSubform;