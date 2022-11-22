import React from "react";

import BaseControl from "client/controls/abstract/base.control";
import SelectButton from "client/controls/buttons/select.button";
import ContentsPanel from "client/controls/panels/contents.panel";

import TeamPermissions from "client/pages/subpages/team.permissions";
import RepositoryAccounts from "client/pages/subpages/repository.accounts";


import "resources/styles/pages/team.css";


const team_panels = {
	permissions			: 1,
	repository_accounts	: 2,
}// team_panels;


export default class TeamsPage extends BaseControl {


	teamster_panel = React.createRef ();
	edit_team_panel = React.createRef ();


	state = {
		permissions		: null,
		current_panel	: team_panels.permissions,
	}// state;


	/********/


	render = () => <div className="two-column-grid full-width">

		<div className="button-column">

			<SelectButton id="account_options_button" className="sticky-button" 

				selected={this.state.current_panel == team_panels.permissions} 
				onClick={() => this.setState ({ current_panel: team_panels.permissions })}>
					
				Teamster Permissions
				
			</SelectButton>

			<SelectButton id="user_settings_button" className="sticky-button" 

				selected={this.state.current_panel == team_panels.repository_accounts} 
				onClick={() => this.setState ({current_panel: team_panels.repository_accounts })}>
					
				Repository Accounts
				
			</SelectButton>

		</div>					

		<ContentsPanel index={this.state.current_panel} stretchOnly={true}>
			<TeamPermissions />

			<div>Informational - Show assignations or something</div>
			{/* <RepositoryAccounts /> */}


		</ContentsPanel>

	</div>


}// HomePage;