import { fileURLToPath } from "url";
import { dirname } from "path";

export const server_path = dirname (fileURLToPath (import.meta.url));
export const root_path = server_path.substring (0, server_path.indexOf (process.platform.equals ("linux") ? "/server" : "\\server")).replaceAll ("\\", "/");
