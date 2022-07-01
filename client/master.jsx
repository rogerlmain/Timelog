import React from "react";

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
import SettingsPage from "client/pages/settings";

import BaseControl from "client/controls/abstract/base.control";

import { globals } from "client/classes/types/constants";
import { is_empty, is_function, is_null } from "client/classes/common";

import { MainContext, MasterContext } from "classes/types/contexts";

import "resources/styles/home.page.css";


export const page_names = {
	home		: "home",
	clients		: "clients",
	projects	: "projects",
	logging		: "logging",
	reports		: "reports",
	account		: "account",
	settings	: "settings",
}// page_names;


export const master_pages = { 
	[page_names.home]		: { name: "Home", permission: true }, 
	[page_names.clients]	: { name: "Clients", permission: () => { return OptionsStorage.client_limit () > 1 } }, 
	[page_names.projects]	: { name: "Projects", permission: () => { return OptionsStorage.project_limit () > 1 } }, 
	[page_names.logging]	: { name: "Logging", permission: true }, 
	[page_names.reports]	: { name: "Reports", permission: true },
	[page_names.account]	: { name: "Account", permission: true }, 
	[page_names.settings]	: { name: "Settings", permission: true }
}// master_pages;


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


	static contextType = MainContext;


	static defaultProps = { 
		id: "master_page",
		parent: null
	}// defaultProps;


	constructor (props) {
		super (props);
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

			if (!(is_function (master_pages [page_name].permission) ? master_pages [page_name].permission () : master_pages [page_name].permission)) continue;
			if (is_null (result)) result = [];

			// TO DO - ADD A "GROUP" OPTION FOR SINGLE STICKY BUTTON OUT OF A BUTTON LIST/GROUP (when needed)
			result.push (<SelectButton id={name} name={name} key={name} page_name={name} selected={this.state.page == page_name}
				disabled={this.buttons_disabled ()}
				onClick={() => this.setState ({ page: page_name })}>

				{master_pages [page_name].name}

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


	/********/


	render () {
		return <MasterContext.Provider value={{ ...this.context, master_page: this }}>

			<div ref={this.reference} id={this.props.id} className="full-screen">

				<div className="home_button_panel">

					{this.button_list ()}
					{this.signout_button ()}


<SelectButton onClick={() => {
	alert ("waiting for something to test")
}} style={{ 
	position: "absolute",
	right: "1em",
	top: "1em"
}}>TEST</SelectButton>


				</div>

				<div className="full-screen horizontally-centered" style={{ marginTop: "2em" }}>
					<ExplodingPanel id="details_panel">
						{this.page_items ()}
					</ExplodingPanel>
				</div>

			</div>

		</MasterContext.Provider>
	}// render;

}// MasterPanel;
