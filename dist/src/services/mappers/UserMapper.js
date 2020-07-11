"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserToDTO = void 0;
function mapUserToDTO(user) {
    ['_id', '__v', 'password', 'is_deleted', 'is_active', 'createdAt', 'is_verified']
        .forEach(function (field) { return Reflect.deleteProperty(user, field); });
    return;
}
exports.mapUserToDTO = mapUserToDTO;
