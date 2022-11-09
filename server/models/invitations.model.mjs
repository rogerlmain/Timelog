import Database from "../database.mjs";
import CompanyAccountsModel from "./company.accounts.model.mjs";


export default class InvitationsModel extends Database {


	accept = (account_id, invite_id) => {
		this.get_invitation_by_id (invite_id).then (async invite => {
			if (not_set (invite) || not_set (invite [0])) return;
			this.set_invitation ({ invite_id: invite_id }).then (() => {
				new CompanyAccountsModel (global.request (), global.response ()).save_company_account (account_id, invite [0].company_id);
			});
		});
	}// accept;

	decline = (account_id, invite_id) => this.set_invitation ({ invite_id: invite_id, invitee_account_id: account_id });

	get_by_id = invite_id => this.execute_query ("get_invitation_by_id", [invite_id]);
	get_by_email = invitee_email => this.execute_query ("get_by_email", [invitee_email]);

	save (data) {

		let parameters = {
			invite_id			: integer_value (data.invite_id ?? null),
			company_id			: integer_value (data.company_id),
			host_id				: integer_value (data.host_id),
			invitee_name		: data.invitee_name,
			invitee_email		: data.invitee_email,
			invitee_account_id	: integer_value (data.invitee_account_id ?? null),
		}// parameters;

		return this.data_query ("save_invitation", parameters);

	}/* save */;


}/* InvitationsModel */;