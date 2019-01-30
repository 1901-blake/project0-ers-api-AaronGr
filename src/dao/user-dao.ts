import { User } from '../models/user';
import { SessionFactory } from '../util/session-factory';

export class UserDao {

    public async checkUserLogin(username: string, password: string): Promise<User> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "user" INNER JOIN "role" USING(roleid)
                                               WHERE username = $1 AND password = $2;`, [username, password]);
            if (result.rows[0]) {
                const userData = result.rows[0];
                return {
                    userId: userData['userid'],
                    username: userData['username'],
                    password: '',
                    firstName: userData['firstname'],
                    lastName: userData['lastname'],
                    email: userData['email'],
                    role: {
                        roleId: userData['roleid'],
                        role: userData['role']
                    }
                };
            } else {
                return undefined;
            }
        } finally {
            client.release();
        }
    }

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

    public async getUserByID(id: number): Promise<User> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
            const query = {
                text: `SELECT * FROM "user" INNER JOIN "role"
                       USING(roleid) WHERE "user".userid = $1`,
                values: [id]
        };
            const result = await client.query(query);
            if ( result.rows[0] ) {
                return {
                    userId: result.rows[0].userid,
                    username: result.rows[0].userid,
                    password: '',
                    firstName: result.rows[0].firstname,
                    lastName: result.rows[0].lastname,
                    email: result.rows[0].email,
                    role: {
                        roleId: result.rows[0].roleid,
                        role: result.rows[0].role
                    }
                };
            } else {
                return undefined;
            }
        } finally {
            client.release();
        }
    }
}