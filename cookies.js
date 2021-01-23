const cookies = {

	get_cookie (name) {
		let cookie = global.request.headers.cookie;
		let result = null;
		if (cookie != null) {
			let cookie_list = cookie.split (";");
			cookie_list.forEach (crumb => {
				let parsed_cookie = crumb.split ("=");
				if (parsed_cookie.length != 2) throw "Invalid cookie length: " + cookie;
				if (parsed_cookie [0].trim () == name.trim ()) {
					result = parsed_cookie [1];
					return false;
				}// if;
			});
		}// if;
		return result;
	}// get_cookie;

}// cookies;

module.exports = cookies;