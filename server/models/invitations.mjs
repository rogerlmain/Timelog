import Database from "../database.mjs";
import CompanyAccountsData from "./company.accounts.mjs";


export default class InvitationData extends Database {


	set_invitation (data) {

		let procedure = "set_invitation";

		let parameters = {
			invite_id			: data.invite_id,
			company_id			: data.company_id,
			host_id				: data.host_id,
			invitee_name		: data.invitee_name,
			invitee_email		: data.invitee_email,
			invitee_account_id	: data.invitee_account_id,
		}// parameters;

		return this.data_query (procedure, parameters);

	}/* set_invitation */;


	get_invitation_by_id = invite_id => { return this.data_query ("get_invitation_by_id", [invite_id]) }
	get_invitations_by_email = invitee_email => { this.execute_query ("get_invitations_by_email", [invitee_email]) }

	decline_invitation = (account_id, invite_id) => this.set_invitation ({ invite_id: invite_id, invitee_account_id: account_id });

	accept_invitation = (account_id, invite_id) => {

		this.get_invitation_by_id (invite_id).then (async invite => {

			if (global.not_set (invite) || global.not_set (invite [0])) return;

			this.set_invitation ({ invite_id: invite_id, invitee_account_id: account_id }).then (() => new CompanyAccountsData (this.request, this.response).set_company_account (account_id, invite [0].company_id));

		});

	}// accept_invitation;



}/* InvitationData */;