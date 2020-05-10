"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAlternatives = (fields) => {
    let query = {};
    let orFields = Object.assign({}, fields);
    if (orFields == {})
        return fields;
    if (orFields.range != undefined) {
        delete orFields.range;
    }
    for (let field in orFields) {
        if (query.$and == undefined) {
            query.$and = [];
        }
        if (typeof orFields[field] == 'string') {
            const fieldOptions = orFields[field].split(',');
            let orOptions = {
                $or: []
            };
            fieldOptions.forEach((fieldOption) => {
                orOptions.$or.push({ [field]: fieldOption });
            });
            query.$and.push(orOptions);
        }
        else {
            query.$and.push({ [field]: orFields[field] });
        }
    }
    return query;
};
//# sourceMappingURL=ModelHelper.js.map