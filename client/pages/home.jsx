import React from "react";

import Container from "controls/container";
import BaseControl from "controls/abstract/base.control";
import SelectList from "controls/select.list";

import Credentials from "classes/storage/credentials";
import Companies from "classes/storage/companies";

import { globals } from "classes/types/constants";
import { isset, is_null, not_set } from "classes/common";


export default class HomePage extends BaseControl {


	static defaultProps = { 
		id: "home_page",
		parent: null
	}// defaultProps;


	render () {

		let name = Credentials.username ();
		let companies = Companies.list ();

		if (is_null (companies) || (companies.length == 1)) globals.master.setState ({ show_buttons: true });

		return (<div id={this.props.id}>

			<div className="two-column-grid centering-cell" style={{ width: globals.main.reference.clientWidth }}>
				
				<div>Welcome {isset (name) ? name : "person with money"}</div>

				<Container condition={(isset (companies) && (companies.length > 1))}>

					<SelectList data={companies} idField="company_id" textField="company_name" useHeader={true} onChange={event => {

						Companies.set ("active_company", event.target.value);
						this.props.parent.setState ({ show_buttons: true });

					}} />

				</Container>

				<Container condition={(isset (companies) && (companies.length == 1))}>
					<div>{isset (companies) ? companies [0].company_name : null}</div>
				</Container>

				<Container condition={not_set (companies)}>
					<div>Guest Account</div>
				</Container>

			</div>
			
		</div>);
	}// render;

}// HomePage;

