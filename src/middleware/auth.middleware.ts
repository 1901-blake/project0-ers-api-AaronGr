
/**
 * Checks that user has right authorization for next piece of middleware.
 * If they do pass the request to the next piece of middleware.
 * Otherwise, return unauthorized status.
 */

 export function authMiddleware(req, res, next, roleId) {
    const user = req.session.user;
    switch ( roleId ) {
        case 1:
          next();
          break;
        case 2:
          if (user && user.role.roleId === 2) {
              next();
          } else {
            res.status(401).json( { message: 'The incoming token has expired'} );
          }
          break;
        case 3:
          if (user && user.role.roleId === 3) {
            next();
          } else {
            res.status(401).json( { message: 'The incoming token has expired'} );
          }
          break;
        default:
          res.status(401).json( { message: 'The incoming token has expired'} );
    }
 }