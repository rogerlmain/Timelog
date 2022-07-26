import * as constants from "classes/types/constants";

import React from "react";

import EmailModel from "client/classes/models/email.model";

import OptionsStorage, { toggled } from "client/classes/storage/options.storage";
import SettingsStorage from "client/classes/storage/settings.storage";

import Container from "client/controls/container";
import Slider from "client/controls/slider";
import ToggleSwitch from "client/controls/toggle.switch";

import BaseControl from "client/controls/abstract/base.control";

import ExplodingPanel from "client/controls/panels/exploding.panel";
import EyecandyPanel from "client/controls/panels/eyecandy.panel";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import CurrencyInput from "client/controls/inputs/currency.input";
import SelectButton from "client/controls/buttons/select.button";

import DeluxeAccountPopup from "popups/deluxe.account.popup";

import ToggleOption from "pages/gadgets/settings/toggle.option";

import { blank, debugging, option_types } from "classes/types/constants";
import { get_key, get_keys, isset, is_null, nested_value, not_set } from "classes/common";

import { resize_direction } from "controls/panels/resize.panel";
import { client_limit_options } from "pages/clients";

import { MainContext } from "classes/types/contexts";

import { Break } from "client/controls/html/components";

import "resources/styles/pages.css";


const options_panels = {
	account_options	: 1,
	user_options	: 2,
}// options_panels;


const notification_delay = 2000;


export default class SettingsPage extends BaseControl {


	invite_form = React.createRef ();


	state = { 

		account_type: constants.account_types.deadbeat,
		company_id: null,

		granularity: 1,
		client_limit: 1,
		project_limit: 1,

		billing_option: toggled.false,
		rounding_option: toggled.false,

		start_rounding: constants.date_rounding.off,
		end_rounding: constants.date_rounding.off,

		current_panel: options_panels.account_options,

		cc_form: null,
		pricing: null,

		invitee: null,
		invite_data: null,

	}/* state */;


	static contextType = MainContext;
	static defaultProps = { id: "settings_page" }


	/********/


	account_options () {

		let options = null;

		get_keys (constants.account_types).map (key => {

			let next_item = <option key={`${key}_option`} value={constants.account_types [key]}>{key.titled ()}</option>
			if (is_null (options)) options = new Array ();
			options.push (next_item);

		})

		return options;

	}// account_options;


	set_option (option, value) {
		return new Promise ((resolve, reject) => OptionsStorage.save_option (option, value).then (data => {
			this.setState ({ [option]: value }, resolve (data));
		}).catch (reject));
	}// set_option;


	deluxe_account_form () {

		const form_value = (field) => { return isset (this.state.cc_form) ? this.state.cc_form [field] : null };

		return <DeluxeAccountPopup visible={isset (this.state.cc_form)} option={form_value ("option")} value={form_value ("value")}
			onCancel={() => this.execute (this.state.cc_form.onCancel).then (() => this.setState ({ cc_form: null }))} 
			onSubmit={() => this.execute (nested_value (this.state.cc_form, "onSubmit")).then (() => this.setState ({ cc_form: null }))}>
		</DeluxeAccountPopup>

	}// deluxe_account_form;


	process_option = (option, value) => this.set_option (option_types [option], value).then (() => this.setState ({ [option]: value }, () => this.context.main_page.forceUpdate ()));


	initialize_settings () {

		let options = OptionsStorage.get_options ();
		
		let option_value = option => { 
			if (isset (options) && isset (options [option])) return parseInt (options [option]);
			return constants.deadbeat_options [get_key (option_types, option)];
		}/* option_value */;

		let settings = null;

		for (let key of Object.keys (option_types)) {
			if (is_null (settings)) settings = {}
			settings [key] = option_value (option_types [key]);
		}// for;

		this.setState (settings);
		
	}// initialize_settings;


	invite_contributor = event => {

		let data = this.state.invite_data;

		data.append ("host_id", AccountStorage.account_id ());
		data.append ("host_name", AccountStorage.full_name ());
		data.append ("company_name", CompanyStorage.company_name ());
		data.append ("company_id", CompanyStorage.active_company_id ());

		return new Promise ((resolve, reject) => EmailModel.send_invite (data).then (data => resolve (Array.get_element (data, 0))).catch (reject));

	}/* invite_contributor */;


	invitee_details = () => {
		if (not_set (this.state.invite_data)) return blank;
		return `Inviting ${this.state.invite_data.get ("invitee_name")} (${this.state.invite_data.get ("invitee_email")})`;
	}// invitee_details;


	/**** Options ****/


	granularity_option = () => { 
		return <ToggleOption id="granularity" title="Granularity" values={["1 Hr", "15 Mins", "1 Min", "Truetime"]} value={this.state.granularity}
			option={option_types.granularity} parent={this} 
			onPaymentConfirmed={selected_option => {
				this.set_option (option_types.granularity, selected_option).then (() => this.setState ({
					start_rounding: constants.date_rounding.off,
					end_rounding: constants.date_rounding.off,
					granularity: selected_option
				}, this.context.main_page.forceRefresh));
			}}>
		</ToggleOption>
	}/* granularity_option */;


	rounding_options = () => {
		return <Container>
		
			<ToggleOption id="rounding_option" title="Rounding option" values={["No", "Yes"]} value={this.state.rounding_option}
				option={option_types.rounding_option} parent={this}
				onPaymentConfirmed={selected_option => this.process_option ("rounding_option", selected_option)}>
			</ToggleOption>

			<div className="span-all-columns">
				<ExplodingPanel id="rounding_options_panel">
					<Container id="rounding_options_container" visible={OptionsStorage.can_round ()}>
						<div className="credit-centered with-headspace">

							<ToggleOption id="start_time_rounding" title="Start time rounding"
								values={["Round down", "Round off", "Round up"]} value={this.state.start_rounding + 2}
								option={option_types.start_rounding} parent={this} billable={false}
								onChange={selected_value => this.set_option (option_types.start_rounding, selected_value - 1)}>
							</ToggleOption>					

							<ToggleOption id="end_time_rounding" title="End time rounding"
								values={["Round down", "Round off", "Round up"]} value={this.state.end_rounding + 2}
								option={option_types.end_rounding} parent={this} billable={false}
								onChange={selected_value => this.set_option (option_types.end_rounding, selected_value - 2)}>
							</ToggleOption>					

						</div>
					</Container>
				</ExplodingPanel>
			</div>

		</Container>
	}// rounding_options;


	limit_options = () => {
		return <Container>

			<ToggleOption id="client_limit" title="Number of clients" values={get_keys (client_limit_options)} value={this.state.client_limit}
				option={option_types.client_limit} parent={this} 
				onPaymentConfirmed={selected_option => this.process_option ("client_limit", selected_option)}>
			</ToggleOption>

			<ToggleOption id="project_limit" title="Number of projects" values={["1", "5", "10", "50", "Unlimited"]} value={this.state.project_limit}
				option={option_types.project_limit} parent={this} 
				onPaymentConfirmed={selected_option => this.process_option ("project_limit", selected_option)}>
			</ToggleOption>

		</Container>
	}/* limit_options */;


	billing_options = () => {

		let option_available = ((OptionsStorage.client_limit () > 1) || (OptionsStorage.project_limit () > 1));
		let option_purchased = (OptionsStorage.can_bill ());

		return <div className="span-all-columns">
			<ExplodingPanel id="option_panel" direction={resize_direction.vertical} style={{ width: "100%" }}>
				<Container id="billing_options_container" visible={option_available}>

					<Container id="billing_available_container" visible={!option_purchased}>
						<div className="credit-centered">
							<ToggleOption id="billing_option" title="Billing option" values={["No", "Yes"]} value={this.state.billing_option}
								option={option_types.billing_option} parent={this}
								onPaymentConfirmed={selected_option => this.process_option ("billing_option", selected_option)}>
							</ToggleOption>
						</div>
					</Container>

					<Container id="billing_purchased_container" visible={option_purchased}>
						<div className="horizontally-aligned">
							<div className="credit-centered">

								<label htmlFor="default_rate">Default rate</label>

								<CurrencyInput id="billing_rate" className="rate-field" maxLength={3}
									defaultValue={OptionsStorage.default_rate () ?? 0}
									onBlur={event => OptionsStorage.default_rate (event.target.value)}>
								</CurrencyInput>

							</div>
						</div>
					</Container>

				</Container>
			</ExplodingPanel>
		</div>

	}/* billing_options */;


	/**** Panels ****/


	account_options_panel = () => {
		return <Container id="account_options_container" visible={this.state.current_panel == options_panels.account_options}>

			<div className="full-row section-header">Account Options</div>

			<div className="full-row horizontally-aligned" style={{ display: "flex", margin: "1em 0 2em" }}>
				<div className="one-piece-form">
					<label htmlFor="package">{get_key (constants.account_types, this.state.account_type).titled ()} account</label>
					<ToggleSwitch id="package" onChange={option => this.setState ({ account_type: parseInt (option) })}>{this.account_options ()}</ToggleSwitch>
				</div>
			</div>

			<div className="two-column-newspaper with-headspace">

				<div>
					<div className="credit-centered">
						{this.granularity_option ()}
						<Break />
						{this.limit_options ()}
					</div>
				</div>

				<div>
					<div className="credit-centered">{this.rounding_options ()}</div>
					<br />
					<div className="horizontally-aligned">{this.billing_options ()}</div>
				</div>

			</div>

			<div className="full-row section-header">Contributors</div>

			<EyecandyPanel id="invite_button_panel" text={this.invitee_details ()}
			
				onEyecandy={() => this.invite_contributor ().then (invitation => this.setState ({ 
					invite_data: null,
					notification: `${invitation.invitee_name} has been invited to join us.`,
				}, () => setTimeout (() => this.setState ({ notification: null }), notification_delay)))}

				eyecandyVisible={isset (this.state.invite_data)}>

				<Container visible={isset (this.state.notification)}>
					<div>{this.state.notification}</div>
				</Container>

				<Container visible={not_set (this.state.notification)}>
					<form id="invite_form" ref={this.invite_form}>

						<div className="horizontally-aligned with-headspace">

							<label htmlFor="invitation">Invite a contributor</label>

							<div className="three-column-grid" style={{ columnGap: "0.2em" }}>
								<input type="text" id="invitee_name" name="invitee_name" placeholder="Name" style={{ width: "8em" }} 
									onChange={event => this.setState ({ invitee: event.target.value })} required={true}
									defaultValue={debugging ? "Roger" : null}>
								</input>
								<input type="email" id="invitee_email" name="invitee_email" placeholder="Email address" required={true}
									defaultValue={debugging ? "roger.main@rexthestrange.com" : null}>
								</input>
								<button onClick={event => {
									this.setState ({ invite_data: new FormData (this.invite_form.current) });
									event.preventDefault ();
								}}>Invite</button>

							</div>

						</div>

					</form>
				</Container>

			</EyecandyPanel>

		</Container>

	}// account_options_panel;


	user_settings_panel = () => {
		return <Container id="user_settings_container" visible={this.state.current_panel == options_panels.user_settings}>

			<div className="full-row section-header">User Settings</div>

			<div className="one-piece-form">
				<label>Animation Speed</label>
				<div style={{ minWidth: "15em", padding: "0.2em 0" }}>
					<Slider id="animation_speed" min={0} max={5000} value={SettingsStorage.animation_speed ()} 
						onChange={value => {
							SettingsStorage.animation_speed (value);
							this.context.main_page.forceUpdate ();
						}} 
						showValue={true}>
					</Slider>
				</div>
			</div>

		</Container>
	}/* user_settings_panel */;


	/**** React Routines ****/


	componentDidMount () {
		if (this.state.company_id != this.context.company_id) return this.setState ({ company_id: this.context.company_id }, this.initialize_settings);
	}// componentDidMount;


	componentDidUpdate () { this.componentDidMount () };

	
	render () {
		return <Container>

			<div className="two-column-grid">

				<div className="button-column">
		
					<SelectButton id="account_options_button" className="sticky-button" 
						selected={this.state.current_panel == options_panels.account_options} 

						beforeClick={() => this.setState ({ current_panel: null })}
						onClick={() => this.setState ({ current_panel: options_panels.account_options })}>
							
						Account Options
						
					</SelectButton>

					<SelectButton id="user_settings_button" className="sticky-button" 
						selected={this.state.current_panel == options_panels.user_settings} 

						beforeClick={() => this.setState ({ current_panel: null })}
						onClick={() => this.setState ({current_panel: options_panels.user_settings })}>
							
						User Settings
						
					</SelectButton>

				</div>					
					
				<ExplodingPanel id="settings_exploding_panel">

					{this.user_settings_panel ()}
					{this.account_options_panel ()}

				</ExplodingPanel>

			</div>

			{this.deluxe_account_form ()}

		</Container>
	}// render;


}// SettingsPage;