import Database from "../database.mjs";


export default class AddressData extends Database {


	save_address = (data) => {

		let parameters = {
			address_id: global.isset (data.address_id) ? parseInt (data.address_id) : null,
			company_id: parseInt (data.company_id),
			street_address: data.street_address,
			additional: data.additional,
			city: data.city,
			state_id: parseInt (data.state_id),
			country_id: parseInt (data.country_id),
			postcode: data.postcode
		}// parameters;

		this.execute_query ("save_address", parameters);

	}// save_address;


}// AddressData;

