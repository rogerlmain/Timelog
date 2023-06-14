import React from "react";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage, { default_name } from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";
import PermissionsStorage from "client/classes/storage/permissions.storage";
import InvitationStorage from "client/classes/storage/invitation.storage";
import LoggingStorage from "client/classes/storage/logging.storage";

import ThumbnailImage from "client/controls/thumbnail.image";

import SelectButton from "client/controls/buttons/select.button";
import ExplodingPanel from "client/controls/panels/exploding.panel";

import HomePage from "client/pages/home";
import ClientsPage from "client/pages/clients";
import ProjectsPage from "client/pages/projects";
import LoggingPage from "client/pages/logging";
import ReportsPage from "client/pages/reports";
import TeamPage from "client/pages/team";
import SigninPage from "client/pages/sign.in";
import SignupPage from "client/pages/sign.up";
import SettingsPage from "client/pages/settings";

import BaseControl from "client/controls/abstract/base.control";
import SelectList from "client/controls/lists/select.list";

import AccountsModel from "client/classes/models/accounts.model";
import CompanyModel from "client/classes/models/companies.model";
import InvitationsModel from "client/classes/models/invitations.model";
import OptionsModel from "client/classes/models/options.model";

import { blank, date_formats, horizontal_alignment, vertical_alignment } from "client/classes/types/constants";
import { beta, debugging, isset, is_array, is_empty, is_function, is_null, is_promise, not_set, numeric_value } from "client/classes/common";

import { MainContext, MasterContext } from "client/classes/types/contexts";

import rings_of_being from "resources/images/logos/solipsology.png";
import rexs_head from "resources/images/logos/rexthestrange.png";

import logo from "resources/images/bundy.png";
import user_image from "resources/images/guest.user.svg";

import "resources/styles/master.css";


/********/


 // version.feature.partial.bugfix
 // Increment each level at 10 regardless of status updates


const version = "1.1.5.0";


const user_image_style = {
	width: "3em",
	height: "3em",
	cursor: "pointer",
}// user_image_style;


const page_rule_style = {
	margin: "1em 0 2em",
	border: "none",
	width: "95vw",
	height: 0,
	borderTop: "solid 1px var(--border-color)",
	backgroundImage: "linear-gradient(var(--rule-color), var(--background-color))"
}// page_rule_style;


const debug_panel_style ={
	backgroundColor: "var(--background-color)",
	border: "solid 1px black",
	position: "absolute",
	right: "0",
	top: "50%",
	padding: "0.5em",
	marginRight: "1em",
}/* debug_panel_style */


const logo_image = {
	width: "auto",
	height: "54px",
	margin: "1em",
}// logo_image;


/********/


const team_permissions = () => new Promise ((resolve, reject) => {
	AccountsModel.get_by_company (CompanyStorage.active_company_id ()).then (team => {
		if (is_array (team) && (team.length == 1)) return resolve (false);
		PermissionsStorage.team_permission ().then (permission => resolve (permission)).catch (reject);
	}).catch (reject);
})// team_permissions;


/********/


export const page_names = {
	home		: "home",
	clients		: "clients",
	projects	: "projects",
	logging		: "logging",
	reports		: "reports",
	team		: "team",
	account		: "account",
	settings	: "settings",
}// page_names;


export default class MasterPanel extends BaseControl {


	avatar = React.createRef ();
	button_panel = React.createRef ();
	main_panel = React.createRef ();
	user_data_panel = React.createRef ();

	new_company = true;


	state = {

		active_page: page_names.home,

		debug_text: "No data",

		loading: true,

		buttons: null,
		eyecandy_callback: null,

		user: null,
		user_data: null,
		avatar: null,

		signing_up: false,
		eyecandy_visible: false,

		refresh: false,

	}// state;


	master_pages = { 
		[page_names.home]		: { name: "Home", permission: true }, 
		[page_names.clients]	: { name: "Clients", permission: true },
		[page_names.projects]	: { name: "Projects", permission: true },
		[page_names.logging]	: { name: "Logging", permission: true }, 
		[page_names.reports]	: { name: "Reports", permission: true },
		[page_names.team]		: { name: "Team", permission: true }, //team_permissions },
		[page_names.settings]	: { name: "Settings", permission: true }
	}// master_pages;


	static contextType = MainContext;


	static defaultProps = { 
		id			: "master_page",
		button_list	: null,
		company_id	: null,
		parent		: null,
	}// defaultProps;


	constructor (props) {

		super (props);
		
		let company_list = CompanyStorage.company_list ();
		let active_company = CompanyStorage.active_company_id ();
		
		let invitation = InvitationStorage.get_invitation ();

		this.state.company_id = isset (company_list) ? ((not_set (active_company) && (company_list.length == 1)) ? company_list [0].company_id : active_company) : null;
		this.state.avatar = AccountStorage.avatar ();

		(isset (invitation) && AccountsModel.get_by_email (invitation.invitee_email).then (account => this.setState ({ signing_up: not_set (account) })))

		if (debugging (false)) console.log ("creating master page");

	}// constructor;


	/********/


	debug_state (state) { this.setState ({ debug_text: <pre>{JSON.stringify (state, undefined, 4)}</pre> }) }


	set_page = page => this.main_panel.current.animate (() => this.setState ({ active_page: page }));


	sign_in = () => {

		this.main_panel.current.animate (() => this.setState ({ 
			signing_up: false,
			active_page: page_names.home
		}));

		this.user_data_panel.current.animate (() => this.setState ({ 
			avatar: AccountStorage.avatar (),
			company_id: CompanyStorage.active_company_id (),
		}));
		
	}/* sign_in */;


	sign_up = () => this.main_panel.current.animate (() => this.setState ({ signing_up: true }));


	sign_out = () => {

		localStorage.clear ();

		this.button_panel.current.animate (() => this.setState ({ buttons: null }));
		this.user_data_panel.current.animate (() => this.setState ({ company_id: null }));

		this.set_page (this.main_contents ());

	}/* sign_out */;


	main_contents = () => {

		let signed_in = this.signed_in ();
		
		if (signed_in) return this.get_page (this.state.active_page);
		if (this.state.signing_up || isset (this.state.invitee)) return <SignupPage parent={this} existingAccount={signed_in} />

		return <SigninPage parent={this} />
		
	}/* main_contents */;


	buttons_disabled () {
		let company_list = CompanyStorage.company_list ();
		if (is_empty (company_list) || (company_list.length == 1)) return false;
		if (CompanyStorage.company_selected ()) return false;
		return true;
	}// buttons_disabled;


	test_button = () => <SelectButton key="test_button" onClick={() => { 
	
		alert ("waiting for something to test") 
		
	}}>TEST</SelectButton>;


	get_buttons () {
		return new Promise (async (resolve, reject) => {

			let result = null;

			try {
				for (let page_name in page_names) {

					if (not_set (this.master_pages [page_name])) continue;


					const nav_button = permission => {

						let name = `${page_name}_button`;

						if (!permission) return;
						if (is_null (result)) result = [];

						return <SelectButton id={name} name={name} key={name} page_name={name} selected={this.state.page == page_name}
							disabled={this.buttons_disabled ()}
							onClick={() => this.set_page (page_name)}>

							{this.master_pages [page_name].name}

						</SelectButton>;

					}/* create_button */;

					
					let permission = this.master_pages [page_name].permission;
					let value = is_function (permission) ? permission () : permission;
					let next_button = nav_button (is_promise (value) ? await (value) : value);

					result.push (next_button);
					
				}// for;

				result.push (this.signout_button ());
				if (debugging ()) result.push (this.test_button ());

			} catch (error) { reject (error) }

			resolve (result);

		})// promise;
	}// get_buttons;


	select_company = (company_id, callback = null) => {
		CompanyStorage.set_active_company (company_id);
		this.setState ({ company_id: company_id}, callback);
	}/* select_company */;


	get_page = (page) => {
		switch (page) {
			case page_names.home		: return <HomePage parent={this} />;
			case page_names.clients		: return <ClientsPage />;
			case page_names.projects	: return <ProjectsPage />;
			case page_names.logging		: return <LoggingPage />;
			case page_names.reports		: return <ReportsPage />;
			case page_names.team		: return <TeamPage />;
			case page_names.account		: return <SignupPage parent={this.props.parent} existingAccount={true} />;
			case page_names.settings	: return <SettingsPage />;
		}// switch;
	}/* get_page */;


	signout_button () {
		return <SelectButton key="signout_button" 

			onClick={this.sign_out}>
				
			Sign out
			
		</SelectButton>
	}// signout_button;]


	update_clock = () => {

		let truetime = OptionsStorage.truetime ();

		let current_time = new Date ();
		let target_time = new Date (current_time);

		if (truetime) {
			target_time.setSeconds (target_time.getSeconds () + 1);
		} else {
			target_time.setMinutes (target_time.getMinutes () + 1);
			target_time.setSeconds (0);
		}// if;

		target_time.setMilliseconds (0);

		this.setState ({ current_time: current_time.format (OptionsStorage.truetime () ? date_formats.detailed_datetime : date_formats.short_detailed_datetime) });
		setTimeout (this.update_clock.bind (this), target_time.getTime () - current_time.getTime ());

	}// update_clock;


	update_company_list = () => new Promise ((resolve, reject) => {
		CompanyModel.get_companies ().then (companies => {

			const resolve_all = () => (processed == companies.length) ? resolve () : setTimeout (resolve_all);
	
			let processed = 0;
	
			CompanyStorage.add_companies (companies);

			companies.forEach (company => OptionsModel.get_options_by_company (company.company_id).then (options => {			
				OptionsStorage.set_by_company_id (company.company_id, options);
				processed++
			}).catch (error => reject (error)));

			resolve_all ();

		}).catch (error => reject (error));
	})// update_company_list;


	company_name = () => {

		let companies = CompanyStorage.company_list ();
		let company_count = CompanyStorage.company_count ();
		let company_name = CompanyStorage.company_name ();

		if (is_empty (companies)) return <div>Guest Account</div>

		if (company_count > 1) return <SelectList selectedValue={CompanyStorage.active_company_id ()} data={companies}
			textField="company_name" header={blank}
			onChange={event => this.select_company (event.target.value)}>
		</SelectList>
		
		return (!company_name?.equals (default_name)) ? <div>{company_name}</div> : null;

	}// company_name;


	user_data = () => {

		let signed_in = this.signed_in ();
	
		return <div style={{ marginLeft: "2em" }} className="right-justified-column">
	
			<div style={{ fontStyle: "italic" }} >{this.state.current_time}</div>
	
			{signed_in ? <div className="two-column-table with-headspace">
	
				<div className="vertically-centered">
					<div className="right-aligned-text">Hello {AccountStorage.full_name ()}!</div>
					<div className="right-aligned-text">{this.company_name ()}</div>
				</div>

				<ThumbnailImage ref={this.avatar} src={this.state.avatar ?? user_image} style={user_image_style} onClick={() => this.set_page (page_names.account)} />
					
			</div> : <div className="right-aligned-text with-some-headspace">Welcome stranger!</div>}
	
		</div>
	
	}/* UserData */;


	verify_invitations = () => {
		
		if (LoggingStorage.logged_out ()) return;
		if (this.state.loading) return setTimeout (this.verify_invitations);

		let invitation = InvitationStorage.get_invitation ();

		if (not_set (invitation)) return;

		InvitationsModel.get_by_id (invitation?.invite_id).then (invite_data => {
		
			if (invite_data?.invitee_email.equals (AccountStorage.email_address ())) return InvitationStorage.clear_store ();

			if (ask_question ("This invitation is for a different account.\nLog out?")) {
			
				let invite_key = InvitationStorage.get_store ();
		
				this.sign_out ();
				return InvitationStorage.set_store (invite_key);
		
			}// if;
				
			InvitationStorage.clear_store ();

		});

	}// verify_invitations;


	/********/


	shouldComponentUpdate (new_props, new_state) { 
		if (this.state.company_id != new_state.company_id) this.new_company = true; 
		return true; 
	}// shouldComponentUpdate;


	componentDidUpdate () {
		if (this.signed_in () && (this.new_company || is_null (this.state.buttons))) {
			this.new_company = false;
			setTimeout (() => this.button_panel.current.animate (() => this.get_buttons ().then (result => this.setState ({ buttons: result }))));
		}// if;
	}// componentDidMount;


	componentDidMount () {

		this.update_clock ();

		this.componentDidUpdate ();
		this.verify_invitations ();

	}// componentDidMount;
	
	
	render () {

		let icd = location.urlParameter ("icd");

		let context_value = {
			...this.context,
			company_id: numeric_value (this.state.company_id), 
			master_page: this,
		}// context_value;

		if (isset (icd)) {
			InvitationStorage.set_store (icd);
			window.location.href = window.location.origin;
			return null;
		}// if;

		return <MasterContext.Provider value={context_value}>
			<div id="master_panel" className="full-screen">

				{debugging () && <div id="debug_panel" style={debug_panel_style}>{this.state.debug_text}</div>}

				<div className="page-header">

					<div className="horizontally-spaced-out">

						<div className="vertically-aligned">

							<img src={logo} style={{ height: "64px", width: "auto" }} />

							<div className="program-title">
								<img src={"resources/images/bundion.svg"} style={{ width: "200px", height: "auto" }} />
								<div className="tagline">Make every second count</div>
							</div>

						</div>

						<ExplodingPanel id="user_data_panel" ref={this.user_data_panel} hAlign={horizontal_alignment.right}>
							{this.user_data ()}
						</ExplodingPanel>

					</div>

					<div className="home_button_panel with-headspace">
						<ExplodingPanel id="main_button_panel" ref={this.button_panel} afterChanging={() => this.setState ({ loading: false })}>
							{this.state.buttons}
						</ExplodingPanel>
					</div>


					{beta () && <div className="beta-tag">
						<div className="beta-tag-frame" style={{ top: this.signed_in () ? "-2em" : "-1.5em" }}>
							<div className="beta-tag-bevel" />
							<div className="beta-tag-text">BETA EDITION</div>
						</div>
					</div>}

				</div>

				<div className="page-contents scroll-panel">

					<div style={{ flexGrow: 1 }} className="with-headspace">
						<div style={{ height: "100%" }} className="horizontally-centered">
							<ExplodingPanel id="main_panel" ref={this.main_panel} stretchOnly={false} vAlign={vertical_alignment.top}>
								<div className="fully-aligned">{this.main_contents ()}</div>
							</ExplodingPanel>
						</div>
					</div>

					<div className="full-width page-footer horizontally-centered">
						<div className="horizontally-spaced-out">
							<a href="https://solipsology.org" target="solipsology"><img src={rings_of_being} style={logo_image} /></a>
							<div className="flex-column horizontally-centered">
								<div>&copy; Copyright 2022 - Roger L. Main</div>
								<div>(DBA: The Roger Main Programming Company)</div>
								<div>All rights reserved</div>
								<br />
								<div>Version {version} {debugging () ? "(test)" : (beta () ? "B" : blank)}</div>
							</div>
							<a href="https://journal.rexthestrange.com" target="journal"><img src={rexs_head} style={logo_image} /></a>
						</div>
					</div>

				</div>

			</div>
		</MasterContext.Provider>

	}// render;

}// MasterPanel;
