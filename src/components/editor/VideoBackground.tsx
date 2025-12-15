'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  Link,
  Settings,
  Maximize2,
  RotateCcw,
  Layers,
  Sliders,
  Eye,
  EyeOff,
} from 'lucide-react';

interface VideoSettings {
  source: 'url' | 'upload' | 'youtube' | 'vimeo';
  url: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
  overlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
  objectFit: 'cover' | 'contain' | 'fill';
  playbackRate: number;
  startTime: number;
  endTime: number;
  poster: string;
}

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<'source' | 'playback' | 'overlay'>('source');
  
  const [settings, setSettings] = useState<VideoSettings>({
    source: 'url',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    autoplay: true,
    loop: true,
    muted: true,
    controls: false,
    overlay: true,
    overlayColor: '#000000',
    overlayOpacity: 40,
    objectFit: 'cover',
    playbackRate: 1,
    startTime: 0,
    endTime: 0,
    poster: '',
  });

  const presetVideos = [
    { name: '추상 웨이브', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: '🌊' },
    { name: '입자 효과', url: 'https://www.w3schools.com/html/movie.mp4', thumbnail: '✨' },
    { name: '그라디언트', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: '🎨' },
    { name: '네온 라인', url: 'https://www.w3schools.com/html/movie.mp4', thumbnail: '💫' },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Video className="w-5 h-5 text-primary-500" />
          비디오 배경
        </h3>
      </div>
      
      {/* 비디오 미리보기 */}
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          src={settings.url}
          className={`w-full h-full ${
            settings.objectFit === 'cover' ? 'object-cover' :
            settings.objectFit === 'contain' ? 'object-contain' : 'object-fill'
          }`}
          autoPlay={settings.autoplay}
          loop={settings.loop}
          muted={settings.muted}
          playsInline
        />
        
        {/* 오버레이 */}
        {settings.overlay && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: settings.overlayColor,
              opacity: settings.overlayOpacity / 100,
            }}
          />
        )}
        
        {/* 컨트롤 */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex gap-1">
            <button
              onClick={togglePlay}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
          <button className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[
          { id: 'source', label: '소스', icon: Link },
          { id: 'playback', label: '재생', icon: Play },
          { id: 'overlay', label: '오버레이', icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 소스 */}
      {activeTab === 'source' && (
        <div className="space-y-4">
          {/* 소스 타입 선택 */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'url', label: 'URL', icon: Link },
              { id: 'upload', label: '업로드', icon: Upload },
              { id: 'youtube', label: 'YouTube', icon: '▶️' },
              { id: 'vimeo', label: 'Vimeo', icon: '🎬' },
            ].map((source) => (
              <button
                key={source.id}
                onClick={() => setSettings({ ...settings, source: source.id as VideoSettings['source'] })}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  settings.source === source.id
                    ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-200'
                }`}
              >
                <span className="text-lg block mb-1">
                  {typeof source.icon === 'string' ? source.icon : <source.icon className="w-4 h-4 mx-auto" />}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{source.label}</span>
              </button>
            ))}
          </div>
          
          {/* URL 입력 */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">비디오 URL</label>
            <input
              type="url"
              value={settings.url}
              onChange={(e) => setSettings({ ...settings, url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
              placeholder="https://example.com/video.mp4"
            />
          </div>
          
          {/* 프리셋 비디오 */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">프리셋 비디오</label>
            <div className="grid grid-cols-2 gap-2">
              {presetVideos.map((video) => (
                <button
                  key={video.name}
                  onClick={() => setSettings({ ...settings, url: video.url })}
                  className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 text-left"
                >
                  <span className="text-2xl">{video.thumbnail}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{video.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 재생 */}
      {activeTab === 'playback' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">자동 재생</span>
              <input
                type="checkbox"
                checked={settings.autoplay}
                onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                className="w-4 h-4 accent-primary-500"
              />
            </label>
            
            <label className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">반복 재생</span>
              <input
                type="checkbox"
                checked={settings.loop}
                onChange={(e) => setSettings({ ...settings, loop: e.target.checked })}
                className="w-4 h-4 accent-primary-500"
              />
            </label>
            
            <label className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">음소거</span>
              <input
                type="checkbox"
                checked={settings.muted}
                onChange={(e) => setSettings({ ...settings, muted: e.target.checked })}
                className="w-4 h-4 accent-primary-500"
              />
            </label>
            
            <label className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">컨트롤 표시</span>
              <input
                type="checkbox"
                checked={settings.controls}
                onChange={(e) => setSettings({ ...settings, controls: e.target.checked })}
                className="w-4 h-4 accent-primary-500"
              />
            </label>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
              재생 속도: {settings.playbackRate}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.playbackRate}
              onChange={(e) => setSettings({ ...settings, playbackRate: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">맞춤</label>
            <select
              value={settings.objectFit}
              onChange={(e) => setSettings({ ...settings, objectFit: e.target.value as VideoSettings['objectFit'] })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
            >
              <option value="cover">커버 (잘림 가능)</option>
              <option value="contain">포함 (전체 표시)</option>
              <option value="fill">채우기 (늘림)</option>
            </select>
          </div>
        </div>
      )}
      
      {/* 오버레이 */}
      {activeTab === 'overlay' && (
        <div className="space-y-4">
          <label className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">오버레이 사용</span>
            <input
              type="checkbox"
              checked={settings.overlay}
              onChange={(e) => setSettings({ ...settings, overlay: e.target.checked })}
              className="w-4 h-4 accent-primary-500"
            />
          </label>
          
          {settings.overlay && (
            <>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">오버레이 색상</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.overlayColor}
                    onChange={(e) => setSettings({ ...settings, overlayColor: e.target.value })}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.overlayColor}
                    onChange={(e) => setSettings({ ...settings, overlayColor: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  투명도: {settings.overlayOpacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.overlayOpacity}
                  onChange={(e) => setSettings({ ...settings, overlayOpacity: parseInt(e.target.value) })}
                  className="w-full accent-primary-500"
                />
              </div>
              
              {/* 프리셋 오버레이 */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">프리셋</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { color: '#000000', opacity: 40, label: '어두움' },
                    { color: '#ffffff', opacity: 20, label: '밝음' },
                    { color: '#3B82F6', opacity: 30, label: '블루' },
                    { color: '#8B5CF6', opacity: 30, label: '퍼플' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setSettings({
                        ...settings,
                        overlayColor: preset.color,
                        overlayOpacity: preset.opacity,
                      })}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 text-center"
                    >
                      <div
                        className="w-8 h-8 rounded mx-auto mb-1"
                        style={{
                          backgroundColor: preset.color,
                          opacity: preset.opacity / 100,
                        }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoBackground;

