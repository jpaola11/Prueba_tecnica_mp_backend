export class DomainError extends Error {
  readonly userMessage: string;
  readonly internalMessage: string;
  readonly statusCode: number;

  constructor(
    userMessage: string,
    internalMessage: string,
    statusCode = 400,
  ) {
    super(internalMessage);
    this.name = 'DomainError';
    this.userMessage = userMessage;
    this.internalMessage = internalMessage;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
