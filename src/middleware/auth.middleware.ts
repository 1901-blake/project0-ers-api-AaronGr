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

    // TODO if this works refactor;
   const accessGranted = roles.some(role => {
     // For checking if a id parameter was sent with the request
      const id: number = parseURLForId(req.url);
      console.log(`Id: ${id}, Role: ${user.role.role}`);
      if (user.role.role === 'admin') {
        return true;
      } else if (user.role.role === role) {
          // If the user matches id passed, grant access
          if (id && user.userId === id) {
            return true;
            // Otherwise, allow if a financial manager
          } else if (user.role.role === 'finance-manager') {
              return true;
          } else {
              return false;
        }
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

function parseURLForId(url: string): number {
  let id: number;

  const urlParts: string[] = url.split('/');
  id = +urlParts[urlParts.length - 1];

  return id;
}