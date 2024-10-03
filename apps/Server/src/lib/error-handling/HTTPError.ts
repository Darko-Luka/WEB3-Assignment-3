// Extends the Error class to add a extra variable for handling HTTP status codes.
export default class HTTPError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
	// Converts the class to JSON
	serializeError() {
		return {
			error: {
				statusCode: this.status,
				message: this.message,
			},
		};
	}
}
