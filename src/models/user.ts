import { Role } from './role';

export class User {
	userId: number; // primary key
	username: string; // not null, unique
	password: string; // not null
	firstName: string; // not null
	lastName: string; // not nul
	email: string; // not null
	role: Role; // not null

	constructor(id = 0, username = '', pass = '', firstName = '',
				lastName = ' ', email = '', role = undefined) {
					this.userId = id;
					this.username = username;
					this.password = pass;
					this.firstName = firstName;
					this.lastName = lastName;
					this.email = email;
					this.role = role;
				}
}