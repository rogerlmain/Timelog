export default class FormHandler {

	static extract_address (form_data) {
		return {
			address_line_1: form_data.street_address,
			address_line_2: form_data.additional_address,
			administrative_district_level_1: form_data.city,
			locality: form_data.district_name,
			postal_code: form_data.zip,
			country: form_data.country_name
		};
	}// extract_address;

}// FormHandler;