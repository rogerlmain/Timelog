const square_hostname = "connect.squareupsandbox.com";
const square_authorization = "EAAAENzB7zMQb2M5FW6MpbnIMXfvwLdonwGI9XxqtkwT86LvxuWpW4N_SyI67cjJ";


const square_paths = {
	card		: "v2/cards",
	customer	: "v2/customers",
	payment		: "v2/payments",
}// square_paths;


export default class PaymentHandler {


	response = null;


	constructor (response) { this.response = response }


	pay (square_data, path) {
		fetch (`https://${square_hostname}/${square_paths [path]}`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				"Square-Version": "2022-03-16",
				"Authorization": `Bearer ${square_authorization}`
			}/* headers */,
			body: square_data
		}).then (response => response.json ()).then (response => this.response.send (response)).catch (error => this.response.send (error));
	}// pay;


}// PaymentHandler;