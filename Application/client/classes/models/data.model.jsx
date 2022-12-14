import * as common from "client/classes/common";


export default class DataModel {

	
	static data_object (datatype, callback) {
		return (parameters) => {
            if (common.is_function (callback)) callback (Array.isArray (parameters) ? ((() => {
                let result = null;
                parameters.forEach (item => {
                    if (common.is_null (result)) result = new Array ();
                    result.push (Object.assign (item, new datatype ()))
                });
                return result;
            })()) : Object.assign (parameters, new datatype ()));
        };
    }// data_object;


}// DataModel;