/**
 * 구조화된 데이터 (JSON-LD) 컴포넌트
 * SEO 최적화를 위한 스키마 마크업
 */

'use client';

import React from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'WebPage' | 'Article' | 'BreadcrumbList' | 'FAQPage';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getSchema = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://freeshell.ai';
    
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Freeshell',
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          description: 'AI 통합 콘텐츠 생성 솔루션',
          sameAs: [
            'https://twitter.com/freeshell',
            'https://facebook.com/freeshell',
            'https://linkedin.com/company/freeshell',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'support@freeshell.ai',
          },
        };
      
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Freeshell',
          url: baseUrl,
          description: 'AI로 만드는 수익형 콘텐츠. 숏폼, 영상, 이미지, 전자책, 글쓰기까지 완전 자동화',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };
      
      case 'WebPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${baseUrl}${data.path || ''}`,
          url: `${baseUrl}${data.path || ''}`,
          name: data.title || 'Freeshell',
          description: data.description || 'AI 통합 콘텐츠 생성 솔루션',
          inLanguage: 'ko-KR',
          isPartOf: {
            '@id': `${baseUrl}#website`,
          },
          about: {
            '@id': `${baseUrl}#organization`,
          },
        };
      
      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          image: data.image || `${baseUrl}/og-image.png`,
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          author: {
            '@type': 'Person',
            name: data.author || 'Freeshell Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Freeshell',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
        };
      
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
          })),
        };
      
      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.questions.map((q: any) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer,
            },
          })),
        };
      
      default:
        return null;
    }
  };

  const schema = getSchema();
  
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

