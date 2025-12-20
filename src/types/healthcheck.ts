export interface DnsSnapshot {
  aRecords: string[];
  cnameRecords: string[];
  mxRecords: string[];
  txtRecords: string[];
  hasCaa: boolean;
  hasDnssec: boolean;
}

export interface SecuritySnapshot {
  httpsReachable: boolean;
  statusCode?: number;
  responseTimeMs?: number;
  headers: Record<string, string>;
  missingHeaders: string[];
}

export interface MailSecuritySnapshot {
  hasSpf: boolean;
  hasDkim: boolean | null;
  hasDmarc: boolean;
}

export interface HealthcheckResult {
  domain: string;
  checkedAt: string;
  warnings: string[];
  dns: DnsSnapshot;
  security: SecuritySnapshot;
  mailSecurity: MailSecuritySnapshot;
  certificate: {
    expiresAt: string | null;
    daysRemaining: number | null;
  };
}

