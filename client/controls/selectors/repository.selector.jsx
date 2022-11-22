import React from "react";

import OffshoreModel from "client/classes/models/offshore.model";

import BaseControl from "client/controls/abstract/base.control";
import DropDownList from "client/controls/lists/drop.down.list";
import SelectList from "client/controls/lists/select.list";

import Container from "client/controls/container";

import { is_null, jsonify, not_set } from "client/classes/common";
import { blank } from "client/classes/types/constants";


export default class RepositorySelector extends BaseControl {


	static defaultProps = { id: null }


	state = { 

		repositories: null,
		repository: null,

		users: null,

	}/* state */;


	load_users = event => {

		let [token, repository] = event.target.value.split ("-");
	
		OffshoreModel.get_users (parseInt (token), repository).then (result => {

			let list = null;
			let users = JSON.parse (result);

			users?.forEach (user => {
				if (is_null (list)) list = [];
				list.push ({ id: user.id, name: user.login });
			});

			this.setState ({ users: list });

		});

	}/* load_users */;


	save_offshore_account = event => {
	
		let [token_id, repository] = this.state.repository.split ("-");

		OffshoreModel.save_account (repository, token_id, event.target.value).then (result => alert (jsonify (result)));

	}/* save_offshore_account */;


	/********/


	componentDidMount = () => OffshoreModel.get_repositories ().then (response => this.setState ({ repositories: response }) );


	render = () => <Container>

		<DropDownList id={`${this.props.id}_repo_list`} headerVisible={true}
			data={this.state.repositories} idField={item => `${item.token}-${item.type}-${item.name}`} textField="name" 
			header="Repository" onChange={event => this.setState ({repository: event.target.value }, () => this.load_users (event))}>
		</DropDownList>

{/* 
		<SelectList id={`${this.props.id}_repo_list`} headerVisible={true}
			data={this.state.repositories} idField={item => `${item.token}-${item.type}-${item.name}`} textField="name" 
			header="Repository" onChange={event => this.setState ({repository: event.target.value }, () => this.load_users (event))}>
		</SelectList>
*/}
		<SelectList id={`${this.props.id}_user_list`} disabled={not_set (this.state.users)}
			data={this.state.users} idField="id" textField="name" header={this.state.repository}
			onChange={this.save_offshore_account}>
		</SelectList>


	</Container>


}// RepositorySelector;