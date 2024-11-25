import { ZodError } from 'zod';
import { HttpStatus } from 'http-status-ts';
export function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errorMsg = error.errors[0].path.toString().toUpperCase() + ' ' + error.errors[0].message;
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid data', details: errorMsg });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    };
}
