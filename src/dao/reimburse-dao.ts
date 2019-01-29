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

    public async submitReimbursement(reimb: Reimbursement): Promise<Reimbursement> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
          const result = await client.query(
            `INSERT INTO reimbursement (author, amount, datesubmitted,
                dateresolved, description, status, "type")
              VALUES  ($1, $2, $3, $4, $5, $6, $7)
              RETURNING *`,
            [reimb.author, reimb.amount, Math.floor(Date.now() / 1000),
             0, reimb.description, 1, reimb.type]
          );
          if (result.rows[0]) {
            return result.rows[0];
          } else {
            return undefined;
          }
        } finally {
          client.release(); // release connection
        }
      }
}