import { fileURLToPath } from "url";
import { dirname } from "path";


const get_root_path = () => {
	if (process.platform.equals ("linux")) return server_path.substring (0, server_path.indexOf ("/server"));
	return server_path.substring (0, server_path.indexOf ("\\server")).replaceAll ("\\", "/");
}// get_root_path; 


export const server_path = dirname (fileURLToPath (import.meta.url));
export const root_path = get_root_path (); 

