/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

export const processAlternatives = (fields: any) => {
    let query: any = {};
    let orFields: any = { ...fields };

    if (orFields == {}) return fields;

    if (orFields.range != undefined) {
        delete orFields.range;
    }

    for (let field in orFields) {
        if (query.$and == undefined) {
            query.$and = []
        }

        if (typeof orFields[field] == 'string') {
            const fieldOptions: any = orFields[field].split(',');
            let orOptions: any = {
                $or: []
            }

            fieldOptions.forEach((fieldOption: any) => {
                orOptions.$or.push({ [field]: fieldOption });
            })

            query.$and.push(orOptions);
        } else {
            query.$and.push({ [field]: orFields[field] });
        }
    }

    return query;
}