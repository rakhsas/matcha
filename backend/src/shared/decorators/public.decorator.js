import 'reflect-metadata';

export function Public(target, propertyKey, descriptor) {
    console.log('Public Decorator:', target, propertyKey, descriptor);
    Reflect.defineMetadata('isPublic', true, descriptor.value);
    return descriptor;
}
