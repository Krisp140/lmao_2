import debug from 'debug';
// Create a basic logger with component name prefix
export function forComponent(componentName) {
    const logger = debug(`ui:${componentName}`);
    return Object.assign(logger, {
        error: debug(`ui:${componentName}:error`),
        warn: debug(`ui:${componentName}:warn`),
        info: debug(`ui:${componentName}:info`),
        debug: debug(`ui:${componentName}:debug`)
    });
}
// Enable logging for specific namespaces
export function enable(namespaces) {
    debug.enable(namespaces);
}
