import LocalStorage from "client/classes/local.storage";
import InvitationsModel from "client/classes/models/invitations.model";

import { isset, not_set } from "client/classes/common";


const store_name = "invitation";


export default class InvitationStorage extends LocalStorage {


	static invitation_data = () => {

		let invitation = localStorage.getItem (store_name);

		const next_item = () => {

			let length = parseInt (invitation.substr (0, 2));
			let response = (length > 0) ? parseInt (invitation.substr (2, length)) : null;
						
			invitation = invitation.slice (length + 2);

			return response;

		}/* next_item */;

		return isset (invitation) ? {
			invite_id: next_item (),
			company_id: next_item (),
			host_id: next_item (),
			invitee_account_id: next_item (),
			date_created: new Date (next_item () * 1000),
		} : null;

	}/* invitation_data */;


	static get_invitation = () => new Promise ((resolve, reject) => {

		let invitation = this.invitation_data (localStorage.getItem ("invitation"));

		if (not_set (invitation) || not_set (invitation.invite_id)) return resolve (null);
		InvitationsModel.get_by_id (invitation.invite_id).then (result => resolve (result?.[0])).catch (reject);

	})/* get_invitation */;


}// InvitationStorage;