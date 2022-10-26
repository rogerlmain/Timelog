import React from "react";

import OptionsStorage from "client/classes/storage/options.storage";
import ClientStorage from "client/classes/storage/client.storage";
import ProjectStorage from "client/classes/storage/project.storage";

import BaseControl from "client/controls/abstract/base.control";
import CurrencyInput from "client/controls/inputs/currency.input";

import Container from "client/controls/container";

import { isset } from "client/classes/common";
import { MasterContext } from "client/classes/types/contexts";


export const max_rate_length = 5;


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

		defaultValue: null,

		clientId: null,
		projectId: null,

		onChange: null,

	}// defaultProps;


	static contextType = MasterContext;


	/********/


	active_rate = () => this.props.defaultValue ?? this.state.project_rate ?? this.state.client_rate ?? OptionsStorage.default_rate () ?? 0;


	/********/


	componentDidMount () {
		ProjectStorage.project_rate (this.props.projectId).then (result => this.setState ({ project_rate: result }, () => {
			ClientStorage.client_rate (this.props.clientId).then (result => this.setState ({ client_rate: result }, () => {
				this.setState ({ current_rate: this.active_rate () });
			}));
		}));
	}// componentDidMount;


	render () {

		let company_rate = OptionsStorage.default_rate ();

		let control_id = this.props.id ?? "billing_rate";
		let company_checkbox_id = `${control_id}_company_default`;
		let client_checkbox_id = `${control_id}_client_default`;

		let company_rate_selected = (company_rate == this.state.current_rate);
		let client_rate_selected = (this.state.client_rate == this.state.current_rate);

		return <Container visible={OptionsStorage.can_bill ()}>

			<label htmlFor={control_id}>Rate</label>

			<div className="one-piece-form">

				<div className="left-aligned">
					<CurrencyInput id={control_id} className="rate-field" maxLength={max_rate_length}
						defaultValue={(this.state.current_rate ?? 0)} disabled={this.props.disabled} onBlur={this.props.onChange} 
						onChange={value => this.setState ({current_rate: value})}>
					</CurrencyInput>
				</div>

				<div className="vertically-spaced-out">

					<input key={company_rate_selected} type="checkbox" 
						id={company_checkbox_id} name={company_checkbox_id} key={company_checkbox_id}
						title="Use the company default" checked={company_rate_selected}
						onChange={event => this.setState ({ current_rate: event.target.checked ? company_rate : this.active_rate () })}>
					</input>

					{isset (this.props.clientId) && <input type="checkbox" 
						id={client_checkbox_id} name={client_checkbox_id} key={client_checkbox_id}
						title="Use this client's default" checked={client_rate_selected}
						onChange={event => this.setState ({ current_rate: event.target.checked ? this.state.client_rate : this.active_rate () })}>
					</input>}

				</div>

			</div>

		</Container>
	}// render;

}// RateSubform;