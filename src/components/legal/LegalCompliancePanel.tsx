'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  ExternalLink,
  Lock,
  Scale,
  ArrowRight,
} from 'lucide-react';
import {
  generateLegalAuditReport,
  type LicenseInfo,
  type PatentCheck,
} from '@/lib/legal/license-checker';

export function LegalCompliancePanel() {
  const [report, setReport] = useState<ReturnType<typeof generateLegalAuditReport> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setIsLoading(true);
    // 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));
    const auditReport = generateLegalAuditReport();
    setReport(auditReport);
    setIsLoading(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'none':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const exportReport = () => {
    if (!report) return;

    const content = `
법적 준수 검토 리포트
생성일: ${new Date().toLocaleString('ko-KR')}

=== 라이선스 정보 ===
${report.licenses.map((l) => `- ${l.name} (${l.version}): ${l.license}`).join('\n')}

=== 특허 검토 ===
${report.patentChecks.map((p) => `- ${p.feature}: ${p.riskLevel} 위험`).join('\n')}

=== 호환성 ===
${report.compatibility.compatible ? '✅ 호환' : '❌ 호환되지 않음'}
${report.compatibility.issues.length > 0 ? '\n이슈:\n' + report.compatibility.issues.map((i) => `- ${i}`).join('\n') : ''}

=== 권장사항 ===
${report.recommendations.map((r) => `- ${r}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `legal-audit-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  if (isLoading || !report) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">법적 검토 진행 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <Scale className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">법적 준수 검토</h2>
              <p className="text-sm text-gray-500">라이선스 및 특허 이슈 검토</p>
            </div>
          </div>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Download size={16} />
            리포트 내보내기
          </button>
        </div>

        {/* 전체 상태 */}
        <div
          className={`p-4 rounded-xl border-2 ${
            report.compatibility.compatible
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {report.compatibility.compatible ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <AlertTriangle className="text-yellow-600" size={24} />
            )}
            <div>
              <div className="font-semibold text-gray-800">
                {report.compatibility.compatible ? '호환 가능' : '주의 필요'}
              </div>
              <div className="text-sm text-gray-600">
                {report.compatibility.compatible
                  ? '모든 라이선스가 호환됩니다'
                  : `${report.compatibility.issues.length}개의 이슈가 발견되었습니다`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 라이선스 정보 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={20} />
            사용 중인 라이선스
          </h3>
          <div className="space-y-3">
            {report.licenses.map((license, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white border rounded-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{license.name}</div>
                    <div className="text-sm text-gray-500">{license.version}</div>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                    {license.license}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded ${license.commercialUse ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    상업적 사용: {license.commercialUse ? '허용' : '금지'}
                  </div>
                  <div className={`p-2 rounded ${license.modification ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    수정: {license.modification ? '허용' : '금지'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 특허 검토 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lock size={20} />
            특허 위험 검토
          </h3>
          <div className="space-y-3">
            {report.patentChecks.map((check, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border-2 rounded-xl ${getRiskColor(check.riskLevel)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-gray-800">{check.feature}</div>
                  <span className="px-2 py-1 bg-white/50 rounded text-xs font-medium">
                    {check.riskLevel === 'none'
                      ? '위험 없음'
                      : check.riskLevel === 'low'
                      ? '낮은 위험'
                      : check.riskLevel === 'medium'
                      ? '중간 위험'
                      : '높은 위험'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{check.description}</p>
                <div className="mt-3">
                  <div className="text-xs font-semibold text-gray-700 mb-1">권장사항:</div>
                  <ul className="space-y-1">
                    {check.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                        <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 호환성 이슈 */}
        {report.compatibility.issues.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              호환성 이슈
            </h3>
            <div className="space-y-2">
              {report.compatibility.issues.map((issue, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{issue}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">해결 방법:</div>
              <ul className="space-y-1">
                {report.compatibility.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <ArrowRight size={14} className="mt-0.5 shrink-0 text-primary-600" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 전체 권장사항 */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield size={20} />
            전체 권장사항
          </h3>
          <div className="space-y-2">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{rec}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

