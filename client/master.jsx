import * as common from "classes/common";

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
import { is_null } from "client/classes/common";

import { MainContext, MasterContext } from "classes/types/contexts";

import "client/resources/styles/home.page.css";


const home_page = "home";


export const master_pages = { 
	[home_page]	: { name: "Home", permission: true }, 
	clients		: { name: "Clients", permission: () => { return OptionsStorage.client_limit () > 1 } }, 
	projects	: { name: "Projects", permission: () => { return OptionsStorage.project_limit () > 1 } }, 
	logging		: { name: "Logging", permission: true }, 
	reports		: { name: "Reports", permission: true },
	account		: { name: "Account", permission: true }, 
	settings	: { name: "Settings", permission: true }
}// master_pages;


export default class MasterPanel extends BaseControl {


	reference = React.createRef ();


	state = {
		eyecandy_visible: false,
		eyecandy_callback: null,
		page: home_page,
	}// state;


	pages = {
		home	: <HomePage parent={this} />,
		clients	: <ClientsPage />,
		projects: <ProjectsPage />,
		logging	: <LoggingPage />,
		reports	: <ReportsPage />,
		account	: <AccountPage parent={this.props.parent} />,
		settings: <SettingsPage />,	
	}// pages;


	static contextType = MainContext;


	static defaultProps = { 
		id: "master_page",
		parent: null
	}// defaultProps;


	constructor (props) {
		super (props);
		globals.master = this;
	}// componentDidMount;


	buttons_disabled () {
		let company_list = CompanyStorage.company_list ();
		if (common.is_empty (company_list) || (company_list.length == 1)) return false;
		if (CompanyStorage.company_selected ()) return false;
		return true;
	}// buttons_disabled;


	button_list () {
		let result = null;
		for (let key in master_pages) {

			let name = `${key}_button`;
			let value = master_pages [key].name;

			if (!(common.is_function (master_pages [key].permission) ? master_pages [key].permission () : master_pages [key].permission)) continue;
			if (common.is_null (result)) result = [];

			// TO DO - ADD A "GROUP" OPTION FOR SINGLE STICKY BUTTON OUT OF A BUTTON LIST/GROUP (when needed)
			result.push (<SelectButton id={name} name={name} key={name}
				disabled={this.buttons_disabled ()}
				onClick={() => this.setState ({ page: key })}>

				{value}

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
