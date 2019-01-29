import { Reimbursement } from '../models/reimbursement';
import { SessionFactory } from '../util/session-factory';

export class ReimbursementDao {
    public async getReimbursementsByStatusId(id: number): Promise<Reimbursement[]> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
          const query = {
              text: `SELECT * FROM reimbursement WHERE status = $1`,
              values: [id]
          };

          const result = await client.query(query);
          return result.rows;

        } finally {
            client.release(); // release connection
        }
    }

    public async getReimbursementsByUserId(id: number): Promise<Reimbursement[]> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
          const query = {
              text: `SELECT * FROM reimbursement WHERE author = $1`,
              values: [id]
          };

          const result = await client.query(query);
          return result.rows;

        } finally {
            client.release(); // release connection
        }
    }
}