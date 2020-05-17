
export function mapUserToDTO(user: any) {
        Reflect.deleteProperty(user, '_id');
        Reflect.deleteProperty(user, '__v');
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'is_deleted');
        Reflect.deleteProperty(user, 'is_active');
        Reflect.deleteProperty(user, 'createdAt');
        return;
}