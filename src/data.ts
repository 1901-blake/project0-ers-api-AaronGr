/*
* To be used instead of DB for now
*/

import { Role } from './models/role';
import { User } from './models/user';
import { ReimbursementType } from './models/reimbursementType';
import { Reimbursement } from './models/reimbursement';
import { ReimbursementStatus } from './models/reimbursementStatus';

const employee = new Role(1, 'employee');
const admin = new Role(2, 'admin');
const financeManager = new Role(3, 'finance-manager');
export let roles: Role[] = [employee, admin, financeManager];

const aaron: User = new User(1, 'aaron', 'password', 'aaron', 'gravelle', 'aaron@gmail.com', employee);
const blake: User = new User(2, 'blake', 'blake', 'blake', 'kruppa', 'blake@gmail.com', admin);
const ben: User = new User(3, 'ben', 'benjamin', 'ben', 'codebeast', 'ben@hotmail.com', financeManager);
export let users: User[] = [aaron, blake, ben];

const pending: ReimbursementStatus = new ReimbursementStatus(1, 'Pending');
const approved: ReimbursementStatus = new ReimbursementStatus(2, 'Approved');
const denied: ReimbursementStatus = new ReimbursementStatus(3, 'Denied');
export let reimburseStatuses: ReimbursementStatus[] = [pending, approved, denied];

const lodging: ReimbursementType = new ReimbursementType(1, 'Lodging');
const travel: ReimbursementType = new ReimbursementType(2, 'Travel');
const food: ReimbursementType = new ReimbursementType(3, 'Food');
const other: ReimbursementType = new ReimbursementType(4, 'Other');
export let reimburseTypes: ReimbursementType[] = [lodging, travel, food, other];

const reimburse1: Reimbursement = new Reimbursement(1, 1, 20, 100619, 101019,
                                                    'Travel to Puerto Rico', 2, 1, 1);
const reimburse2: Reimbursement = new Reimbursement(2, 2, 50, 100619, 101019,
                                                    'Had Pizza', 3, 1, 2);
export let reimbursements: Reimbursement[] = [reimburse1, reimburse2];