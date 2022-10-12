import LocalStorage from "client/classes/local.storage";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import ProjectModel from "client/classes/models/project.model";

import { stores } from "client/classes/types/constants";
import { isset, not_null, not_empty, is_promise, not_number, not_set, live } from "client/classes/common";


const store_name = stores.projects;


export const default_name = "Default project";
export const default_description = `${default_name} description`;


export default class ProjectStorage extends LocalStorage {


	/**** Private Methods ****/


	static #get = () => LocalStorage.get_all (store_name);


	static #set = values => { LocalStorage.set_store (store_name, values) };


	static #set_project_by_id = (client_id, project_id, data) => {

		let projects = LocalStorage.get_all (store_name);
		let company_id = CompanyStorage.active_company_id ();

		if (not_set (projects)) projects = {};
		if (not_set (projects [company_id])) projects [company_id] = {};
		if (not_set (projects [company_id][client_id])) projects [company_id][client_id] = {};

		projects [company_id][client_id][project_id] = data;

		ProjectStorage.#set (projects);

	}/* #set_project_by_id */;


	static #set_project = project => {

		let client_id = project.client_id;
		let project_id = project.project_id;

		if (live ()) {
			delete project.company_id;
			delete project.client_id;
			delete project.project_id;
		}// if;

		ProjectStorage.#set_project_by_id (client_id, project_id, project);
		return project;

	}/* #set_project */;


	/**** Public Methods *****/


	static save_project = form_data => new Promise ((resolve, reject) => ProjectModel.save_project (form_data).then (data => {
		ProjectStorage.#set_project (data);
		resolve (data);
	}).catch (reject));


	static get_by_id (project_id) {
		return new Promise ((resolve, reject) => {

			let store = this.#get ();
			let project_data = null;

			if (not_set (project_id)) return resolve (null);

			if (isset (store)) Object.keys (store).forEach (company_id => Object.keys (store [company_id]).forEach (client_id => {
				if (isset (store [company_id][client_id][project_id])) project_data = store [company_id][client_id][project_id];
			}));

			if (isset (project_data)) return resolve (project_data);
				
			ProjectModel.get_project_by_id (project_id).then (data => resolve (this.#set_project (data))).catch (reject);

		});
	}/* get_by_id */;


	static get_by_client (client_id) {
		return new Promise ((resolve, reject) => {

			let result = this.#get ()?.[CompanyStorage.active_company_id ()]?.[client_id];

			if (isset (result)) return resolve (result);
			if (not_number (client_id)) return resolve (null);

			ProjectModel.get_projects_by_client (client_id).then (data => {

				let project_count = data.length;
				
				if (project_count == 0) return resolve (data); // return an empty array - it's how to distinguish unread from no value

				data.forEach (project => {
					ProjectStorage.#set_project (project);
					if (--project_count == 0) ProjectStorage.get_by_client (client_id).then (data => resolve (data));
				});

			}).catch (reject);

		});
	}// get_by_client;


	/********/


	static project_rate = (project_id, new_rate = null) => {

		if (isset (new_rate)) { 
			// SAVE NEW RATE
			return;
		}// if;

		return new Promise (async (resolve, reject) => {

			if (isset (project_id)) {

				let project = this.get_by_id (project_id);

				if (is_promise (project)) return project.then (data => resolve (data.billing_rate));
				resolve (project?.billing_rate);

			}// if;

			resolve (null);

		});

	}/* project_rate */


	static billing_rate = (project_id, client_id) => {
		return new Promise ((resolve, reject) => {
			ProjectStorage.project_rate (project_id).then (result => {
				if (not_null (result)) return resolve (result);
				ClientStorage.client_rate (client_id).then (result => {
					if (not_null (result)) return resolve (result);
					resolve (OptionsStorage.default_rate () ?? 0);
				}).catch (error => {
					console.log (error);
					reject (error);
				})
			});
		});
	}// billing_rate;


}// ProjectStorage;

