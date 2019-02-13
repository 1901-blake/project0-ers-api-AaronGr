import { ReimbursementStatus } from './reimbursementStatus';
import { ReimbursementType } from './reimbursementType';
import { User } from './user';

export class Reimbursement {
    reimbursementId: number; // primary key
	author: User;  // foreign key -> User, not null
	amount: number; // not null
    dateSubmitted: Date; // not null
    dateResolved: Date; // not null
    description: string; // not null
    resolver: User; // foreign key -> User
    status: ReimbursementStatus; // foreign ey -> ReimbursementStatus, not null
    type: ReimbursementType; // foreign key -> ReimbursementType

    constructor(id = 0, author = undefined, amount = 0, dateSubmit = undefined,
                dateResolve = undefined, description = '', resolver = undefined,
                status = undefined, type = undefined) {
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