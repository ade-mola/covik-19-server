
export function mapUserToDTO(user: any) {
        ['_id', '__v', 'password', 'is_deleted', 'is_active', 'createdAt', 'is_verified']
        .forEach( field => Reflect.deleteProperty(user, field))
        return;
}