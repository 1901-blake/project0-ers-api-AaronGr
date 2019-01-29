import { User } from '../models/user';
import { SessionFactory } from '../util/session-factory';

export class UserDao {
    public async getAllUsers(): Promise<User[]> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
          const result = await client.query('SELECT * FROM "user" INNER JOIN "role" USING(roleid);');
          return result.rows.map( user => {
              return {
                userId: user['userid'],
                username: user['username'],
                password: '',
                firstName: user['firstname'],
                lastName: user['lastname'],
                email: user['email'],
                role: {
                    roleId: user['roleid'],
                    role: user['role']
                }
              };
          });
        } finally {
            client.release(); // release connection
        }
    }
}