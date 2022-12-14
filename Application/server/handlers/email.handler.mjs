import "../prototypes.mjs";

import FileSystem from "fs";
import nodemailer from "nodemailer";

import InvitationsModel from "../models/invitations.model.mjs";
import AccountsModel from "../models/accounts.model.mjs";

import { root_path } from "../constants.mjs";


const email_details = {
	host: "mail.rexthestrange.com",
	port: 465,
	auth: {
		user: "timelog@rexthestrange.com",
		pass: "Dx1A1=y_gG^@",
	}// email_details;
}// auth;


const email_types = {
	text: "text",
	html: "html",
}// email_types;


const timelog_domain	= "rexthestrange.com";	// FOR DEBUGGING - CHANGE TO OFFICIAL ONE WHEN FINAL NAME IS DECIDED
const inviter_name		= "Bundion Timelog Invitations";

const noreply_address	= `noreply@${timelog_domain}`;
const inviter_email		= `${inviter_name} <${noreply_address}>`;


const templates = {
	invitation:	"invitation",
}// templates;


export default class EmailHandler {


	fields = null;


	constructor (fields) {
		this.fields = fields;
	}// constructor;


	/********/


	#get_template = (name, type, values) => {
		let contents = FileSystem.readFileSync (`${root_path}/server/templates/${type}/${name}.email.${type == email_types.text ? "txt" : "html"}`, `utf-8`);
		for (let [name, value] of Object.entries (values)) contents = contents.replace (`{{${name}}}`, value);
		return contents;
	}// #text_template;
	

	/**** Creates an ICD or Invitation Code ****/


	create_invite = (invitation) => { 

		let encode_string = (number) => { return  (global.is_null (number) || isNaN (number)) ? "00" : `${number.toString ().length.padded (2)}${number.toString ()}` }

		let result = encode_string (invitation.invite_id) +
			encode_string (invitation.company_id) +
			encode_string (invitation.host_id) +
			encode_string (invitation.invitee_account_id) +
			encode_string (invitation.date_created) +
			encode_string (Number.random (10, 99));

			return result;

	}// create_invite;


	invitation_template = (invitation, type) => {
		return this.#get_template (templates.invitation, type, {
			invitee: this.fields.invitee_name,
			host: this.fields.host_name,
			company: this.fields.company_name,
			domain: `${this.fields.server_host}:${this.fields.server_port}`,
			address: `?icd=${this.create_invite (invitation)}`,
		});
	}// text_template;
	

	send_invitation = () => {
		try {
			new AccountsModel ().get_by_email (this.fields.invitee_email).then (account => {

				this.fields.invitee_account_id = (account.length > 0) ? account [0].account_id : null;

				new InvitationsModel ().save (this.fields).then (invitation => {

					if (!Array.isArray (invitation) || (invitation.length == 0)) return response ().send ("Error: invitation not sent");

					nodemailer.createTransport (email_details).sendMail ({
						from: inviter_email,
						to: this.fields.invitee_email,
						subject: "You have been invited to travel through time",
						text: this.invitation_template (invitation [0], email_types.text),
						html: this.invitation_template (invitation [0], email_types.html),
					}).then (() => response ().send (JSON.stringify (invitation)));

				});

			});
		} catch (except) {
			return response ().send (`Error: ${except}`);
		}// try;
	}// send_invitation;


}// EmailHandler;