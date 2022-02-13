import "types/prototypes";

import * as common from "classes/common";
import BaseControl, { DefaultProps, DefaultState } from "controls/base.control";


export interface FormControlProps extends DefaultProps { formData?: object }


export default abstract class FormControl<iprops extends FormControlProps = FormControlProps, istate extends DefaultState = DefaultState> extends BaseControl<iprops, istate> {


	public static defaultProps: FormControlProps = { formData: null }


	protected validate (form: React.RefObject<HTMLFormElement>): boolean {
		for (let item of form.current) {
			let field = item as HTMLInputElement;
			if (field.required && common.is_empty (field.value)) return false;
		};
		return true;
	}// validate;
	

}// BaseControl;


export class Container extends BaseControl {}


