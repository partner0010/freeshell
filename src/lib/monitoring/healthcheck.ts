import type { HealthcheckResult, DnsSnapshot, SecuritySnapshot, MailSecuritySnapshot } from '@/types/healthcheck';

const DOH_ENDPOINT = 'https://dns.google/resolve';

const REQUIRED_SECURITY_HEADERS = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
];

const DEFAULT_TIMEOUT = 8_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    promise
      .then((value) => {
        clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

export function validateDomain(domain: string): boolean {
  const re = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))+$/;
  return re.test(domain);
}

async function fetchDns(name: string, type: string): Promise<string[]> {
  const url = `${DOH_ENDPOINT}?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
  const res = await withTimeout(fetch(url), DEFAULT_TIMEOUT);
  if (!res.ok) return [];
  const data = await res.json();
  const answers = data.Answer as Array<{ data: string }> | undefined;
  if (!answers) return [];
  return answers.map((a) => a.data).filter(Boolean);
}

async function collectDns(domain: string): Promise<DnsSnapshot> {
  const [aRecords, cnameRecords, mxRecords, txtRecords, caaRecords] = await Promise.all([
    fetchDns(domain, 'A'),
    fetchDns(domain, 'CNAME'),
    fetchDns(domain, 'MX'),
    fetchDns(domain, 'TXT'),
    fetchDns(domain, 'CAA'),
  ]);

  return {
    aRecords,
    cnameRecords,
    mxRecords,
    txtRecords,
    hasCaa: caaRecords.length > 0,
    hasDnssec: false, // DoH 기본 응답에는 DNSSEC 여부가 제한적이므로 추후 확장
  };
}

async function collectSecurity(domain: string): Promise<SecuritySnapshot> {
  const targetUrl = `https://${domain}`;
  const started = Date.now();
  let statusCode: number | undefined;
  let headers: Record<string, string> = {};
  let httpsReachable = false;
  try {
    const res = await withTimeout(
      fetch(targetUrl, { method: 'GET', redirect: 'manual' }),
      DEFAULT_TIMEOUT
    );
    statusCode = res.status;
    httpsReachable = true;
    res.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
  } catch {
    httpsReachable = false;
  }

  const missingHeaders = REQUIRED_SECURITY_HEADERS.filter((h) => !headers[h]);

  return {
    httpsReachable,
    statusCode,
    responseTimeMs: httpsReachable ? Date.now() - started : undefined,
    headers,
    missingHeaders,
  };
}

async function collectMailSecurity(domain: string): Promise<MailSecuritySnapshot> {
  const [txtRecords, dmarcRecords] = await Promise.all([
    fetchDns(domain, 'TXT'),
    fetchDns(`_dmarc.${domain}`, 'TXT'),
  ]);

  const hasSpf = txtRecords.some((r) => r.toLowerCase().includes('v=spf1'));
  const hasDmarc = dmarcRecords.some((r) => r.toLowerCase().includes('v=dmarc1'));

  // DKIM은 셀렉터를 알아야 정확히 확인할 수 있어 기본적으로 unknown 처리
  return {
    hasSpf,
    hasDkim: null,
    hasDmarc,
  };
}

export async function runPassiveHealthcheck(domain: string): Promise<HealthcheckResult> {
  if (!validateDomain(domain)) {
    throw new Error('Invalid domain');
  }

  const [dns, security, mailSecurity] = await Promise.all([
    collectDns(domain),
    collectSecurity(domain),
    collectMailSecurity(domain),
  ]);

  const warnings: string[] = [];
  if (security.missingHeaders.length > 0) {
    warnings.push(`보안 헤더 누락: ${security.missingHeaders.join(', ')}`);
  }
  if (!mailSecurity.hasSpf) warnings.push('SPF 레코드가 없습니다.');
  if (!mailSecurity.hasDmarc) warnings.push('DMARC 레코드가 없습니다.');
  if (!security.httpsReachable) warnings.push('HTTPS로 접속할 수 없습니다.');

  return {
    domain,
    checkedAt: new Date().toISOString(),
    warnings,
    dns,
    security,
    mailSecurity,
    certificate: {
      expiresAt: null, // 추후 TLS 세부 조회로 확장
      daysRemaining: null,
    },
  };
}

