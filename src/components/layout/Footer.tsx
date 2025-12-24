'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Shield, Mail, Github, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">Freeshell</h3>
            <p className="text-gray-400 text-sm mb-4">
              AI로 만드는 수익형 콘텐츠. 숏폼, 영상, 이미지, 전자책, 글쓰기까지 완전 자동화
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:admin@freeshell.co.kr"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="이메일"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* 법적 문서 */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield size={18} />
              법적 문서
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  <FileText size={14} />
                  개인정보 처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  <FileText size={14} />
                  이용약관
                </Link>
              </li>
            </ul>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/creator" className="text-gray-400 hover:text-white transition-colors">
                  콘텐츠 생성
                </Link>
              </li>
              <li>
                <Link href="/editor" className="text-gray-400 hover:text-white transition-colors">
                  에디터
                </Link>
              </li>
              <li>
                <Link href="/signature" className="text-gray-400 hover:text-white transition-colors">
                  전자서명
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  도움말
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              <p>© {currentYear} Freeshell. All rights reserved.</p>
              <p className="mt-1 text-xs">
                본 서비스는 OpenAI API를 사용합니다. 
                <a
                  href="https://openai.com/policies/terms-of-use"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 ml-1 inline-flex items-center gap-1"
                >
                  OpenAI 약관 <ExternalLink size={12} />
                </a>
              </p>
            </div>
            <div className="text-xs text-gray-500">
              <p>문의: admin@freeshell.co.kr</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

