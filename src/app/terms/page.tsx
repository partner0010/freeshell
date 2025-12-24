'use client';

import React from 'react';
import { FileText, AlertTriangle, Shield, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Scale className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">이용약관</h1>
              <p className="text-gray-600 mt-2">최종 수정일: 2025년 12월 24일</p>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* 1. 총칙 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={24} />
              1. 총칙
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                본 약관은 Freeshell('https://freeshell.co.kr' 이하 '서비스')이 제공하는 모든 서비스의 이용과 관련하여 
                서비스와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                본 약관에 동의하시면 본 약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
              </p>
            </div>
          </section>

          {/* 2. 용어의 정의 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 용어의 정의</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div>
                <p className="font-semibold text-gray-900">2.1 "서비스"</p>
                <p className="text-gray-700 text-sm">Freeshell이 제공하는 AI 기반 콘텐츠 생성 및 관련 서비스를 의미합니다.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">2.2 "이용자"</p>
                <p className="text-gray-700 text-sm">본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 의미합니다.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">2.3 "콘텐츠"</p>
                <p className="text-gray-700 text-sm">서비스를 통해 생성된 텍스트, 이미지, 코드, 영상 등 모든 결과물을 의미합니다.</p>
              </div>
            </div>
          </section>

          {/* 3. 서비스의 제공 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 서비스의 제공</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">3.1 제공 서비스</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>AI 기반 콘텐츠 생성 (텍스트, 이미지, 코드 등)</li>
                  <li>AI 채팅 및 코드 생성</li>
                  <li>전자서명 서비스</li>
                  <li>기타 서비스에서 제공하는 모든 기능</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">3.2 서비스 변경</h3>
                <p className="text-gray-700">
                  서비스는 운영상, 기술상의 필요에 따라 제공하는 서비스의 내용을 변경할 수 있으며, 
                  변경 시 사전에 공지합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 4. 이용자의 의무 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={24} />
              4. 이용자의 의무
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h3 className="font-semibold text-gray-900 mb-3">4.1 금지 행위</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>법령 또는 본 약관을 위반하는 행위</li>
                <li>서비스의 안정적 운영을 방해하는 행위</li>
                <li>다른 이용자의 서비스 이용을 방해하는 행위</li>
                <li>저작권, 상표권 등 타인의 지적재산권을 침해하는 행위</li>
                <li>불법적이거나 부적절한 콘텐츠 생성 요청</li>
                <li>서비스를 영리 목적으로 무단 사용하는 행위</li>
                <li>계정 정보를 타인에게 양도하거나 대여하는 행위</li>
                <li>기타 서비스 제공자의 정당한 운영을 방해하는 행위</li>
              </ul>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">4.2 위반 시 조치</h3>
              <p className="text-gray-700">
                이용자가 본 약관을 위반한 경우, 서비스 제공자는 경고, 일시정지, 영구이용정지 등의 조치를 취할 수 있으며, 
                이로 인한 손해에 대하여는 서비스 제공자가 책임을 지지 않습니다.
              </p>
            </div>
          </section>

          {/* 5. 지적재산권 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 지적재산권</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">5.1 서비스의 지적재산권</h3>
                <p className="text-gray-700">
                  서비스에 포함된 모든 콘텐츠, 디자인, 로고, 소프트웨어 등은 서비스 제공자의 지적재산권에 속하며, 
                  이용자는 서비스 제공자의 사전 동의 없이 이를 복제, 배포, 수정할 수 없습니다.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">5.2 AI 생성 콘텐츠의 저작권</h3>
                <p className="text-gray-700 mb-2">
                  AI를 통해 생성된 콘텐츠의 저작권은 법적으로 불명확합니다. 이용자는 다음을 이해하고 동의합니다:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>AI 생성 콘텐츠의 저작권은 이용자에게 귀속될 수 있으나, 법적 보호 범위는 제한적일 수 있습니다.</li>
                  <li>이용자는 생성된 콘텐츠를 자유롭게 사용할 수 있으나, 저작권 침해에 대한 책임은 이용자에게 있습니다.</li>
                  <li>서비스 제공자는 AI 생성 콘텐츠의 저작권 침해에 대해 책임을 지지 않습니다.</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">5.3 이용자 생성 콘텐츠</h3>
                <p className="text-gray-700">
                  이용자가 직접 생성한 콘텐츠의 저작권은 이용자에게 있으며, 이용자는 서비스 제공자에게 
                  서비스 제공에 필요한 범위 내에서 사용할 수 있는 권한을 부여합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 6. 면책 조항 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={24} />
              6. 면책 조항
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">6.1 서비스 제공의 중단</h3>
                <p className="text-gray-700 text-sm">
                  서비스 제공자는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인하여 
                  서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임을 지지 않습니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">6.2 콘텐츠의 정확성</h3>
                <p className="text-gray-700 text-sm">
                  AI가 생성한 콘텐츠의 정확성, 완전성, 신뢰성에 대하여 서비스 제공자는 보장하지 않으며, 
                  이용자는 생성된 콘텐츠를 사용하기 전에 반드시 검토해야 합니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">6.3 제3자 서비스</h3>
                <p className="text-gray-700 text-sm">
                  서비스는 OpenAI API 등 제3자 서비스를 사용하며, 제3자 서비스의 중단, 오류 등으로 인한 
                  손해에 대하여 서비스 제공자는 책임을 지지 않습니다.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">6.4 저작권 침해</h3>
                <p className="text-gray-700 text-sm">
                  이용자가 생성한 콘텐츠가 타인의 저작권을 침해하는 경우, 그에 대한 책임은 이용자에게 있으며, 
                  서비스 제공자는 책임을 지지 않습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 7. 개인정보 보호 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 개인정보 보호</h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-gray-700 mb-2">
                서비스 제공자는 이용자의 개인정보를 보호하기 위하여 노력하며, 개인정보의 보호 및 사용에 대해서는 
                관련법령 및 서비스의 개인정보 처리방침이 적용됩니다.
              </p>
              <Link 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                개인정보 처리방침 보기 →
              </Link>
            </div>
          </section>

          {/* 8. 서비스 이용료 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 서비스 이용료</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                서비스의 기본 기능은 무료로 제공되며, 일부 고급 기능은 유료로 제공될 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li>유료 서비스 이용 시 결제한 금액은 환불되지 않습니다.</li>
                <li>서비스 제공자는 사전 고지 없이 요금을 변경할 수 있습니다.</li>
                <li>요금 변경 시 기존 이용자에게는 변경 전 요금이 적용됩니다.</li>
              </ul>
            </div>
          </section>

          {/* 9. 약관의 변경 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 약관의 변경</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                본 약관은 법령·정책 또는 서비스의 변경에 따라 수정될 수 있으며, 변경 시 사전에 공지합니다. 
                변경된 약관은 공지한 날로부터 7일 후부터 효력이 발생합니다.
              </p>
            </div>
          </section>

          {/* 10. 분쟁 해결 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. 분쟁 해결</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                서비스와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법을 적용하며, 
                서비스 제공자의 본사 소재지를 관할하는 법원의 전속 관할로 합니다.
              </p>
              <p className="text-gray-700 text-sm">
                분쟁 발생 시 먼저 서비스 제공자와 이용자 간의 협의를 통해 해결하도록 노력합니다.
              </p>
            </div>
          </section>
        </div>

        {/* 하단 링크 */}
        <div className="mt-8 text-center">
          <Link 
            href="/privacy" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            개인정보 처리방침 보기
          </Link>
          <span className="mx-4 text-gray-400">|</span>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

