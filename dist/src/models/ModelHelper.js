"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAlternatives = void 0;
exports.processAlternatives = function (fields) {
    var query = {};
    var orFields = __assign({}, fields);
    if (orFields == {})
        return fields;
    if (orFields.range != undefined) {
        delete orFields.range;
    }
    var _loop_1 = function (field) {
        var _a;
        if (query.$and == undefined) {
            query.$and = [];
        }
        if (typeof orFields[field] == 'string') {
            var fieldOptions = orFields[field].split(',');
            var orOptions_1 = {
                $or: []
            };
            fieldOptions.forEach(function (fieldOption) {
                var _a;
                orOptions_1.$or.push((_a = {}, _a[field] = fieldOption, _a));
            });
            query.$and.push(orOptions_1);
        }
        else {
            query.$and.push((_a = {}, _a[field] = orFields[field], _a));
        }
    };
    for (var field in orFields) {
        _loop_1(field);
    }
    return query;
};
