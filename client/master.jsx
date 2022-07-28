import React from "react";

import AccountStorage from "client/classes/storage/account.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import Container from "controls/container";
import SelectButton from "controls/buttons/select.button";
import ExplodingPanel from "controls/panels/exploding.panel";

import HomePage from "client/pages/home";
import ClientsPage from "client/pages/clients";
import ProjectsPage from "client/pages/projects";
import LoggingPage from "client/pages/logging";
import ReportsPage from "client/pages/reports";
import AccountPage from "client/pages/sign.up";
import SigninPage from "client/pages/sign.in";
import SignupPage from "client/pages/sign.up";
import SettingsPage from "client/pages/settings";

import BaseControl from "client/controls/abstract/base.control";
import SelectList from "client/controls/lists/select.list";

import { date_formats, globals } from "client/classes/types/constants";
import { isset, is_empty, is_function, is_null, nested_value, not_set, numeric_value } from "client/classes/common";

import { MainContext, MasterContext } from "classes/types/contexts";

import logo from "resources/images/clock.png";
import user_image from "resources/images/guest.user.svg";

import "resources/styles/home.page.css";


/********/


const version = "1.7.4";


const user_image_style = {
	width: "3em",
	height: "3em",
	borderRadius: "3em",
	border: "solid 1px black",
	cursor: "pointer",
}// user_image_style;


const page_rule_style = {
	margin: "2em 0",
	border: "none",
	width: "95vw",
	height: "1em",
	borderBottom: "1px solid var(--border-color)",
	boxShadow: "0 0.5em 0.5em -0.5em var(--shadow-color)",
}// page_rule_style;


/********/


const CompanyHeader = props => {

	let companies = CompanyStorage.company_list ();

	return <div style={{ marginLeft: "2em", fontStyle: "italic" }} className="right-aligned">

		<Container visible={props.signedIn}>

			<div className="two-column-table">

				<div>

					<div className="right-aligned-text">Hello {AccountStorage.full_name ()}!</div>
					
					<div className="right-aligned-text">

						<Container visible={CompanyStorage.company_count () > 1}>
							<SelectList value={CompanyStorage.active_company_id ()} data={companies}
							
								textField="company_name" hasHeader={true}
								
								onChange={event => {
									CompanyStorage.set_active_company (event.target.value);
									this.setState ({ company_id: event.target.value }, this.forceRefresh);
								}}>
									
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

				<img src={user_image} style={user_image_style} onClick={() => props.changePage (page_names.account)} />
					
			</div>

		</Container>

		<Container visible={!props.signedIn}>
			<div className="right-aligned-text">Welcome!</div>
		</Container>

		<div className="right-aligned-text with-some-headspace">{props.currentTime}</div>

	</div>

}// CompanyHeader;


/********/


export const page_names = {
	home		: "home",
	clients		: "clients",
	projects	: "projects",
	logging		: "logging",
	reports		: "reports",
	account		: "account",
	settings	: "settings",
}// page_names;


export default class MasterPanel extends BaseControl {


	reference = React.createRef ();


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
		[page_names.account]	: <AccountPage parent={this.props.parent} />,
		[page_names.settings]	: <SettingsPage />,	
	}// pages;


	master_pages = { 
		[page_names.home]		: { name: "Home", permission: true }, 
		[page_names.clients]	: { name: "Clients", permission: () => { return OptionsStorage.client_limit () > 1 } }, 
		[page_names.projects]	: { name: "Projects", permission: () => { return OptionsStorage.project_limit () > 1 } }, 
		[page_names.logging]	: { name: "Logging", permission: true }, 
		[page_names.reports]	: { name: "Reports", permission: true },
		[page_names.settings]	: { name: "Settings", permission: true }
	}// master_pages;
	
	
	static contextType = MainContext;


	static defaultProps = { 
		id: "master_page",
		company_id: null,
		parent: null
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
		let result = null;
		for (let page_name in page_names) {

			let name = `${page_name}_button`;

			if (not_set (this.master_pages [page_name])) continue;

			if (!(is_function (this.master_pages [page_name].permission) ? this.master_pages [page_name].permission () : this.master_pages [page_name].permission)) continue;
			if (is_null (result)) result = [];

			result.push (<SelectButton id={name} name={name} key={name} page_name={name} selected={this.state.page == page_name}
				disabled={this.buttons_disabled ()}
				onClick={() => this.setState ({ page: page_name })}>

				{this.master_pages [page_name].name}

			</SelectButton>);

		}// for;
		return result;
	}// button_list;


	signout_button () {
		return (
			<SelectButton onClick={() => {
				localStorage.clear ();
				globals.main.forceUpdate ();
			}}>Sign out</SelectButton>
		);
	}// signout_button;


	page_items = () => {

		let result = null;

		for (let [key, page] of Object.entries (this.pages)) {
			let id = `${key}_container`;
			if (is_null (result)) result = [];
			result.push (<Container key={`${id}_key`} id={id} visible={this.state.page == key}>{page}</Container>);
		}// for;

		return result;

	}// page_items;


	update_clock = () => {

		let current_time = new Date ();
		let target_time = new Date (current_time);

		target_time.setSeconds (target_time.getSeconds () + 1);
		target_time.setMilliseconds (0);

		this.setState ({ current_time: current_time.format (OptionsStorage.truetime () ? date_formats.detailed_datetime : date_formats.short_detailed_datetime) });
		setTimeout (this.update_clock.bind (this), target_time.getTime () - current_time.getTime ());

	}// update_clock;


	/********/


	componentDidMount () { this.update_clock () }
	
	
	render () {

		let active_panel = (this.signed_in () ? "master_panel" : (this.state.signing_up ? "signup_panel" : "signin_panel"));

		return <MainContext.Provider value={{ company_id: numeric_value (this.state.company_id), main_page: this }}>
			<div ref={this.reference} className="vertically-spaced-out main-page">

				<div>

					<div className="horizontally-spaced-out page-header">

						<div className="two-column-grid">

							<img src={logo} style={{ height: "3em" }} />

							<div className="program-title">
								<div className="title">RMPC Timelog</div>
								<div className="tagline">Make every second count</div>
							</div>

						</div>

						<CompanyHeader signedIn={this.signed_in ()} currentTime={this.state.current_time} changePage={new_page => this.setState ({ page: new_page })} />

					</div>

					<div className="home_button_panel">

						{this.button_list ()}
						{this.signout_button ()}

						<SelectButton onClick={() => {
							alert ("waiting for something to test")
							}} style={{ 
							position: "absolute",
							right: "1em",
							bottom: "1em"
						}}>TEST</SelectButton>

					</div>

					<hr style={page_rule_style} />
					
					<div className="full-width horizontally-centered">
						
						<ExplodingPanel id="main_panel">

							<Container id="master_panel_container" visible={active_panel == "master_panel"}>

								<MasterContext.Provider value={{ ...this.context, master_page: this }}>

									<div ref={this.reference} id={this.props.id}>

										<div className="full-size horizontally-aligned" style={{ marginTop: "2em" }}>
											<ExplodingPanel id="details_panel">
												{this.page_items ()}
											</ExplodingPanel>
										</div>

									</div>

								</MasterContext.Provider>


							</Container>

							<Container id="signup_panel_container" visible={active_panel == "signup_panel"}>
								<SignupPage parent={this} />
							</Container>

							<Container id="signin_panel_container" visible={active_panel == "signin_panel"}>
								<SigninPage parent={this} />
							</Container>

						</ExplodingPanel>

					</div>

				</div>

				<div className="page-footer">
					<div>&copy; Copyright 2022 - Roger Main Programming Company (RMPC) - All rights reserved</div>
					<div>Version {version}</div>
				</div>

			</div>
		</MainContext.Provider>
	}// render;

}// MasterPanel;
