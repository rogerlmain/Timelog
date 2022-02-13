import * as common from "classes/common";


export default class DataModel {

	
    protected static data_object (datatype: any, callback: Function) {
        return (parameters: any) => {
            if (common.is_function (callback)) callback (Array.isArray (parameters) ? (((): any => {
                let result: any = null;
                parameters.forEach (item => {
                    if (common.is_null (result)) result = new Array<typeof datatype> ();
                    result.push (Object.assign (item, new datatype ()))
                });
                return result;
            })()) : Object.assign (parameters, new datatype ()));
        };
    }// data_object;


}// DataModel;