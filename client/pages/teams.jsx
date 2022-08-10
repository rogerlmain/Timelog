import React from "react";
import BaseControl from "client/controls/abstract/base.control";
import SelectList from "client/controls/lists/select.list";
import AccountsModel from "client/classes/models/accounts.model";
import CompanyStorage from "client/classes/storage/company.storage";
import Container from "client/controls/container";


export default class TeamsPage extends BaseControl {


	state = {
		team			: null,
		selected_account: null,
	}// state;


	constructor (props) {
		super (props);
		AccountsModel.fetch_by_company (CompanyStorage.active_company_id ()).then (team => (this.state.team = team));
	}// constructor;


	render () { 
		return <Container>
			<SelectList data={this.state.team} id_field="account_id" text_field="full_name" onChange={value => this.setState ({ selected_account: value })} />
		</Container>
	}// render;

}// HomePage;