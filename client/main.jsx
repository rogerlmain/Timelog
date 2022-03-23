import "regenerator-runtime/runtime.js";

import React from "react";
import ReactDOM from "react-dom";

import BaseControl from "controls/base.control";
import ExplodingPanel from "controls/panels/exploding.panel";

import MasterPanel from "client/master";

import SigninPage from "pages/sign.in";
import SignupPage from "pages/sign.up";

import { globals } from "types/globals";
import { notify } from "classes/common";

import "client/resources/styles/main.css";


// Special Guest Import
import CreditCardForm from "pages/forms/credit.card.form";


class Main extends BaseControl {


	state = { signing_up: false }


	constructor (props) {
		super (props);
		globals.main = this;
		window.onerror = this.error_handler;
	}// constructor;


	error_handler (message, url, line) { notify (message, url, line) }


    render () {

		return (

			<div style={{ display: "flex", flexDirection: "column" }}>

				<div className="page-header">
					<div className="title">RMPC Timelog</div>
					<div className="tagline">Make every second count</div>
				</div>
				
 				<ExplodingPanel id="main_panel">
					{this.signed_in () ? <MasterPanel parent={this} /> : (this.state.signing_up ? <SignupPage parent={this} /> : <SigninPage parent={this} />)}
 				</ExplodingPanel>

			</div>

 		);

 	}// render;

}// Main;


document.onreadystatechange = () => {

//	ReactDOM.render (<Main id="timelog_main_page" />, document.getElementById ("main_page"));
	ReactDOM.render (<CreditCardForm visible={true} id="special_guest_import" />, document.getElementById ("main_page"));

}// document.ready;