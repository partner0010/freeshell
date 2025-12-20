import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ShortFormCreator } from '@/lib/content/shortform-creator';
import { BlogWriter } from '@/lib/content/blog-writer';
import { EbookGenerator } from '@/lib/content/ebook-generator';
import { MusicGenerator } from '@/lib/content/music-generator';
import { ContentSecurityManager } from '@/lib/security/content-security';
import { ContentOptimizer } from '@/lib/performance/content-optimizer';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { contentType, topic, options } = await request.json();

    if (!contentType || !topic) {
      return NextResponse.json(
        { error: '콘텐츠 유형과 주제를 입력하세요.' },
        { status: 400 }
      );
    }

    const securityManager = new ContentSecurityManager();
    const optimizer = new ContentOptimizer();
    let result: any;

    switch (contentType) {
      case 'short-video':
      case 'shortform': {
        const creator = new ShortFormCreator();
        const content = await creator.createShortForm(topic, {
          duration: options?.duration || 30,
          aspectRatio: '9:16',
          platform: options?.platform || 'all',
          hashtags: creator.getTrendingHashtags(topic),
        });
        result = {
          type: 'shortform',
          content,
          script: content.description,
          hashtags: content.config.hashtags,
          optimalPostingTimes: creator.getOptimalPostingTimes('tiktok'),
        };
        break;
      }

      case 'blog': {
        const writer = new BlogWriter();
        const keywords = writer.getTrendingKeywords(topic);
        const post = await writer.generateBlogPost({
          topic,
          targetKeywords: keywords,
          tone: options?.tone || 'professional',
          length: options?.length || 'medium',
          includeImages: options?.includeImages !== false,
          seoOptimized: true,
          targetAudience: options?.targetAudience || '일반 사용자',
        });
        result = {
          type: 'blog',
          post,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          keywords: post.keywords,
          seoMeta: post.seoMeta,
          readingTime: post.structure.readingTime,
        };
        break;
      }

      case 'ebook': {
        const generator = new EbookGenerator();
        const chapters = generator.generateStructure(topic, 10);
        const ebook = await generator.generateEbook({
          title: `${topic} 가이드`,
          author: token.name || 'Freeshell 사용자',
          chapters,
          coverDesign: {
            style: 'modern',
            colors: ['#8B5CF6', '#EC4899'],
          },
          format: options?.format || 'all',
          includeTOC: true,
          includeIndex: true,
          metadata: {
            category: '가이드',
            tags: [topic, 'AI', '자동화'],
            description: `${topic}에 대한 완벽한 가이드`,
          },
        });
        result = {
          type: 'ebook',
          ebook,
          title: ebook.title,
          content: ebook.content,
          coverUrl: ebook.coverUrl,
        };
        break;
      }

      case 'audio':
      case 'music': {
        const musicGen = new MusicGenerator();
        const track = await musicGen.generateMusic({
          genre: options?.genre || 'electronic',
          mood: options?.mood || 'energetic',
          duration: options?.duration || 60,
          tempo: options?.tempo || 'medium',
          instruments: options?.instruments || ['synthesizer', 'drums'],
          vocals: options?.vocals || false,
          style: options?.style || 'modern',
        });
        result = {
          type: 'music',
          track,
          title: track.title,
          genre: track.genre,
          mood: track.mood,
          metadata: track.metadata,
        };
        break;
      }

      case 'image': {
        // 기존 이미지 생성 API 사용
        result = {
          type: 'image',
          message: '이미지 생성은 별도 API를 사용하세요.',
          prompt: topic,
        };
        break;
      }

      case 'video': {
        // 기존 비디오 생성 API 사용
        result = {
          type: 'video',
          message: '비디오 생성은 별도 API를 사용하세요.',
          prompt: topic,
        };
        break;
      }

      default:
        return NextResponse.json(
          { error: '지원하지 않는 콘텐츠 유형입니다.' },
          { status: 400 }
        );
    }

    // 보안 적용
    const contentId = `content-${Date.now()}`;
    const security = securityManager.secureContent(contentId, token.id as string, {
      encryption: true,
      watermark: true,
      drm: false,
      accessControl: true,
      auditLog: true,
    });

    securityManager.logSecurityEvent('content_created', contentId, token.id as string, {
      contentType,
      topic,
    });

    // 성능 최적화 적용
    if (result.coverUrl) {
      result.coverUrl = await optimizer.optimizeImage(result.coverUrl, {
        width: 800,
        height: 1200,
        quality: 85,
        format: 'webp',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        security,
        optimized: true,
      },
    });
  } catch (error: any) {
    console.error('콘텐츠 생성 오류:', error);
    return NextResponse.json(
      { error: `콘텐츠 생성 중 오류가 발생했습니다: ${error.message}` },
      { status: 500 }
    );
  }
}
