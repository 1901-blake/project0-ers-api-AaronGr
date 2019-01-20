export class Reimbursement {
    reimbursementId: number; // primary key
	author: number;  // foreign key -> User, not null
	amount: number; // not null
    dateSubmitted: number; // not null
    dateResolved: number; // not null
    description: string; // not null
    resolver: number; // foreign key -> User
    status: number; // foreign ey -> ReimbursementStatus, not null
    type: number; // foreign key -> ReimbursementType

    constructor(id = 0, author = 0, amount = 0, dateSubmit = 0,
                dateResolve = 0, description = '', resolver = 0,
                status = 0, type = 0) {
                    this.reimbursementId = id;
                    this.author = author;
                    this.amount = amount;
                    this.dateSubmitted = dateSubmit;
                    this.dateResolved = dateResolve;
                    this.description = description;
                    this.resolver = resolver;
                    this.status = status;
                    this.type = type;
                }
}