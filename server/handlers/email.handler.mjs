import FileSystem from "fs";
import nodemailer from "nodemailer";

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
const inviter_name		= "RMPC Timelog Invitations";

const noreply_address	= `noreply@${timelog_domain}`;
const inviter_email		= `${inviter_name} <${noreply_address}>`;


const templates = {
	invitation:	"invitation",
}// templates;


export default class EmailHandler {


	request = null;
	response = null;
	fields = null;


	constructor (request, response, fields) {
		this.request = request;
		this.response = response;
		this.fields = fields;
	}// constructor;


	/********/


	create_invite = () => { return "id01234567890" } // Create a hash of company id and invite ([padded company id (8 chars)][padded invite id (8 chars created by DB insert )])


	get_template = (name, type) => {
		let contents = FileSystem.readFileSync (`${root_path}/server/templates/${name}.email.${type == email_types.text ? "txt" : "html"}`, `utf-8`);
		return contents.replace (`{{invitee}}`, this.fields.invitee_name)
			.replace (`{{inviter}}`, this.fields.inviter)
			.replace (`{{company}}`, this.fields.company)
			.replace (`{{domain}}`, this.request.hostname)
			.replace (`{{address}}`, `join?invite=${this.create_invite ().id}`);
	}// text_template;
	

	send_invitation = async () => {

		try {
			await nodemailer.createTransport (email_details).sendMail ({
				from: inviter_email,
				to: this.fields.invitee_address,
				subject: "You have been invited to travel through time",
				text: this.get_template (templates.invitation, email_types.text),
				html: this.get_template (templates.invitation, email_types.html),
			});
		} catch (except) {
			return this.response.send (`Error: ${except}`);
		}// try;

		this.response.send ("success");

	}// send_invitation;


}// EmailHandler;