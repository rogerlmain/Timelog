import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import ContentsPanel from "client/controls/panels/contents.panel";

import RepositorySelector from "client/controls/selectors/repository.selector";

import AccountsModel from "client/classes/models/accounts.model";
import CompanyStorage from "client/classes/storage/company.storage";

import ActivityLog from "client/classes/activity.log";

import { isset, is_null, jsonify, not_set } from "client/classes/common";
import { blank } from "client/classes/types/constants";


export default class RepositoryAccounts extends BaseControl {


	state = { 
		team: null,
		repositories: null,
		users: null,
	}/* state */;


	/********/


	list_repository_accounts () {

		let index = 1;
		let result = null;

		if (not_set (this.state.team)) return null;

		Object.keys (this.state.team).forEach (key => {

			let teamster = this.state.team [key];

			if (is_null (result)) result = [];

			result.push (<div className="ghost-box" key={jsonify (teamster)}>
				<div>{teamster.last_name}, {teamster.first_name} {isset (teamster.friendly_name) ? `(${teamster.friendly_name})` : blank}</div>
				<RepositorySelector id={`repo_selector_${index++}`} />
			</div>);

		});

		return <div className="three-column-table">{result}</div>

	}/* list_repository_accounts */


	/********/


	componentDidMount () {
		AccountsModel.get_by_company (CompanyStorage.active_company_id ()).then (team => this.setState ({ team: team.group ("account_id") })).catch (ActivityLog.error);
	}// componentDidMount;


	render = () => <ContentsPanel index={isset (this.state.team) ? 2 : 1}>

		<div>No members</div>

		<div>
			<div className="section-header">Repository accounts</div>
			{this.list_repository_accounts ()}
		</div>

	</ContentsPanel>


}/* RepositoryAccounts */;