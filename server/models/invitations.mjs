import Database from "../database.mjs";


export default class InvitationData extends Database {


	set_invitation (data) {

		let procedure = "set_invitation";

		let parameters = {
			company_id			: data.company_id,
			host_id				: data.host_id,
			invitee_name		: data.invitee_name,
			invitee_email		: data.invitee_email,
			invitee_account_id	: data.invitee_account_id,
		}// parameters;

		return this.data_query (procedure, parameters);

	}/* set_invitation */;


	get_invitation_by_id = invitation_id => { return this.data_query ("get_invitations", [invitation_id, null, null]) }

	get_invitations_by_company = company_id => { this.execute_query ("get_invitations", [null, company_id, null]) }
	get_invitations_by_email = invitee_email => { this.execute_query ("get_invitations", [null, null, invitee_email]) }


}/* InvitationData */;