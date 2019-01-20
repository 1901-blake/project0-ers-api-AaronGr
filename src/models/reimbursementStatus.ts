export class ReimbursementStatus {
    statusId: number;
    status: string;

    constructor(id = 0, status = '') {
        this.statusId = id;
        this.status = status;
    }
}