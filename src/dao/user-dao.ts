import { User } from '../models/user';
import { SessionFactory } from '../util/session-factory';

// TODO Catch Promise Errors
export class UserDao {

    public async checkUserLogin(username: string, password: string): Promise<User> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
            const result = await client.query(`SELECT * FROM "user" INNER JOIN "role" USING(roleid)
                                               WHERE username = $1 AND password = $2;`, [username, password]);
            if (result.rows[0]) {
                return convertToUserForResponse(result.rows[0]);
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
          return result.rows.map ( user => {
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
                return convertToUserForResponse(result.rows[0]);
            } else {
                return undefined;
            }
        } finally {
            client.release();
        }
    }

    public async updateUser(user: User): Promise<User> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
            const query = {
                text: `UPDATE "user"
                        SET username = $1,
                            firstname = $2,
                            lastname = $3,
                            email = $4,
                            roleid = $5
                        WHERE userid = $6
                        RETURNING *`,
                values: [user.username,  user.firstName, user.lastName,
                         user.email, user.role.roleId, user.userId]
            };
            const result = await client.query(query);
            if (result.rows[0]) {
                return convertToUserForResponse(result.rows[0]);
            } else {
                return undefined;
            }
        } finally {
            client.release();
        }
    }
}

function convertToUserForResponse(userData: any): User | PromiseLike<User> {
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
}
