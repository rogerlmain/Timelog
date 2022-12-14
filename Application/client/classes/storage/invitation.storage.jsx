import LocalStorage from "client/classes/local.storage";

import { isset } from "client/classes/common";


const store_name = "invitation";


export default class InvitationStorage extends LocalStorage {


	static get_store = () => LocalStorage.get_store (store_name);
	static set_store = values => LocalStorage.set_store (store_name, values);
	static clear_store = () => LocalStorage.clear_store (store_name);


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


	static get_invitation = () => InvitationStorage.invitation_data (localStorage.getItem ("invitation"));


}// InvitationStorage;