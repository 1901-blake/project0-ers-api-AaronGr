export class ReimbursementType {
    typeId: number; // primary key
    type: string; // not null, unique

    constructor(id = 0, type = '') {
        this.typeId = id;
        this.type = type;
    }
}