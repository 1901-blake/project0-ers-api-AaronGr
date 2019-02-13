import { Reimbursement } from '../models/reimbursement';
import { SessionFactory } from '../util/session-factory';

const mainSelectStatement = `select reimbursement.reimbursementid,
                                    reimbursement.amount,
                                    reimbursement.author as authorid,
                                    reimbursement.datesubmitted,
                                    reimbursement.dateresolved,
                                    reimbursement.description,
                                    reimbursement.resolver as resolverid,
                                    reimbursement.status as statusid,
                                    reimbursement."type" as typeid,
                                    author.username as author_username,
                                    author."password" as author_password,
                                    author.firstname as author_firstname,
                                    author.lastname as author_lastname,
                                    author.email as author_email,
                                    author.roleid as author_roleid,
                                    author_role."role" as author_role,
                                    reimbursement_status.status as status_text,
                                    reimbursement_type."type" as type_text,
                                    resolver.username as resolver_username,
                                    resolver."password" as resolver_password,
                                    resolver.firstname as resolver_firstname,
                                    resolver.lastname as resolver_lastname,
                                    resolver.email as resolver_email,
                                    resolver.roleid as resolver_roleid,
                                    resolver_role."role" as resolver_role
                              FROM reimbursement
                              inner join "user" author on reimbursement.author = author.userid
                              inner join "role" author_role on author.roleid = author_role.roleid
                              left JOIN "user" resolver on reimbursement.resolver = resolver.userid
                              left join "role" resolver_role on resolver.roleid = resolver_role.roleid
                              inner join reimbursement_status on reimbursement.status = reimbursement_status.statusid
                              inner join reimbursement_type on reimbursement."type" = reimbursement_type.typeid`;

export class ReimbursementDao {
  public async getAllReimbursements(): Promise<Reimbursement[]> {
    const pool = SessionFactory.getConnectionPool();
    const client = await pool.connect();
    try {
      const result = await client.query(mainSelectStatement);
      return result.rows.map ( reimb => convertToReimbursementForResponse(reimb));
    } finally {
        client.release(); // release connection
    }
}

    public async getReimbursementById(id: number): Promise<Reimbursement> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
          const query = {
              text: `${mainSelectStatement} WHERE reimbursementid = $1`,
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
              text: `${mainSelectStatement} WHERE statusid = $1 ORDER BY datesubmitted;`,
              values: [id]
          };

          const result = await client.query(query);
          return result.rows.map(reimb => convertToReimbursementForResponse(reimb));

        } finally {
            client.release(); // release connection
        }
    }

    public async getReimbursementsByUserId(id: number): Promise<Reimbursement[]> {
        const pool = SessionFactory.getConnectionPool();
        const client = await pool.connect();
        try {
          const query = {
              text: `${mainSelectStatement} WHERE author = $1 ORDER BY datesubmitted;`,
              values: [id]
          };

          const result = await client.query(query);
          return result.rows.map(reimb => convertToReimbursementForResponse(reimb));

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

function convertToReimbursementForResponse(reimbursementData: any): Reimbursement {
    const amount: string = reimbursementData['amount'];
    const submitDate: Date = new Date();
    const resolveDate: Date = new Date();
    submitDate.setTime((+reimbursementData['datesubmitted']) * 1000);
    resolveDate.setTime((+reimbursementData['dateresolved']) * 1000);
    return {
        reimbursementId: reimbursementData['reimbursementid'],
        author: {
          userId: reimbursementData['authorid'],
          username: reimbursementData['author_username'],
          password: '',
          firstName: reimbursementData['author_firstname'],
          lastName: reimbursementData['author_lastname'],
          email: reimbursementData['author_email'],
          role: {
            roleId: reimbursementData['author_roleid'],
            role: reimbursementData['author_role']
          }
        },
        amount: +(+amount).toFixed(2),
        dateSubmitted: submitDate,
        dateResolved: resolveDate,
        description: reimbursementData['description'],
        resolver: {
          userId: reimbursementData['resolverid'],
          username: reimbursementData['resolver_username'],
          password: '',
          firstName: reimbursementData['resolver_firstname'],
          lastName: reimbursementData['resolver_lastname'],
          email: reimbursementData['resolver_email'],
          role: {
            roleId: reimbursementData['resolver_roleid'],
            role: reimbursementData['resolver_role']
          }
        },
        status: {
          statusId: reimbursementData['statusid'],
          status: reimbursementData['status_text']
        },
        type: {
          typeId: reimbursementData['typeid'],
          type: reimbursementData['type_text']
        }
    };
}