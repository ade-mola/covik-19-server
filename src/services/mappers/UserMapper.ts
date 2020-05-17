
export function mapUserToDTO(user: any) {
        
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, '_id');
        Reflect.deleteProperty(user, '__v');
        return;
}