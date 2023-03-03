export class UserRefresh {
	id
	email
	refreshToken
	constructor(model) {
		this.refreshToken = model.refreshToken
		this.id = model.id
		this.email = model.email
	}
}