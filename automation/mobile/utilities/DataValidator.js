export class DataValidator {
    static validate(schema, data) {
        if (!schema || !data) return { valid: false, errors: ['Missing schema or data'] };
        let errors = [];
        
        // Type validation
        if (schema.type === 'object' && typeof data !== 'object') errors.push('Data must be an object');
        
        // Required fields
        if (schema.required) {
            for (let req of schema.required) {
                if (!(req in data)) errors.push(`Missing required field: ${req}`);
            }
        }
        
        // Properties
        if (schema.properties) {
            for (let key in data) {
                const propSchema = schema.properties[key];
                if (propSchema) {
                    if (propSchema.type === 'string' && typeof data[key] !== 'string') errors.push(`${key} must be a string`);
                    if (propSchema.type === 'number' && typeof data[key] !== 'number') errors.push(`${key} must be a number`);
                    if (propSchema.enum && !propSchema.enum.includes(data[key])) errors.push(`${key} must be one of ${propSchema.enum.join(',')}`);
                }
            }
        }
        
        if (errors.length > 0) {
            throw new Error(`Schema validation failed: ${errors.join('; ')}`);
        }
        return true;
    }
}