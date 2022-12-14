import LocalStorage from "client/classes/local.storage";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import ProjectModel from "client/classes/models/project.model";

import { stores } from "client/classes/types/constants";
import { isset, not_null, not_empty, is_promise, not_number, not_set, live, is_null } from "client/classes/common";
import OffshoreModel from "../models/offshore.model";
import { repository_type } from "client/forms/offshore.accounts.form";


const store_name = stores.projects;


export const default_name = "Default project";
export const default_description = `${default_name} description`;


export default class ProjectStorage extends LocalStorage {


	/**** Private Methods ****/


	static get_store = () => LocalStorage.get_store (store_name);
	static set_store = values => { LocalStorage.set_store (store_name, values) };


	/********/


	static #delete = project_id => {

		let projects = this.get_store ();
		let found = false;

		for (let company_id of Object.keys (projects)) {

			for (let client_id of Object.keys (projects [company_id])) {
				if (isset (projects [company_id][client_id][project_id])) {
					delete projects [company_id][client_id][project_id];
					found = true;
					break;
				}// if;
			}// for;

			if (found) {
				this.set_store (projects);
				break;
			}// if;

		}// for;

	}// #delete;


	static set_store_by_id = (client_id, project_id, data) => {

		let projects = this.get_store ();
		let company_id = CompanyStorage.active_company_id ();

		if (not_set (projects)) projects = {};
		if (not_set (projects [company_id])) projects [company_id] = {};
		if (not_set (projects [company_id][client_id])) projects [company_id][client_id] = {};

		projects [company_id][client_id][project_id] = data;

		ProjectStorage.set_store (projects);

	}/* set_store_by_id */;


	static set_store_project = project => {

		let client_id = project.client_id;
		let project_id = project.project_id;

		if (live ()) {
			delete project.company_id;
			delete project.client_id;
			delete project.project_id;
		}// if;

		ProjectStorage.set_store_by_id (client_id, project_id, project);
		return project;

	}/* set_store_project */;


	/**** Public Methods *****/
 

	static delete_project = project_id => {

		let data = new FormData ().appendAll ({
			action: "save",
			deleted: true,
			project_id, project_id,
		});

		return new Promise ((resolve, reject) => ProjectModel.save_project (data).then (result => {
			ProjectStorage.#delete (project_id);
			resolve (true);
		}).catch (reject));

	}/* delete_project */

	
	static save_project = form_data => new Promise ((resolve, reject) => ProjectModel.save_project (form_data).then (data => {
		ProjectStorage.set_store_project (data);
		resolve (data);
	}).catch (reject));


	static get_by_id (project_id) {
		return new Promise ((resolve, reject) => {

			let store = this.get_store ();
			let project_data = null;

			if (not_set (project_id)) return resolve (null);

			if (isset (store)) Object.keys (store).forEach (company_id => Object.keys (store [company_id]).forEach (client_id => {
				if (isset (store [company_id][client_id][project_id])) project_data = store [company_id][client_id][project_id];
			}));

			if (isset (project_data)) return resolve (project_data);
				
			ProjectModel.get_project_by_id (project_id).then (data => resolve (this.set_store_project (data))).catch (reject);

		});
	}/* get_by_id */;


	static get_by_client (client_id) {
		return new Promise ((resolve, reject) => {

			let result = this.get_store ()?.[CompanyStorage.active_company_id ()]?.[client_id];

			if (isset (result)) return resolve (result);

			ClientStorage.get_by_id (client_id).then (client => {

				if (isset (client.token_id)) return OffshoreModel.get_projects (client.token_id, client.name).then (projects => {
					
					projects.forEach (project => {
						project.client_id = client_id;
						ProjectStorage.set_store_project (project);
					});

					resolve (projects);
					
				});

				ProjectModel.get_projects_by_client (client_id).then (data => {

					let project_count = data.length;
					
					if (project_count == 0) return resolve (data); // return an empty array - it's how to distinguish unread from no value

					data.forEach (project => {
						ProjectStorage.set_store_project (project);
						if (--project_count == 0) ProjectStorage.get_by_client (client_id).then (data => resolve (data));
					});

				}).catch (reject);

			});

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

