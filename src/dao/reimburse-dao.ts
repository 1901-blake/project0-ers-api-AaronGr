import { Reimbursement } from '../models/reimbursement';
import { SessionFactory } from '../util/session-factory';

export class ReimbursementDao {
    public async getReimbursementById(id: number): Promise<Reimbursement> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
          const query = {
              text: `SELECT * FROM reimbursement WHERE reimbursementid = $1`,
              values: [id]
          };

          const result = await client.query(query);
          // Need to convert row data returned to a reimbursement javascript object
          console.log(result.rows[0]);
          return convertToReimbursementForResponse(result.rows[0]);
        } finally {
            client.release();
        }
    }

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

      public async updateReimbursement(reimb: Reimbursement): Promise<Reimbursement> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        console.log(reimb);
        try {
            const query = {
                text: `UPDATE reimbursement
                        SET author = $1,
                            amount = $2,
                            dateResolved = $3,
                            description = $4,
                            resolver = $5,
                            status = $6,
                            type = $7
                        WHERE reimbursementId = $8
                        RETURNING *`,
                values: [reimb.author, reimb.amount, reimb.dateResolved, reimb.description,
                         reimb.resolver, reimb.status, reimb.type, reimb.reimbursementId]
            };
            const result = await client.query(query);
            if (result.rows[0]) {
                return convertToReimbursementForResponse(result.rows[0]);
            } else {
                return undefined;
            }
        } finally {
            client.release();
        }
    }
}

function convertToReimbursementForResponse(reimbursementData: any): Reimbursement | PromiseLike<Reimbursement> {
    return {
        reimbursementId: reimbursementData['reimbursementid'],
        author: reimbursementData['author'],
        amount: reimbursementData['amount'],
        dateSubmitted: reimbursementData['datesubmitted'],
        dateResolved: reimbursementData['dateresolved'],
        description: reimbursementData['description'],
        resolver: reimbursementData['resolver'],
        status: reimbursementData['staus'],
        type: reimbursementData['type']
    };
}