import React from "react";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";
import PermissionsStorage from "client/classes/storage/permissions.storage";

import Container from "controls/container";
import ThumbnailImage from "controls/thumbnail.image";

import SelectButton from "controls/buttons/select.button";
import ExplodingPanel from "controls/panels/exploding.panel";

import HomePage from "client/pages/home";
import ClientsPage from "client/pages/clients";
import ProjectsPage from "client/pages/projects";
import LoggingPage from "client/pages/logging";
import ReportsPage from "client/pages/reports";
import TeamPage from "client/pages/team";
import AccountPage from "client/pages/sign.up";
import SigninPage from "client/pages/sign.in";
import SignupPage from "client/pages/sign.up";
import SettingsPage from "client/pages/settings";

import BaseControl from "client/controls/abstract/base.control";
import SelectList from "client/controls/lists/select.list";

import CompanyModel from "client/classes/models/company.model";
import OptionsModel from "./classes/models/options.model";

import { date_formats, globals } from "client/classes/types/constants";
import { debugging, isset, is_empty, is_function, is_null, is_promise, nested_value, not_set, numeric_value } from "client/classes/common";

import { MasterContext } from "classes/types/contexts";

import logo from "resources/images/clock.png";
import user_image from "resources/images/guest.user.svg";

import "resources/styles/home.page.css";


/********/


 // version.feature.partial.bugfix
 // Increment version at feature #10
 // Increment feature at partial #10 or on feature completion


const version = "1.9.5.2";


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


/********/


const CompanyHeader = props => {

	let companies = CompanyStorage.company_list ();

	return <div style={{ marginLeft: "2em" }} className="right-justified-column">

		<div style={{ fontStyle: "italic" }} >{props.currentTime}</div>

		<Container visible={props.signedIn}>

			<div className="two-column-table with-headspace">

				<div className="vertically-centered">

					<div className="right-aligned-text">Hello {AccountStorage.full_name ()}!</div>
					
					<div className="right-aligned-text">

						<Container visible={CompanyStorage.company_count () > 1}>
							<SelectList value={CompanyStorage.active_company_id ()} data={companies}
							
								textField="company_name" hasHeader={true}
								
								onChange={props.onChange}>
									
							</SelectList>
						</Container>

						<Container visible={CompanyStorage.company_count () == 1}>
							<div>{nested_value (CompanyStorage.active_company (), "company_name")}</div>
						</Container>

						<Container visible={is_empty (companies)}>
							<div>Guest Account</div>
						</Container>
						
					</div>

				</div>

				<ThumbnailImage src={AccountStorage.avatar () ?? user_image} style={user_image_style} onClick={() => props.changePage (page_names.account)} />
					
			</div>

		</Container>

		<Container visible={!props.signedIn}>
			<div className="right-aligned-text with-some-headspace">Welcome!</div>
		</Container>

	</div>

}// CompanyHeader;


const MainPanel = props => {


	const page_items = () => {

		let result = null;

		for (let [key, page] of Object.entries (props.master.pages)) {
			let id = `${key}_container`;
			if (is_null (result)) result = [];
			result.push (<Container key={`${id}_key`} id={id} visible={props.master.state.page == key}>{page}</Container>);
		}// for;

		return result;

	}/* page_items */;


	let icd = location.urlParameter ("icd");
	let active_panel = "signin_panel";


	if (isset (icd)) {
		localStorage.setItem ("invitation", icd);
		window.location.href = window.location.origin;
		return null;
	}// if;


	active_panel = (props.signedIn ? "master_panel" : (props.master.state.signing_up || isset (localStorage.getItem ("invitation")) ? "signup_panel" : "signin_panel"));


	return <div className="full-height horizontally-centered" style={{ overflowY: "auto" }}>
		<ExplodingPanel id="main_panel">

			<Container id="master_panel_container" visible={active_panel == "master_panel"}>
				<div className="full-size horizontally-aligned">
					<ExplodingPanel id="details_panel">
						{page_items ()}
					</ExplodingPanel>
				</div>
			</Container>

			<Container id="signup_panel_container" visible={active_panel == "signup_panel"}>
				<SignupPage parent={props.master} />
			</Container>

			<Container id="signin_panel_container" visible={active_panel == "signin_panel"}>
				<SigninPage parent={props.master} />
			</Container>

		</ExplodingPanel>
	</div>

}// MainPanel;


/********/


const client_permissions = () => {
	return new Promise ((resolve, reject) => {
		if (OptionsStorage.client_limit () <= 1) resolve (false);
		PermissionsStorage.client_permission ().then (permission => resolve (permission)).catch (reject);
	});
}// client_permissions;


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


	state = {
		eyecandy_visible: false,
		eyecandy_callback: null,
		page: page_names.home,
	}// state;


	pages = {
		[page_names.home]		: <HomePage parent={this} />,
		[page_names.clients]	: <ClientsPage />,
		[page_names.projects]	: <ProjectsPage />,
		[page_names.logging]	: <LoggingPage />,
		[page_names.reports]	: <ReportsPage />,
		[page_names.team]		: <TeamPage />,
		[page_names.account]	: <AccountPage parent={this.props.parent} />,
		[page_names.settings]	: <SettingsPage />,	
	}// pages;


	master_pages = { 
		[page_names.home]		: { name: "Home", permission: true }, 
		[page_names.clients]	: { name: "Clients", permission: client_permissions },
		[page_names.projects]	: { name: "Projects", permission: () => { return OptionsStorage.project_limit () > 1 } }, 
		[page_names.logging]	: { name: "Logging", permission: true }, 
		[page_names.reports]	: { name: "Reports", permission: true },
		[page_names.team]		: { name: "Team", permission: true },
		[page_names.settings]	: { name: "Settings", permission: true }
	}// master_pages;
	
	
	static contextType = MasterContext;


	static defaultProps = { 
		id			: "master_page",
		button_list	: null,
		company_id	: null,
		parent		: null
	}// defaultProps;


	constructor (props) {

		let company_list = CompanyStorage.company_list ();
		let active_company = CompanyStorage.active_company_id ();

		super (props);

		this.state.company_id = isset (company_list) ? ((not_set (active_company) && (company_list.length == 1)) ? company_list [0].company_id : active_company) : null;
		console.log ("creating master page");

	}// constructor;


	/********/


	buttons_disabled () {
		let company_list = CompanyStorage.company_list ();
		if (is_empty (company_list) || (company_list.length == 1)) return false;
		if (CompanyStorage.company_selected ()) return false;
		return true;
	}// buttons_disabled;


	button_list () {
		return new Promise (async (resolve, reject) => {

			let result = null;

			try {
				for (let page_name in page_names) {

					if (not_set (this.master_pages [page_name])) continue;

					let name = `${page_name}_button`;
					let permission = this.master_pages [page_name].permission;
					let value = is_function (permission) ? permission () : permission;

					const nav_button = permission => {

						if (!permission) return;
						if (is_null (result)) result = [];

						return <SelectButton id={name} name={name} key={name} page_name={name} selected={this.state.page == page_name}
							disabled={this.buttons_disabled ()}
							onClick={() => this.setState ({ page: page_name })}>

							{this.master_pages [page_name].name}

						</SelectButton>;

					}/* create_button */;

let the_button = nav_button (is_promise (value) ? await (value) : value);
result.push (the_button);

//					result.push (nav_button (is_promise (value) ? await (value) : value));

				}// for;
			} catch (error) { reject (error) }

			resolve (result);

		})// Promise;
	}// button_list;


	select_company = (company_id, callback = null) => {
		CompanyStorage.set_active_company (company_id);
		this.setState ({ company_id: company_id}, callback);
	}// select_company;


	signout_button () {
		return (
			<SelectButton onClick={() => {
				localStorage.clear ();
				globals.main.forceUpdate ();
			}}>Sign out</SelectButton>
		);
	}// signout_button;


	update_clock = () => {

		let current_time = new Date ();
		let target_time = new Date (current_time);

		target_time.setSeconds (target_time.getSeconds () + 1);
		target_time.setMilliseconds (0);

		this.setState ({ current_time: current_time.format (OptionsStorage.truetime () ? date_formats.detailed_datetime : date_formats.short_detailed_datetime) });
		setTimeout (this.update_clock.bind (this), target_time.getTime () - current_time.getTime ());

	}// update_clock;


	update_company_list = () => new Promise ((resolve, reject) => {
		CompanyModel.get_companies ().then (companies => {

			const resolve_all = () => {
				if (processed == companies.length) return resolve ();
				setTimeout (resolve_all);
			}/* resolve_all */;
	
			let processed = 0;
	
			CompanyStorage.add_companies (companies);

			companies.forEach (company => OptionsModel.get_options_by_company (company.company_id).then (options => {			
				OptionsStorage.set_by_company_id (company.company_id, options);
				processed++
			}).catch (error => reject (error)));

			resolve_all ();

		}).catch (error => reject (error));
	})// update_company_list;


	/********/


	componentDidUpdate () {
		if (this.signed_in ()) this.button_list ().then (result => this.updateState ({ button_list: result }));
	}// componentDidMount;


	componentDidMount () {
		this.update_clock ();
	}// componentDidMount;
	
	
	render () {

		let signed_in = this.signed_in ();
		
		return <MasterContext.Provider value={{ company_id: numeric_value (this.state.company_id), master_page: this }}>
			<div className="vertically-spaced-out main-page">

				<div className="page-header">

					<div className="horizontally-spaced-out">

						<div className="two-column-grid">

							<img src={logo} style={{ height: "3em" }} />

							<div className="program-title">
								<div className="title">RMPC Timelog</div>
								<div className="tagline">Make every second count</div>
							</div>

						</div>

						<CompanyHeader signedIn={signed_in} currentTime={this.state.current_time} 
							onChange={event => this.select_company (event.target.value)}
							changePage={new_page => this.setState ({ page: new_page })}>
						</CompanyHeader>

					</div>

					{signed_in && <div className="home_button_panel">

						{(() => {
							return this.state.button_list
						})()}
						{this.signout_button ()}

						{debugging () && <SelectButton onClick={() => { alert ("waiting for something to test") }} style={{ 
							position: "absolute",
							right: "1em",
							bottom: "1em"
						}}>TEST</SelectButton>}

					</div>}

				</div>

				<MainPanel master={this} signedIn={signed_in} />

				<div className="page-footer">
					<div>&copy; Copyright 2022 - Roger Main Programming Company (RMPC) - All rights reserved</div>
					<div>Version {version}</div>
				</div>

			</div>
		</MasterContext.Provider>
	}// render;

}// MasterPanel;
