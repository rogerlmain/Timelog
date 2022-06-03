import * as constants from "classes/types/constants";
import * as common from "classes/common";

import React from "react";

import OptionStorage from "classes/storage/option.storage";
import SettingStorage from "classes/storage/setting.storage";

import Container from "client/controls/container";
import Slider from "client/controls/slider";
import ToggleSwitch from "client/controls/toggle.switch";

import SelectButton from "client/controls/buttons/select.button";

import BaseControl from "controls/abstract/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";

import DeluxeAccountPopup from "popups/deluxe.account.popup";

import OptionsModel from "models/options";

import ToggleOption from "pages/gadgets/settings/toggle.option";

import { get_keys, nested_value } from "classes/common";

import { resize_direction } from "controls/panels/resize.panel";
import { client_limit_options } from "pages/clients";

import { MainContext } from "classes/types/contexts";
import { Break } from "client/controls/html/components";

import "client/resources/styles/pages.css";
import CurrencyInput from "client/controls/inputs/currency.input";


const options_panels = {
	user_options:		1,
	account_options:	2,
}// options_panels;


export default class SettingsPage extends BaseControl {


	state = { 

		account_type: constants.account_types.deadbeat,
		company_id: null,

		granularity: 1,
		start_rounding: constants.date_rounding.off,
		end_rounding: constants.date_rounding.off,
		client_limit: 1,
		project_limit: 1,

		billing_option: false,

		cc_form: null,
		pricing: null

	}/* state */;


	static contextType = MainContext;
	static defaultProps = { id: "settings_page" }


	/********/


	account_options () {

		let options = null;

		get_keys (constants.account_types).map (key => {

			let next_item = <option key={`${key}_option`} value={constants.account_types [key]}>{key.titled ()}</option>
			if (common.is_null (options)) options = new Array ();
			options.push (next_item);

		})

		return options;

	}// account_options;


	set_option (option, value) {
		return new Promise ((resolve, reject) => OptionStorage.save_option (option, value).then (data => {
			this.setState ({ [option]: value }, resolve (data));
		}).catch (reject));
	}// set_option;


	deluxe_account_form () {

		const form_value = (field) => { return common.isset (this.state.cc_form) ? this.state.cc_form [field] : null };

		return <DeluxeAccountPopup visible={common.isset (this.state.cc_form)} option={form_value ("option")} value={form_value ("value")}
			onCancel={() => this.execute (this.state.cc_form.onCancel).then (() => this.setState ({ cc_form: null }))} 
			onSubmit={() => this.execute (nested_value (this.state.cc_form, "onSubmit")).then (() => this.setState ({ cc_form: null }))}>
		</DeluxeAccountPopup>

	}// deluxe_account_form;


	rounding_switches () {
		return <ExplodingPanel id="rounding_options_panel" direction={resize_direction.vertical} stretchOnly={true}>
			<Container id="rounding_options_container" visible={ this.state.granularity > 1} className="one-piece-form with-headspace" inline={true}>

				<ToggleOption id="start_time_rounding" title="Start time rounding"
					values={["Round down", "Round off", "Round up"]} value={this.state.start_rounding + 2}
					option={constants.option_types.start_rounding} parent={this} billable={false}
					onChange={selected_value => this.set_option (constants.option_types.start_rounding, selected_value - 1)}>
				</ToggleOption>					

				<ToggleOption id="end_time_rounding" title="End time rounding"
					values={["Round down", "Round off", "Round up"]} value={this.state.end_rounding + 2}
					option={constants.option_types.end_rounding} parent={this} billable={false}
					onChange={selected_value => this.set_option (constants.option_types.end_rounding, selected_value - 2)}>
				</ToggleOption>					

			</Container>
		</ExplodingPanel>
	}// rounding_switches;


	update_state () {

		let options = OptionStorage.get_options (this.state.company_id);
		
		let option_value = option => { 
			if (common.isset (options) && common.isset (options [option])) return parseInt (options [option]);
			return constants.default_options [common.get_key (constants.option_types, option)];
		}// option_value;

		this.setState ({
			granularity: option_value (constants.option_types.granularity),
			start_rounding: option_value (constants.option_types.start_rounding),
			end_rounding:  option_value (constants.option_types.end_rounding),
			client_limit:  option_value (constants.option_types.client_limit),
			project_limit: option_value (constants.option_types.project_limit),
			billing_option: option_value (constants.option_types.billing_option),
		});

	}// update_state;


	/********/


	componentDidMount () {
		if (this.state.company_id != this.context.company_id) return this.setState ({ company_id: this.context.company_id }, this.update_state);
	}// componentDidMount;


	componentDidUpdate () { this.componentDidMount () };

	
	render () {

		let billing_option_available = ((OptionStorage.client_limit () > 1) || (OptionStorage.project_limit () > 1));
		let billing_option_purchased = OptionStorage.billing_option ();

		return <Container>

			{this.deluxe_account_form ()}

			<div className="two-column-grid">

				<div className="button-column">
		
					<SelectButton id="user_settings_button" className="sticky-button" 
						selected={this.state.current_panel == options_panels.user_settings} 

						beforeClick={() => this.setState ({ current_panel: null })}
						onClick={() => this.setState ({current_panel: options_panels.user_settings })}>
							
						User Settings
						
					</SelectButton>

					<SelectButton id="account_options_button" className="sticky-button" 
						selected={this.state.current_panel == options_panels.account_options} 

						beforeClick={() => this.setState ({ current_panel: null })}
						onClick={() => this.setState ({current_panel: options_panels.account_options })}>
							
						Account Options
						
					</SelectButton>

				</div>					
					
				<ExplodingPanel id="settings_exploding_panel">

					<Container id="user_settings_container" visible={this.state.current_panel == options_panels.user_settings}>

						<div className="full-row section-header">User Settings</div>

						<div className="one-piece-form">
							<label>Animation Speed</label>
							<div style={{ minWidth: "15em", padding: "0.2em 0" }}>
								<Slider id="animation_speed" min={0} max={5000} value={SettingStorage.animation_speed ()} 
									onChange={value => {
										SettingsModel.save_setting (constants.setting_types.animation_speed, value);
										SettingStorage.animation_speed (value);
										this.forceUpdate ();
									}} 
									showValue={true}>
								</Slider>
							</div>
						</div>

					</Container>

					<Container id="account_options_container" visible={this.state.current_panel == options_panels.account_options}>

						<div className="full-row section-header">Account Options</div>

						<div className="full-row horizontally-centered" style={{ display: "flex", margin: "1em 0 2em" }}>
							<div className="one-piece-form">
								<label htmlFor="package">{common.get_key (constants.account_types, this.state.account_type).titled ()} account</label>
								<ToggleSwitch id="package" onChange={option => this.setState ({ account_type: parseInt (option) })}>{this.account_options ()}</ToggleSwitch>
							</div>
						</div>

						<div className=" with-headspace two-column-newspaper">

							<div className="right-justified-column">

								<div className="one-piece-form" style={{ display: "inline-grid" }}>

									<ToggleOption id="granularity" title="Granularity" values={["1 Hr", "15 Mins", "1 Min", "Truetime"]} value={this.state.granularity}
										option={constants.option_types.granularity} parent={this} 
										onPaymentConfirmed={selected_option => {
											this.set_option (constants.option_types.granularity, selected_option).then (() => this.setState ({
												start_rounding: constants.date_rounding.off,
												end_rounding: constants.date_rounding.off,
												granularity: selected_option
											}, this.context.main_page.forceRefresh));
										}}>
									</ToggleOption>

								</div>

								{/* Date.minute_increments = [5, 6, 10, 12, 15, 20, 30] */}

								{this.rounding_switches ()}

							</div>

							<div>
								<div className="one-piece-form" >

									<ToggleOption id="client_limit" title="Number of clients" values={get_keys (client_limit_options)} value={this.state.client_limit}
										option={constants.option_types.client_limit} parent={this} 
										onPaymentConfirmed={selected_option => 
											this.set_option (constants.option_types.client_limit, selected_option).then (() => 
											this.setState ({ client_limit: selected_option }, this.context.main_page.forceRefresh))
										}>
									</ToggleOption>

									<ToggleOption id="project_limit" title="Number of projects" values={["1", "5", "10", "50", "Unlimited"]} value={this.state.project_limit}
										option={constants.option_types.project_limit} parent={this} 
										onPaymentConfirmed={selected_option => 
											this.set_option (constants.option_types.project_limit, selected_option).then (() => 
											this.setState ({ project_limit: selected_option }, this.context.main_page.forceRefresh))
										}>
									</ToggleOption>

									<Break />

									<Container className="full-row" visible={billing_option_available} inline={true}>

										<ExplodingPanel id="default_rate_panel" direction={resize_direction.vertical} style={{ width: "100%" }}>
										</ExplodingPanel>

										<ExplodingPanel id="billing_option_panel" direction={resize_direction.vertical} style={{ width: "100%" }}>

											<Container id="billing_option_container" visible={!billing_option_purchased} inline={true} className="one-piece-form" style={{ display: "flex" }}>
												<ToggleOption id="billing_option" title="Billing option" values={[1, 2]} value={this.state.billing_option + 1}
													option={constants.option_types.billing_option} parent={this}
													onPaymentConfirmed={selected_option => 
														this.set_option (constants.option_types.billing_option, (selected_option - 1)).then (() => 
														this.setState ({ billing_option: (selected_option - 1) }, this.context.main_page.forceRefresh))
													}>
												</ToggleOption>
											</Container>

											<Container id="billing_option_purchased" visible={billing_option_purchased} contentsOnly={false} inline={true} 
												className="horizontally-spaced-out" style={{ border: "solid 1px blue !important" }}>

												<label htmlFor="default_rate">Default rate</label>

												<CurrencyInput id="billing_rate" className="rate-field" maxLength={3}
													defaultValue={OptionStorage.default_rate () ?? 0}
													onBlur={event => OptionStorage.default_rate (event.target.value)}>
												</CurrencyInput>

											</Container>

										</ExplodingPanel>
									</Container>

								</div>
							</div>

						</div>

					</Container>

				</ExplodingPanel>

			</div>

		</Container>

	}// render;


}// SettingsPage;
