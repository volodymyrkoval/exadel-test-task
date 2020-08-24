/* eslint-disable max-classes-per-file */

export class CustomError extends Error {}

export class TMDBError extends CustomError {}

export class AnalyticsError extends CustomError {}

export class NotFoundError extends CustomError {}
