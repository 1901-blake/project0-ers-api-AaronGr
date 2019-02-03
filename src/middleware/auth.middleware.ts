import { Request } from 'express';
import { Response } from 'express-serve-static-core';

/**
 * Checks that user has right authorization for next piece of middleware.
 * If they do pass the request to the next piece of middleware.
 * Otherwise, return unauthorized status.
 */

 // Wrapper function to pass parameters needed to decide permissions
 export function authMiddleware(roles: string[], userId?: number) {
   return (req: Request, res: Response, next) => {
      const user = req.session.user;
      if (!user) {
        res.sendStatus(401);
        return;
      }

   const accessGranted = roles.some(role => {
      if (user.role.role === role) {
        return true;
      } else {
        return false;
      }
   });

   if (accessGranted) {
     next();
   } else {
     res.sendStatus(403);
   }
 };
}