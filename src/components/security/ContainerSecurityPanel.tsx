'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Shield,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Play,
  Download,
} from 'lucide-react';
import {
  containerSecurityScanner,
  type ContainerImage,
  type KubernetesSecurity,
} from '@/lib/security/container-security';

export function ContainerSecurityPanel() {
  const [imageName, setImageName] = useState('nginx:latest');
  const [isScanning, setIsScanning] = useState(false);
  const [imageResult, setImageResult] = useState<ContainerImage | null>(null);
  const [k8sResult, setK8sResult] = useState<KubernetesSecurity | null>(null);

  const handleScanImage = async () => {
    setIsScanning(true);
    try {
      const result = await containerSecurityScanner.scanImage(imageName);
      setImageResult(result);
    } catch (error) {
      alert(`스캔 실패: ${error}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanK8s = async () => {
    setIsScanning(true);
    try {
      const config = {}; // 실제로는 K8s 설정
      const result = await containerSecurityScanner.scanKubernetes(config);
      setK8sResult(result);
    } catch (error) {
      alert(`스캔 실패: ${error}`);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">컨테이너 보안</h2>
            <p className="text-sm text-gray-500">Docker & Kubernetes 보안 검사</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="nginx:latest"
            className="flex-1 px-4 py-3 border rounded-lg"
          />
          <button
            onClick={handleScanImage}
            disabled={isScanning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isScanning ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                스캔 중...
              </>
            ) : (
              <>
                <Play size={16} />
                이미지 스캔
              </>
            )}
          </button>
          <button
            onClick={handleScanK8s}
            disabled={isScanning}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Shield size={16} />
            K8s 스캔
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 이미지 스캔 결과 */}
        {imageResult && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">이미지 스캔 결과</h3>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{imageResult.riskScore}</div>
                  <div className="text-xs text-gray-500">보안 점수</div>
                </div>
              </div>
            </div>

            {imageResult.vulnerabilities.length > 0 ? (
              <div className="space-y-3">
                {imageResult.vulnerabilities.map((vuln) => (
                  <div
                    key={vuln.id}
                    className={`p-4 border-2 rounded-xl ${getSeverityColor(vuln.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-800">{vuln.package}</div>
                        <div className="text-sm text-gray-600">{vuln.cve}</div>
                      </div>
                      <span className="px-2 py-1 bg-white/50 rounded text-xs font-medium">
                        {vuln.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{vuln.description}</p>
                    {vuln.fixedIn && (
                      <div className="text-sm text-gray-600">
                        수정 버전: {vuln.fixedIn}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="text-green-600" size={24} />
                <span className="text-green-800">취약점이 발견되지 않았습니다</span>
              </div>
            )}

            {/* 하드닝 권장사항 */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-semibold text-blue-800 mb-2">하드닝 권장사항</div>
              <ul className="space-y-1">
                {containerSecurityScanner
                  .generateHardeningRecommendations(imageResult)
                  .map((rec, i) => (
                    <li key={i} className="text-sm text-blue-700">• {rec}</li>
                  ))}
              </ul>
            </div>
          </section>
        )}

        {/* Kubernetes 스캔 결과 */}
        {k8sResult && (
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Kubernetes 보안 이슈</h3>
            {k8sResult.issues.length > 0 ? (
              <div className="space-y-3">
                {k8sResult.issues.map((issue, i) => (
                  <div
                    key={i}
                    className={`p-4 border-2 rounded-xl ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-800">{issue.resource}</div>
                        <div className="text-sm text-gray-600">{issue.type}</div>
                      </div>
                      <span className="px-2 py-1 bg-white/50 rounded text-xs font-medium">
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                    <div className="text-sm text-gray-600">{issue.remediation}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-800">보안 이슈가 없습니다</span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

