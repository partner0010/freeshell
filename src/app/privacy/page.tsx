'use client';

import React from 'react';
import { Shield, Lock, Eye, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">개인정보 처리방침</h1>
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
              <p className="text-gray-700 leading-relaxed">
                Freeshell('https://freeshell.co.kr' 이하 'Freeshell')은(는) 개인정보보호법 제30조에 따라 정보주체의 개인정보를 보호하고 
                이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>
            </div>
          </section>

          {/* 2. 수집하는 개인정보 항목 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye size={24} />
              2. 수집하는 개인정보 항목
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">2.1 회원가입 시</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>필수항목: 이메일 주소, 비밀번호, 닉네임</li>
                <li>선택항목: 프로필 사진, 전화번호</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mb-3 mt-6">2.2 서비스 이용 시</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>AI 대화 기록 및 생성된 콘텐츠</li>
                <li>서비스 이용 로그 (접속 IP, 접속 시간, 이용한 기능)</li>
                <li>결제 정보 (유료 서비스 이용 시)</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mb-3 mt-6">2.3 자동 수집 정보</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>쿠키, 세션 정보</li>
                <li>기기 정보 (OS, 브라우저 종류)</li>
                <li>접속 로그</li>
              </ul>
            </div>
          </section>

          {/* 3. 개인정보 수집 목적 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 개인정보 수집 목적</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">3.1 서비스 제공</h3>
                <p className="text-gray-700">AI 콘텐츠 생성, 사용자 맞춤 서비스 제공, 회원 관리</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">3.2 서비스 개선</h3>
                <p className="text-gray-700">서비스 품질 향상, 신규 기능 개발, 통계 분석</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">3.3 고객 지원</h3>
                <p className="text-gray-700">문의사항 처리, 불만 처리, 공지사항 전달</p>
              </div>
            </div>
          </section>

          {/* 4. 개인정보 보관 기간 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 개인정보 보관 기간</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <ul className="space-y-2 text-gray-700">
                <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관)</li>
                <li><strong>AI 대화 기록:</strong> 회원 탈퇴 시 또는 사용자가 삭제 요청 시까지</li>
                <li><strong>결제 정보:</strong> 전자상거래법에 따라 5년간 보관</li>
                <li><strong>접속 로그:</strong> 3개월간 보관</li>
              </ul>
            </div>
          </section>

          {/* 5. 제3자 제공 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 개인정보의 제3자 제공</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-gray-700 mb-4">
                Freeshell은 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 
                다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                <li>서비스 제공을 위해 필요한 경우 (예: OpenAI API 사용 - 아래 참조)</li>
              </ul>
            </div>
          </section>

          {/* 6. OpenAI API 사용 고지 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. OpenAI API 사용 및 데이터 처리</h2>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <p className="text-gray-700 mb-4">
                본 서비스는 AI 기능 제공을 위해 OpenAI API를 사용합니다.
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">6.1 전송되는 데이터</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>사용자가 입력한 메시지 및 프롬프트</li>
                    <li>AI 대화 맥락 정보</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">6.2 OpenAI의 데이터 사용</h3>
                  <p className="text-gray-700 text-sm">
                    OpenAI는 API를 통한 대화 데이터를 서비스 개선 및 모델 학습에 사용할 수 있습니다. 
                    자세한 내용은 <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI 개인정보 처리방침</a>을 참조하세요.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">6.3 데이터 보안</h3>
                  <p className="text-gray-700 text-sm">
                    모든 데이터는 암호화되어 전송되며, OpenAI의 보안 정책에 따라 처리됩니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. 개인정보 보호책임자 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 개인정보 보호책임자</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-3 text-gray-700">
                <p><strong>이름:</strong> Freeshell 운영팀</p>
                <p><strong>이메일:</strong> admin@freeshell.co.kr</p>
                <p><strong>연락처:</strong> 서비스 내 1:1 문의를 통해 연락 가능</p>
              </div>
            </div>
          </section>

          {/* 8. 이용자 권리 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={24} />
              8. 이용자의 권리 및 행사 방법
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">8.1 이용자 권리</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>개인정보 열람 요구</li>
                  <li>개인정보 정정·삭제 요구</li>
                  <li>개인정보 처리정지 요구</li>
                  <li>개인정보 삭제 요구 (회원 탈퇴 포함)</li>
                </ul>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">8.2 권리 행사 방법</h3>
                <p className="text-gray-700 mb-2">
                  이용자는 언제든지 마이페이지에서 개인정보를 조회, 수정, 삭제할 수 있습니다.
                </p>
                <p className="text-gray-700">
                  또는 이메일(admin@freeshell.co.kr)로 요청하시면 지체 없이 조치하겠습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 9. 개인정보 삭제 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trash2 size={24} />
              9. 개인정보 삭제
            </h2>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <p className="text-gray-700 mb-4">
                이용자는 언제든지 다음 방법으로 개인정보 삭제를 요청할 수 있습니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>마이페이지:</strong> 개인정보 관리 메뉴에서 삭제 요청</li>
                <li><strong>이메일:</strong> admin@freeshell.co.kr로 삭제 요청</li>
                <li><strong>회원 탈퇴:</strong> 회원 탈퇴 시 모든 개인정보 자동 삭제</li>
              </ul>
              <p className="text-gray-700 mt-4 text-sm">
                단, 법령에 따라 보관이 필요한 정보는 해당 기간 동안 보관 후 삭제됩니다.
              </p>
            </div>
          </section>

          {/* 10. 쿠키 사용 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. 쿠키의 운영 및 거부</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                본 서비스는 이용자에게 개인화된 서비스를 제공하기 위해 쿠키를 사용합니다.
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>쿠키 사용 목적:</strong> 로그인 상태 유지, 사용자 설정 저장, 서비스 이용 통계</p>
                <p><strong>쿠키 거부:</strong> 브라우저 설정에서 쿠키 사용을 거부할 수 있으나, 일부 서비스 이용에 제한이 있을 수 있습니다.</p>
              </div>
            </div>
          </section>

          {/* 11. 개인정보 보호 조치 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. 개인정보의 안전성 확보 조치</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">기술적 조치</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>비밀번호 암호화</li>
                  <li>HTTPS 통신</li>
                  <li>접근 권한 관리</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">관리적 조치</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>개인정보 처리 담당자 최소화</li>
                  <li>정기적인 보안 점검</li>
                  <li>보안 교육 실시</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 12. 개인정보 처리방침 변경 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. 개인정보 처리방침 변경</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                본 개인정보 처리방침은 법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 시에는 
                변경사항의 시행 7일 전부터 홈페이지의 공지사항을 통하여 고지할 것입니다.
              </p>
            </div>
          </section>
        </div>

        {/* 하단 링크 */}
        <div className="mt-8 text-center">
          <Link 
            href="/terms" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            이용약관 보기
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

