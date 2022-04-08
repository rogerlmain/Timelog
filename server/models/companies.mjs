import Database from "../database.mjs";


export default class CompanyData extends Database {


	get_companies_by_account = async (account_id) => {
		let procedure = "get_companies_by_account";
		let parameters = [account_id];
		return this.data_query (procedure, parameters);
	}// get_companies_by_account;


	save_company = (data) => {

		let parameters = {
			company_id: global.isset (data.address_id) ? parseInt (data.address_id) : null,
			company_name: data.company_name,
			address_id: data.address_id,
			primary_contact_id: data.primary_contact_id,
			secondary_contact_id: data.secondary_contact_id,
			square_id: data.square_id
		}// parameters;

		this.execute_query ("save_company", parameters);

	}// save_address;



}// CompanyData;

