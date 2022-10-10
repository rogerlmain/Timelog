import * as constants from "client/classes/types/constants";

import LocalStorage from "client/classes/local.storage";
import ClientStorage from "client/classes/storage/client.storage";
import CompanyStorage from "client/classes/storage/company.storage";
import OptionsStorage from "client/classes/storage/options.storage";

import ProjectModel from "client/classes/models/project.model";

import { isset, not_null, not_empty, is_promise, not_number } from "client/classes/common";


const store_name = constants.stores.projects;


export const default_name = "Default project";
export const default_description = `${default_name} description`;


export default class ProjectStorage extends LocalStorage {


	/**** Private Methods ****/


	static #set = values => { LocalStorage.set_store (store_name, values) };
	static #set_project = (client_id, data) => ((not_empty (data)) && ProjectStorage.#set ({ ...LocalStorage.get_all (store_name), [client_id]: Array.arrayify (data) }));


	/**** Public Methods *****/


	static save_project = form_data => {
		return new Promise ((resolve, reject) => {
			ProjectModel.save_project (form_data).then (data => {
				this.#set_project (data);
				resolve (data);
			}).catch (reject);
		});
	}/* save_project */;

/*
	static remove_project (project_id) {

		let values = LocalStorage.get_all (store_name);

		if (isset (values)) {
			let value = values.find (candidate => candidate.project_id == project_id);
			return LocalStorage.set_store (store_name, values.remove (value));
		}// if;

	}// remove_project;
*/


	static get_by_id (project_id) {
		return new Promise ((resolve, reject) => {

			let store = LocalStorage.get_all (store_name);
			let data = null;

			if (isset (store)) {

				Object.keys (store).forEach (key => {
					let next = store [key];
					if (next.project_id == project_id) return data = store [key];
				});

				if (isset (data)) resolve (data);
			
			}// if;

			ProjectModel.get_project_by_id (project_id).then (data => {
				this.#set_project (data.client_id, data);
				resolve (data);
			}).catch (reject);

		});
	}/* get_by_id */;


	static get_company_projects () {
		let store = LocalStorage.get_all (store_name);
		return (isset (store) ? store [CompanyStorage.active_company_id ()] : null);
	}// get_company_projects;


	static get_by_client (client_id) {
		return new Promise ((resolve, reject) => {

			let result = LocalStorage.get_all (store_name)?.[client_id];

			if (isset (result)) return resolve (result);
			if (not_number (client_id)) return resolve (null);

			ProjectModel.get_projects_by_client (client_id).then (data => {
				this.#set_project (client_id, data);
				resolve (data);
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

