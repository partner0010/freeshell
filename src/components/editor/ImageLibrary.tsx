'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Image, Download, ExternalLink, X, Loader2, Camera, Heart } from 'lucide-react';

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  likes: number;
  width: number;
  height: number;
}

interface ImageLibraryProps {
  onSelect: (imageUrl: string, alt: string) => void;
  onClose: () => void;
}

// 샘플 이미지 (Unsplash API 키 없이 사용)
const sampleImages: UnsplashImage[] = [
  {
    id: '1',
    urls: {
      small: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      regular: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      full: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    },
    alt_description: 'Abstract colorful background',
    user: { name: 'Designer', username: 'designer' },
    likes: 1234,
    width: 1920,
    height: 1080,
  },
  {
    id: '2',
    urls: {
      small: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
      regular: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
      full: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1',
    },
    alt_description: 'Pink and blue abstract',
    user: { name: 'Artist', username: 'artist' },
    likes: 856,
    width: 1920,
    height: 1280,
  },
  {
    id: '3',
    urls: {
      small: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400',
      regular: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800',
      full: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400',
    },
    alt_description: 'Gradient mesh background',
    user: { name: 'Creative', username: 'creative' },
    likes: 542,
    width: 1920,
    height: 1080,
  },
  {
    id: '4',
    urls: {
      small: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
      regular: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
      full: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    },
    alt_description: 'Colorful gradient',
    user: { name: 'Photographer', username: 'photo' },
    likes: 2341,
    width: 1920,
    height: 1080,
  },
  {
    id: '5',
    urls: {
      small: 'https://images.unsplash.com/photo-1557683316-973673bdar25?w=400',
      regular: 'https://images.unsplash.com/photo-1557683316-973673bdar25?w=800',
      full: 'https://images.unsplash.com/photo-1557683316-973673bdar25',
    },
    alt_description: 'Office workspace',
    user: { name: 'Work', username: 'work' },
    likes: 789,
    width: 1920,
    height: 1280,
  },
  {
    id: '6',
    urls: {
      small: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      regular: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      full: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    },
    alt_description: 'Modern office',
    user: { name: 'Business', username: 'biz' },
    likes: 1567,
    width: 1920,
    height: 1080,
  },
  {
    id: '7',
    urls: {
      small: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      regular: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      full: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    },
    alt_description: 'Team collaboration',
    user: { name: 'Teamwork', username: 'team' },
    likes: 2890,
    width: 1920,
    height: 1280,
  },
  {
    id: '8',
    urls: {
      small: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      regular: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      full: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    },
    alt_description: 'Analytics dashboard',
    user: { name: 'Data', username: 'data' },
    likes: 1234,
    width: 1920,
    height: 1080,
  },
  {
    id: '9',
    urls: {
      small: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
      regular: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
      full: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
    },
    alt_description: 'Developer coding',
    user: { name: 'Tech', username: 'tech' },
    likes: 3456,
    width: 1920,
    height: 1280,
  },
  {
    id: '10',
    urls: {
      small: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
      regular: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      full: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    },
    alt_description: 'Business meeting',
    user: { name: 'Meeting', username: 'meet' },
    likes: 987,
    width: 1920,
    height: 1080,
  },
  {
    id: '11',
    urls: {
      small: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
      regular: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      full: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    },
    alt_description: 'Startup office',
    user: { name: 'Startup', username: 'startup' },
    likes: 2134,
    width: 1920,
    height: 1280,
  },
  {
    id: '12',
    urls: {
      small: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400',
      regular: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
      full: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
    },
    alt_description: 'Creative workspace',
    user: { name: 'Creative', username: 'create' },
    likes: 1876,
    width: 1920,
    height: 1080,
  },
];

const categories = [
  { id: 'all', name: '전체' },
  { id: 'business', name: '비즈니스' },
  { id: 'technology', name: '기술' },
  { id: 'nature', name: '자연' },
  { id: 'abstract', name: '추상' },
  { id: 'people', name: '사람' },
  { id: 'minimal', name: '미니멀' },
];

export function ImageLibrary({ onSelect, onClose }: ImageLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [images, setImages] = useState<UnsplashImage[]>(sampleImages);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setImages(sampleImages);
      return;
    }

    setIsLoading(true);
    // 실제 Unsplash API 연동 시 아래 코드 사용
    // const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=YOUR_API_KEY`);
    // const data = await response.json();
    // setImages(data.results);
    
    // 데모: 검색어 필터링 시뮬레이션
    setTimeout(() => {
      const filtered = sampleImages.filter(img => 
        img.alt_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setImages(filtered.length > 0 ? filtered : sampleImages);
      setIsLoading(false);
    }, 500);
  }, [searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, handleSearch]);

  const handleSelectImage = (image: UnsplashImage) => {
    onSelect(image.urls.regular, image.alt_description || 'Image');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <Image className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-800">이미지 라이브러리</h2>
              <p className="text-sm text-gray-500">무료 고품질 이미지를 선택하세요</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className="p-4 border-b">
          <div className="flex gap-4">
            {/* 검색창 */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이미지 검색..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* 카테고리 */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${activeCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 이미지 그리드 */}
        <div className="p-4 overflow-y-auto h-[calc(90vh-250px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-primary-500" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-gray-100"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.urls.small}
                      alt={image.alt_description || 'Image'}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* 오버레이 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-800 rounded-lg font-medium text-sm transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectImage(image);
                        }}
                      >
                        선택
                      </motion.button>
                    </div>

                    {/* 정보 */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1">
                          <Camera size={12} />
                          {image.user.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={12} />
                          {image.likes}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {images.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Image size={48} className="mb-4 opacity-50" />
              <p>검색 결과가 없습니다</p>
            </div>
          )}
        </div>

        {/* 이미지 미리보기 모달 */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-8"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.urls.regular}
                  alt={selectedImage.alt_description || 'Preview'}
                  className="w-full rounded-2xl"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="text-white">
                    <p className="font-medium">{selectedImage.alt_description}</p>
                    <p className="text-sm opacity-70">by {selectedImage.user.name}</p>
                  </div>
                  <button
                    onClick={() => handleSelectImage(selectedImage)}
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  >
                    이 이미지 사용
                  </button>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                  <X size={20} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 푸터 */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            이미지 제공: <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Unsplash</a>
            {' '}· 무료로 사용 가능한 고품질 이미지
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

