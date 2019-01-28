import { Pool } from 'pg';

export class SessionFactory {

    static cred = {
        // Use environment variables to keep code portable
        database: process.env.PostgreSQLDB,
        host: process.env.PostgreSQLEndpoint,
        user: process.env.PostgreSQLUser,
        password: process.env.PostgreSQLPassword,
        max: 10 // Can crash RDS if this is too high for our DB
    };

    static pool: Pool;

    static created = false;

    static getConnectionPool(): Pool {
        if (!this.created) {
            this.pool = new Pool(this.cred);
            this.created = true;
        }
        return this.pool;
    }
}