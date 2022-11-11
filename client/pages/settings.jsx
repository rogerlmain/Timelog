import React from "react";

import OptionsStorage, { toggled } from "client/classes/storage/options.storage";
import SettingsStorage from "client/classes/storage/settings.storage";

import Container from "client/controls/container";
import Slider from "client/controls/slider";
import ToggleSwitch from "client/controls/toggle.switch";

import BaseControl from "client/controls/abstract/base.control";
import SelectButton from "client/controls/buttons/select.button";
import CurrencyInput from "client/controls/inputs/currency.input";

import ExplodingPanel from "client/controls/panels/exploding.panel";

import DeluxeAccountForm from "client/forms/deluxe.account.form";
import InviteForm from "client/forms/invite.form";

import OptionToggle from "client/gadgets/toggles/option.toggle";

import { account_types, date_rounding, vertical_alignment } from "client/classes/types/constants";
import { deadbeat_options, option_types } from "client/classes/types/options";
import { isset, is_null, not_set } from "client/classes/common";
import { MasterContext } from "client/classes/types/contexts";

import { resize_direction } from "client/controls/panels/resize.panel";
import { Break } from "client/controls/html/components";

import { client_limit_options } from "client/pages/clients";
import { project_limit_options } from "client/pages/projects";

import "resources/styles/pages.css";


const options_panels = {
	account_options	: 1,
	user_options	: 2,
}// options_panels;


export default class SettingsPage extends BaseControl {


	settings_panel = React.createRef ();


	state = { 

		account_type: account_types.deadbeat,

		granularity: 1,
		client_limit: 1,
		project_limit: 1,

		billing_option: toggled.false,
		rounding_option: toggled.false,

		start_rounding: date_rounding.off,
		end_rounding: date_rounding.off,

		current_panel: options_panels.account_options,

		cc_form: null,
		pricing: null,

	}/* state */;


	deluxe_form = <DeluxeAccountForm 
		option={this.state.cc_form?.["option"]} value={this.state.cc_form?.["value"]}
		onCancel={() => this.execute (this.state.cc_form?.onCancel).then (() => this.setState ({ cc_form: null }))} 
		onSubmit={() => this.execute (this.state.cc_form?.onSubmit).then (() => this.setState ({ cc_form: null }))}>
	</DeluxeAccountForm>


	/********/


	static contextType = MasterContext;
	static defaultProps = { id: "settings_page" }


	constructor (props) {

		super (props);

		let options = OptionsStorage.get_options ();
		let settings = null;
		
		const option_value = option => { 
			if (isset (options) && isset (options [option])) return parseInt (options [option]);
			return deadbeat_options [option_types?.get_key (option)];
		}/* option_value */;

		for (let key of Object.keys (option_types)) {
			if (is_null (settings)) settings = {}
			settings [key] = option_value (option_types [key]);
		}// for;

		this.state = {...this.state, ...settings};

	}// constructor;


	/********/


	account_options () {

		let options = null;

		account_types?.map_keys (key => {

			let next_item = <option key={`${key}_option`} value={account_types [key]}>{key.titled ()}</option>
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


	/********/


	process_option = (option, value) => this.set_option (option_types [option], value).then (() => this.setState ({ [option]: value }, () => this.context.master_page.forceUpdate ()));


	/**** Options ****/


	granularity_option = () => { 
		return <OptionToggle id="granularity" title="Granularity" values={["30 Mins", "15 Mins", "1 Min", "Truetime"]} value={OptionsStorage.granularity ()}
			option={option_types.granularity} parent={this} 
			onPaymentConfirmed={selected_option => {
				this.set_option (option_types.granularity, selected_option).then (() => this.setState ({
					start_rounding: date_rounding.off,
					end_rounding: date_rounding.off,
					granularity: selected_option
				}, this.context.master_page.forceRefresh));
			}}>
		</OptionToggle>
	}/* granularity_option */;


	editing_option = () => {
		return <OptionToggle id="editing_option" title="Editing option" values={["No", "Yes"]} value={OptionsStorage.editing_option ()}
			option={option_types.editing_option} parent={this}
			onPaymentConfirmed={selected_option => this.process_option ("editing_option", selected_option)}>
		</OptionToggle>
	}// editing_option;


	rounding_options = () => {
		return <Container>
		
			<OptionToggle id="rounding_option" title="Rounding option" values={["No", "Yes"]} value={OptionsStorage.rounding_option ()}
				option={option_types.rounding_option} parent={this}
				onPaymentConfirmed={selected_option => this.process_option ("rounding_option", selected_option)}>
			</OptionToggle>

			<div className="span-all-columns">
				<ExplodingPanel id="rounding_options_panel">
					<Container id="rounding_options_container" visible={OptionsStorage.can_round ()}>
						<div className="credit-centered with-headspace">

							<OptionToggle id="start_time_rounding" title="Start time rounding"
								values={["Round down", "Round off", "Round up"]} value={this.state.start_rounding + 2}
								option={option_types.start_rounding} parent={this} billable={false}
								onChange={selected_value => this.set_option (option_types.start_rounding, selected_value - 1)}>
							</OptionToggle>

							<OptionToggle id="end_time_rounding" title="End time rounding"
								values={["Round down", "Round off", "Round up"]} value={this.state.end_rounding + 2}
								option={option_types.end_rounding} parent={this} billable={false}
								onChange={selected_value => this.set_option (option_types.end_rounding, selected_value - 1)}>
							</OptionToggle>					

						</div>
					</Container>
				</ExplodingPanel>
			</div>

		</Container>
	}// rounding_options;


	limit_options = () => {
		return <Container>

			<OptionToggle id="client_limit" title="Number of clients" values={client_limit_options?.get_keys ()} value={OptionsStorage.client_limit ()}
				option={option_types.client_limit} parent={this} 
				onPaymentConfirmed={selected_option => this.process_option ("client_limit", selected_option)}>
			</OptionToggle>

			<OptionToggle id="project_limit" title="Number of projects" values={project_limit_options?.get_keys ()} value={OptionsStorage.project_limit ()}
				option={option_types.project_limit} parent={this} 
				onPaymentConfirmed={selected_option => this.process_option ("project_limit", selected_option)}>
			</OptionToggle>

		</Container>
	}/* limit_options */;


	billing_options = () => {

		let option_available = ((OptionsStorage.client_limit () > 1) || (OptionsStorage.project_limit () > 1));
		let option_purchased = (OptionsStorage.can_bill ());

		return <div className="span-all-columns">
			<ExplodingPanel id="option_panel" direction={resize_direction.vertical} className="full-width">
				<Container id="billing_options_container" visible={option_available}>

					<Container id="billing_available_container" visible={!option_purchased}>
						<div className="credit-centered">
							<OptionToggle id="billing_option" title="Billing option" values={["No", "Yes"]} value={OptionsStorage.billing_option ()}
								option={option_types.billing_option} parent={this}
								onPaymentConfirmed={selected_option => this.process_option ("billing_option", selected_option)}>
							</OptionToggle>
						</div>
					</Container>

					<Container id="billing_purchased_container" visible={option_purchased}>
						<div className="horizontally-aligned">
							<div className="credit-centered">

								<label htmlFor="default_rate">Default rate</label>

								<CurrencyInput id="billing_rate" className="rate-field" maxLength={5}
									defaultValue={OptionsStorage.default_rate () ?? 0}
									onBlur={event => OptionsStorage.default_rate (event.target.value.fromCurrency ())}>
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
					<label htmlFor="package">{account_types?.get_key (this.state.account_type).titled ()} account</label>
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
					<div className="horizontally-aligned">{this.editing_option ()}</div>
					<br />
					<div className="horizontally-aligned">{this.billing_options ()}</div>
					<br />
					<div className="credit-centered">{this.rounding_options ()}</div>
				</div>

			</div>

			<div className="full-row section-header">Invite a contributor</div>

			<InviteForm />

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
							this.context.master_page.forceUpdate ();
						}} 
						showValue={true}>
					</Slider>
				</div>
			</div>

		</Container>
	}/* user_settings_panel */;


	/**** React Routines ****/


	shouldComponentUpdate (props, state) {
		if (isset (state.cc_form) && not_set (this.state.cc_form)) return !!this.context.load_popup (this.deluxe_form).then (this.context.show_popup);
		return true;
	}// shouldComponentUpdate;


	render () {
		return <Container>
			<div className="two-column-grid full-width">

				<div className="button-column">
		
					<SelectButton id="account_options_button" className="sticky-button" 

						selected={this.state.current_panel == options_panels.account_options} 
						onClick={() => this.settings_panel.current.animate (() => this.setState ({ current_panel: options_panels.account_options }))}>
							
						Account Options
						
					</SelectButton>

					<SelectButton id="user_settings_button" className="sticky-button" 

						selected={this.state.current_panel == options_panels.user_settings} 
						onClick={() => this.settings_panel.current.animate (() => this.setState ({current_panel: options_panels.user_settings }))}>
							
						User Settings
						
					</SelectButton>

				</div>					
					
				<ExplodingPanel id="settings_exploding_panel" className="full-width" ref={this.settings_panel} stretchOnly={true} vAlign={vertical_alignment.top}>
					{this.user_settings_panel ()}
					{this.account_options_panel ()}
				</ExplodingPanel>

			</div>
		</Container>
	}// render;


}// SettingsPage;