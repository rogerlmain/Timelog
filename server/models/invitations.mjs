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


	get_invitation_by_id (invitation_id) {

		let procedure = "get_invitations";
		let parameters = [invitation_id, null, null];

		this.execute_query (procedure, parameters);

	}/* get_invitation_by_id */;


	get_invitation_by_email (invitee_email) {

		let procedure = "get_invitations";
		let parameters = [null, null, invitee_email];

		this.execute_query (procedure, parameters);

	}/* get_invitation_by_email */;


	get_invitations_by_company (company_id) {

		let procedure = "get_invitations";
		let parameters = [null, company_id, null];

		this.execute_query (procedure, parameters);
		
	}/* get_invitations_by_client */;


}/* InvitationData */;