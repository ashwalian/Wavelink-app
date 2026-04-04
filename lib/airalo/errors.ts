export class AiraloPartnersApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly bodyText: string,
  ) {
    super(message)
    this.name = 'AiraloPartnersApiError'
  }
}
