import * as consts from "components/types/constants";


export function is_empty (value: any) {
	return !this.isset (value, consts.blank);
}// is_empty;


export function isset (value: any, ...nullables: any) {
	return this.not_null (value) && !nullables.includes (value);
}// isset;


export function is_null (value: any) {
	return value == null;
}// is_null;


export function not_empty (value: string) {
	return !this.is_empty (value);
}// not_empty;


export function not_null (value: any) {
	return !this.is_null (value);
}// not_null;


/********/


export let is_blank = is_empty;
export let not_blank = not_empty;

