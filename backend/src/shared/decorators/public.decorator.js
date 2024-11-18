export function isPublic(handler) {
    return (req, res, next) => {
        req.isPublic = true;
        return handler(req, res, next);
    };
}