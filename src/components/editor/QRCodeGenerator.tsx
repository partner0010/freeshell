'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Link,
  Phone,
  Mail,
  Wifi,
  Download,
  Copy,
  Check,
  Palette,
  Image,
} from 'lucide-react';

type QRType = 'url' | 'phone' | 'email' | 'wifi' | 'text';

const qrTypes = [
  { type: 'url' as const, icon: Link, label: 'URL' },
  { type: 'phone' as const, icon: Phone, label: '전화번호' },
  { type: 'email' as const, icon: Mail, label: '이메일' },
  { type: 'wifi' as const, icon: Wifi, label: 'WiFi' },
  { type: 'text' as const, icon: QrCode, label: '텍스트' },
];

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState<QRType>('url');
  const [content, setContent] = useState('https://grip.app');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [size, setSize] = useState(200);
  const [copied, setCopied] = useState(false);

  const generateQRData = () => {
    switch (qrType) {
      case 'url':
        return content;
      case 'phone':
        return `tel:${content}`;
      case 'email':
        return `mailto:${content}`;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`;
      case 'text':
      default:
        return content;
    }
  };

  // QR 코드 URL 생성 (Google Charts API 사용)
  const getQRCodeUrl = () => {
    const data = encodeURIComponent(generateQRData());
    const fg = foregroundColor.replace('#', '');
    const bg = backgroundColor.replace('#', '');
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}&color=${fg}&bgcolor=${bg}`;
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = getQRCodeUrl();
    link.download = 'qrcode.png';
    link.click();
  };

  const copyQRUrl = () => {
    navigator.clipboard.writeText(getQRCodeUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <QrCode size={18} />
          QR 코드 생성기
        </h3>
        <p className="text-sm text-gray-500 mt-1">다양한 QR 코드를 생성하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 미리보기 */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-xl shadow-lg">
            <img
              src={getQRCodeUrl()}
              alt="QR Code"
              className="w-48 h-48"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>

        {/* 다운로드/복사 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={downloadQR}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
          >
            <Download size={16} />
            다운로드
          </button>
          <button
            onClick={copyQRUrl}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? '복사됨!' : 'URL 복사'}
          </button>
        </div>

        {/* QR 타입 선택 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">QR 타입</p>
          <div className="grid grid-cols-5 gap-2">
            {qrTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => setQrType(type.type)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  qrType === type.type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <type.icon size={20} className="mx-auto mb-1 text-gray-600" />
                <span className="text-xs text-gray-700">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 입력 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">내용</p>
          
          {qrType === 'wifi' ? (
            <div className="space-y-3">
              <input
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder="WiFi 이름 (SSID)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <select
                value={wifiEncryption}
                onChange={(e) => setWifiEncryption(e.target.value as typeof wifiEncryption)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">암호 없음</option>
              </select>
            </div>
          ) : (
            <input
              type={qrType === 'email' ? 'email' : qrType === 'phone' ? 'tel' : 'text'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                qrType === 'url' ? 'https://example.com' :
                qrType === 'phone' ? '010-1234-5678' :
                qrType === 'email' ? 'email@example.com' :
                '텍스트 입력'
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          )}
        </div>

        {/* 색상 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700 mb-2 block">전경 색상</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border"
              />
              <input
                type="text"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-2 block">배경 색상</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* 크기 */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-700">크기</label>
            <span className="text-sm font-medium text-gray-800">{size}px</span>
          </div>
          <input
            type="range"
            min={100}
            max={500}
            step={50}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full accent-primary-500"
          />
        </div>
      </div>

      {/* 적용 버튼 */}
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
          <Check size={18} />
          QR 코드 삽입
        </button>
      </div>
    </div>
  );
}

