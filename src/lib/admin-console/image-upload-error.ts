import { randomUUID } from 'node:crypto';

export type AdminImageCloudErrorCode =
  | 'cloud_invalid_request'
  | 'cloud_config_invalid'
  | 'cloud_provider_unavailable'
  | 'cloud_rate_limited'
  | 'cloud_timeout'
  | 'cloud_unknown';

export type AdminImageCloudErrorOutcome = 'failed_known' | 'unknown_may_have_succeeded';

export type AdminImageCloudErrorPayload = {
  code: AdminImageCloudErrorCode;
  traceId: string;
  outcome: AdminImageCloudErrorOutcome;
};

export type AdminImageCloudErrorOptions = {
  code: AdminImageCloudErrorCode;
  outcome: AdminImageCloudErrorOutcome;
  cause?: unknown;
};

const CLOUD_ERROR_HTTP_STATUS: Record<AdminImageCloudErrorCode, number> = {
  cloud_invalid_request: 400,
  cloud_config_invalid: 500,
  cloud_provider_unavailable: 502,
  cloud_rate_limited: 429,
  cloud_timeout: 504,
  cloud_unknown: 502
};

const CLOUD_ERROR_MESSAGE: Record<AdminImageCloudErrorCode, string> = {
  cloud_invalid_request: 'Invalid cloud image request — check the parameters and try again',
  cloud_config_invalid: 'Invalid cloud image storage configuration — check the server-side config',
  cloud_provider_unavailable: 'Cloud image storage is temporarily unavailable — please try again later',
  cloud_rate_limited: 'Too many cloud image storage requests — please try again later',
  cloud_timeout: 'Cloud image storage request timed out — please try again later',
  cloud_unknown: 'Cloud image operation failed — check the server-side logs'
};

export class AdminImageUploadError extends Error {
  status: number;
  cloudError: AdminImageCloudErrorPayload | null;

  constructor(message: string, status = 400, cloudOptions?: AdminImageCloudErrorOptions) {
    super(message);
    this.name = 'AdminImageUploadError';
    this.status = status;
    this.cloudError = cloudOptions
      ? {
          code: cloudOptions.code,
          traceId: randomUUID(),
          outcome: cloudOptions.outcome
        }
      : null;
    if (cloudOptions && cloudOptions.cause !== undefined) {
      this.cause = cloudOptions.cause;
    }
  }
}

export const createAdminImageCloudError = (
  code: AdminImageCloudErrorCode,
  outcome: AdminImageCloudErrorOutcome,
  cause?: unknown
): AdminImageUploadError => new AdminImageUploadError(
  CLOUD_ERROR_MESSAGE[code],
  CLOUD_ERROR_HTTP_STATUS[code],
  { code, outcome, cause }
);

export const toAdminImageErrorPayload = (error: AdminImageUploadError) => ({
  ok: false as const,
  errors: [error.message],
  ...(error.cloudError ? { error: error.cloudError } : {})
});

const readErrorRecord = (error: unknown): Record<string, unknown> | null =>
  typeof error === 'object' && error !== null ? error as Record<string, unknown> : null;

const readProviderMetadata = (error: unknown): Record<string, unknown> | null => {
  const metadata = readErrorRecord(error)?.$metadata;
  return readErrorRecord(metadata);
};

export const logAdminImageCloudError = (
  operation: 'upload' | 'list',
  error: AdminImageUploadError
): void => {
  if (!error.cloudError) return;

  const cause = readErrorRecord(error.cause);
  const metadata = readProviderMetadata(error.cause);
  console.error('[astro-whono] Cloud image operation failed:', {
    operation,
    code: error.cloudError.code,
    traceId: error.cloudError.traceId,
    outcome: error.cloudError.outcome,
    providerCode: typeof cause?.code === 'string'
      ? cause.code
      : typeof cause?.name === 'string' ? cause.name : null,
    httpStatus: typeof metadata?.httpStatusCode === 'number' ? metadata.httpStatusCode : null,
    providerRequestId: typeof metadata?.requestId === 'string' ? metadata.requestId : null,
    providerExtendedRequestId: typeof metadata?.extendedRequestId === 'string'
      ? metadata.extendedRequestId
      : null,
    sdkAttempts: typeof metadata?.attempts === 'number' ? metadata.attempts : null,
    totalRetryDelayMs: typeof metadata?.totalRetryDelay === 'number'
      ? metadata.totalRetryDelay
      : null
  });
};
