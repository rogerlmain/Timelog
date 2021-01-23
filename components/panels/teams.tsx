import React from "react";

import { account, team } from "components/types/datatypes";

import BaseControl from "components/controls/base.control";
import FadeControl from "components/controls/fade.control";
import SelectButton from "components/controls/select.button";

import PopupWindow from "components/panels/gadgets/popup.window";

import { account_types } from "components/types/constants";


const free_account_team_count = 2;
const freelance_team_count = 5;


export default class TeamPanel extends BaseControl<any> {


	private team_available () {
		let account = this.current_account ();
		switch (account.account_type) {
			case account_types.free.value: return account.teams.length < free_account_team_count;
			case account_types.freelance.value: return account.teams.length < freelance_team_count;
			default: return true;
		}// switch;
	}// team_available;


	// private new_team_window () {
	// 	return (
	// 		<label htmlFor="team_name_input">Team name</label>
	// 		<input type="text" id="team_name_input" />

	// 		<SelectButton id="save_team_button">Save</SelectButton>
	// 	);
	// }// new_team_window;


	/********/


	public state = {
		teams: null,
		team_list: null,
		list_loaded: false,
		team_button_clicked: false
	}// state;


	public constructor (props) {
		super (props);
		this.fetch_team_list = this.fetch_team_list.bind (this);
	}// constructor;


	public componentDidMount () {
		this.fetch_items ("team", { action: "team_list" }, (data: any) => {
			this.setState ({ teams : data });
		});
	}// componentDidMount;


	public fetch_team_list (event) {
		this.fetch_items ("team", {
			action: "member_list",
			team_id: event.target.value
		}, (data: account []) => {
			this.setState ({
				team_list: data.map ((item) => {
					return (<div key={item.account_id}>{item.first_name} {item.last_name}</div>);
				})
			}, () => {
				this.setState ({ list_loaded: true });
			});
		});
	}// fetch_team_list


	public render () {

		return (
			<div>

				<link rel="stylesheet" href="/resources/styles/panels/team.panel.css" />
{/*
				{this.new_team_window ()}
 */}
				<div className="team_list_panel">

					<label htmlFor="client_selector">Team</label>

					<select id="client_selecter" name="client_id" defaultValue="placeholder"

						onChange={this.fetch_team_list}>

						<option value="placeholder" key="placeholder" disabled={true} />
						{this.select_options (this.state.teams, "team_id", "team_name")}

					</select>

					<SelectButton rendered={this.team_available} key="create_team_button" id="create_team_button"
						style={{
							fontSize: "7pt",
							height: "2.1em"
						}}
						onclick={() => {
							this.props.parent.setState ({ popup: true });
						}// onclick;
					}>New team</SelectButton>

				</div>

				<FadeControl visible={this.state.list_loaded}>
					<div id="team_list">{this.state.team_list}</div>
				</FadeControl>

{/*
					<div id="company_selection">

						<c:if test="#{size eq 0}">
							<!-- Should never happen -->
							You are not associated with any companies.
							#{bean.record_error ("Zero company size in team panel")}
						</c:if>

						<c:if test="#{size gt 0}">
							<h:outputLabel value="Company: #{companyBean.selectedCompany.name}" />
						</c:if>

					</div>

					<div id="team_list">
						<div layout="block" rendered="#{companyBean.companySelected}" class="team-list">

							<content-panel class="list-header">
								<div>Last name</div>
								<div>First name</div>
								<div>Email address</div>
							</content-panel>

							<ui:repeat value="#{bean.teamsters}" var="member">
								<h:panelGroup id="list_item_#{member.accountID}"  layout="block" class="list-item #{bean.getSelectedTeamsterStyle (member.accountID)}">
									<p:ajax event="click" process="@parent @this"
										listener="#{bean.select_teamster (member.accountID)}"
										update="tabview:team_form:team_list tabview:team_form:teamster_options_panel">
									</p:ajax>
									<div>#{member.firstName}</div>
									<div>#{member.lastName}</div>
									<div>#{member.emailAddress}</div>
								</h:panelGroup>
							</ui:repeat>

						</div>
					</div>

					<div id="teamster_options_panel" style="margin-top: 1em; text-align: right">

						<div rendered="#{bean.teamsterSelected}">
							<p:commandButton id="remove" value="Remove" />
							<p:commandButton id="email" value="Email" />
						</div>

						<p:commandButton id="invite" value="Invite"
							actionListener="#{bean.show_dialog}" ajax="true"
							process="@this" update=":signing_form:dialog_panel">
						</p:commandButton>

					</div>
*/}

			</div>
		);

	}// render;

}// HomePanel;