export interface MarketingTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
  relatedTopics: string[];
  tools: string[];
  examples: string[];
  quickWins: string[];
}

export class MarketingKnowledgeBase {
  private topics: Map<string, MarketingTopic> = new Map();

  constructor() {
    this.initializeTopics();
  }

  private initializeTopics() {
    // Social Media Marketing
    this.topics.set('social-media', {
      id: 'social-media',
      title: 'Social Media Marketing',
      description: 'Comprehensive guide to social media marketing for small businesses',
      content: `🚀 **Advanced Social Media Strategy for Business Growth**

**Platform-Specific Strategies:**
• **Facebook**: Focus on community building and local engagement
• **Instagram**: Visual storytelling with Stories and Reels
• **LinkedIn**: B2B networking and thought leadership content
• **TikTok**: Trend-based content for younger demographics
• **Twitter**: Real-time engagement and customer service

**Content Strategy Framework:**
• **40% Educational**: Tips, how-tos, industry insights
• **30% Entertaining**: Behind-the-scenes, team culture
• **20% Promotional**: Products, services, offers
• **10% User-Generated**: Customer testimonials, reviews

**Advanced Tactics:**
• Use social listening tools to monitor brand mentions
• Implement retargeting campaigns for website visitors
• Create platform-specific content calendars
• Leverage user-generated content campaigns
• Use influencer partnerships strategically

**Analytics & Measurement:**
• Track engagement rates, reach, and impressions
• Monitor follower growth and demographics
• Measure click-through rates on links
• Analyze best posting times and content types

**Quick Wins:**
• Set up Facebook Business Manager for advanced analytics
• Create Instagram Reels showcasing your products/services
• Join relevant Facebook groups in your industry
• Use trending hashtags strategically
• Respond to all comments within 2 hours`,
      keywords: ['social media', 'facebook', 'instagram', 'linkedin', 'tiktok', 'twitter', 'content', 'engagement'],
      relatedTopics: ['content-marketing', 'influencer-marketing', 'community-building'],
      tools: ['Facebook Business Manager', 'Instagram Insights', 'Hootsuite', 'Buffer', 'Canva', 'Later'],
      examples: [
        'Restaurant sharing behind-the-scenes kitchen videos',
        'Retail store posting customer testimonials',
        'Service business sharing industry tips and insights'
      ],
      quickWins: [
        'Post consistently 3-5 times per week',
        'Engage with followers within 2 hours',
        'Use local hashtags and location tags',
        'Share user-generated content'
      ]
    });

    // SEO
    this.topics.set('seo', {
      id: 'seo',
      title: 'Search Engine Optimization',
      description: 'Complete SEO strategy for local and national businesses',
      content: `📊 **Comprehensive SEO Strategy for Business Growth**

**Technical SEO Foundation:**
• Optimize website loading speed (target <3 seconds)
• Ensure mobile-first responsive design
• Implement structured data markup (Schema.org)
• Create XML sitemap and submit to Google Search Console
• Fix broken links and 404 errors
• Optimize images with descriptive alt tags

**Local SEO Priorities:**
• Claim and optimize Google Business Profile
• Ensure consistent NAP (Name, Address, Phone) across web
• Build local citations on directories (Yelp, Yellow Pages)
• Encourage customer reviews on Google and other platforms
• Create location-specific landing pages
• Use local keywords in content

**Content SEO Strategy:**
• Research long-tail keywords specific to your location
• Create location-specific landing pages
• Publish regular blog content answering customer questions
• Optimize images with descriptive alt tags
• Use internal linking to improve site structure
• Write compelling meta titles and descriptions

**Advanced Techniques:**
• Implement local link building strategies
• Create location-based content clusters
• Use Google My Business posts regularly
• Monitor and respond to all reviews promptly
• Optimize for featured snippets
• Use schema markup for local business

**Measurement & Analytics:**
• Track organic search traffic and rankings
• Monitor click-through rates from search results
• Analyze user behavior on landing pages
• Measure local search performance`,
      keywords: ['seo', 'google', 'search', 'ranking', 'keywords', 'local seo', 'technical seo'],
      relatedTopics: ['content-marketing', 'local-marketing', 'analytics'],
      tools: ['Google Search Console', 'Google Analytics', 'SEMrush', 'Ahrefs', 'Moz', 'Screaming Frog'],
      examples: [
        'Local restaurant optimizing for "best pizza near me"',
        'Service business targeting city-specific keywords',
        'E-commerce site optimizing product pages'
      ],
      quickWins: [
        'Claim and optimize Google Business Profile',
        'Fix website loading speed issues',
        'Add location-specific keywords to content',
        'Encourage customer reviews'
      ]
    });

    // Content Marketing
    this.topics.set('content-marketing', {
      id: 'content-marketing',
      title: 'Content Marketing',
      description: 'Strategic content marketing framework for business growth',
      content: `✍️ **Strategic Content Marketing Framework**

**Content Types & Distribution:**
• **Blog Posts**: Educational content, how-tos, industry insights
• **Video Content**: Tutorials, product demos, customer stories
• **Infographics**: Data visualization, process explanations
• **Podcasts**: Industry discussions, expert interviews
• **Webinars**: Educational sessions, product demonstrations
• **Case Studies**: Customer success stories and testimonials

**Content Planning Strategy:**
• **Audience Research**: Understand pain points and interests
• **Keyword Research**: Target relevant search terms
• **Content Calendar**: Plan 3 months ahead
• **Repurposing**: Adapt content for multiple platforms
• **Seasonal Planning**: Align with business cycles and holidays

**Content Optimization:**
• Write compelling headlines (use power words)
• Include clear calls-to-action in every piece
• Optimize for featured snippets with structured content
• Use internal linking to improve site structure
• Optimize for mobile reading experience
• Include relevant images and multimedia

**Distribution Channels:**
• **Owned**: Website, email newsletter, social media
• **Earned**: Guest posting, influencer collaborations
• **Paid**: Social media ads, content promotion
• **Shared**: Industry partnerships, co-marketing

**Content Performance Metrics:**
• Page views and time on page
• Social shares and engagement
• Lead generation and conversions
• SEO rankings and organic traffic`,
      keywords: ['content', 'blog', 'writing', 'video', 'infographic', 'podcast', 'webinar'],
      relatedTopics: ['seo', 'social-media', 'email-marketing'],
      tools: ['WordPress', 'Canva', 'Loom', 'BuzzSumo', 'Grammarly', 'Hemingway Editor'],
      examples: [
        'Restaurant sharing recipes and cooking tips',
        'Service business creating how-to guides',
        'Retail store showcasing product usage'
      ],
      quickWins: [
        'Write 3 blog posts answering common questions',
        'Create a video tutorial for your main service',
        'Start an email newsletter with valuable content',
        'Repurpose content across multiple platforms'
      ]
    });

    // Paid Advertising
    this.topics.set('paid-advertising', {
      id: 'paid-advertising',
      title: 'Paid Advertising',
      description: 'Strategic paid advertising framework for business growth',
      content: `💰 **Strategic Paid Advertising Framework**

**Platform Selection Strategy:**
• **Google Ads**: High-intent searches, immediate conversions
• **Facebook/Instagram Ads**: Brand awareness, retargeting
• **LinkedIn Ads**: B2B targeting, professional services
• **TikTok Ads**: Younger demographics, creative content
• **YouTube Ads**: Video content, brand awareness

**Budget Allocation Framework:**
• **Testing Phase**: 20% budget for new campaigns
• **Scaling Phase**: 60% budget for proven performers
• **Maintenance Phase**: 20% budget for optimization
• **Seasonal Adjustments**: Increase during peak periods

**Campaign Types & Objectives:**
• **Awareness**: Reach new audiences, brand recognition
• **Consideration**: Website traffic, engagement
• **Conversion**: Sales, leads, phone calls
• **Retargeting**: Re-engage website visitors
• **Local**: Target specific geographic areas

**Ad Creative Best Practices:**
• Use compelling headlines and clear value propositions
• Include strong calls-to-action
• Test different ad formats and creatives
• Use high-quality images and videos
• A/B test ad copy and landing pages

**Success Metrics & Optimization:**
• **Primary**: Cost per acquisition (CPA), ROAS
• **Secondary**: Click-through rate (CTR), quality score
• **Regular Optimization**: Bid adjustments, audience refinement
• **Performance Analysis**: Weekly reviews and adjustments`,
      keywords: ['ads', 'advertising', 'paid', 'google ads', 'facebook ads', 'budget', 'roas'],
      relatedTopics: ['social-media', 'analytics', 'conversion-optimization'],
      tools: ['Google Ads', 'Facebook Ads Manager', 'LinkedIn Campaign Manager', 'TikTok Ads Manager'],
      examples: [
        'Local restaurant running Google Ads for "food delivery near me"',
        'Service business using Facebook ads for lead generation',
        'E-commerce store running retargeting campaigns'
      ],
      quickWins: [
        'Start with Google Ads targeting 5 main keywords',
        'Create Facebook ads with compelling visuals',
        'Set up retargeting campaigns for website visitors',
        'Test different ad formats and creatives'
      ]
    });

    // Email Marketing
    this.topics.set('email-marketing', {
      id: 'email-marketing',
      title: 'Email Marketing',
      description: 'Comprehensive email marketing strategy for customer engagement',
      content: `📧 **Email Marketing Strategy for Business Growth**

**List Building Strategies:**
• Offer valuable lead magnets (guides, discounts, templates)
• Add signup forms on website and social media
• Collect emails at events and in-store
• Use exit-intent popups and slide-ins
• Implement referral programs
• Create gated content and resources

**Email Types & Sequences:**
• **Welcome Series**: Onboarding new subscribers
• **Weekly Newsletters**: Tips, updates, industry insights
• **Promotional Emails**: Sales, offers, product launches
• **Customer Stories**: Testimonials, case studies
• **Educational Content**: How-tos, tips, industry news
• **Re-engagement**: Win back inactive subscribers

**Best Practices:**
• Personalize subject lines and content
• Mobile-optimized design and templates
• Clear call-to-action buttons
• Segment your audience by behavior and interests
• Test send times and frequency
• Maintain clean email lists

**Automation & Sequences:**
• Welcome series for new subscribers
• Abandoned cart recovery
• Birthday and anniversary emails
• Re-engagement campaigns
• Post-purchase follow-up sequences

**Performance Metrics:**
• Open rates and click-through rates
• Conversion rates and revenue per email
• List growth and unsubscribe rates
• Email deliverability and spam complaints`,
      keywords: ['email', 'newsletter', 'list', 'automation', 'sequence', 'lead magnet'],
      relatedTopics: ['content-marketing', 'conversion-optimization', 'customer-retention'],
      tools: ['Mailchimp', 'Constant Contact', 'ConvertKit', 'ActiveCampaign', 'Klaviyo'],
      examples: [
        'Restaurant sending weekly specials and events',
        'Service business sharing industry tips and updates',
        'E-commerce store with abandoned cart recovery'
      ],
      quickWins: [
        'Create a simple lead magnet (guide or checklist)',
        'Add email signup forms to your website',
        'Send a welcome email to new subscribers',
        'Start a weekly newsletter with valuable content'
      ]
    });

    // Analytics & Measurement
    this.topics.set('analytics', {
      id: 'analytics',
      title: 'Analytics & Measurement',
      description: 'Comprehensive analytics and measurement framework',
      content: `📈 **Analytics & Measurement Framework**

**Key Performance Indicators (KPIs):**
• **Traffic Metrics**: Website visitors, page views, sessions
• **Engagement Metrics**: Time on site, bounce rate, pages per session
• **Conversion Metrics**: Conversion rate, cost per acquisition
• **Revenue Metrics**: Total revenue, average order value, customer lifetime value
• **Marketing Metrics**: ROI, ROAS, customer acquisition cost

**Tools & Platforms:**
• **Google Analytics**: Website traffic and behavior
• **Google Search Console**: SEO performance and search data
• **Social Media Analytics**: Platform-specific insights
• **Email Marketing Analytics**: Open rates, click rates, conversions
• **Advertising Analytics**: Ad performance and ROI

**Data Analysis Process:**
• Set up proper tracking and goals
• Collect data consistently over time
• Analyze trends and patterns
• Identify opportunities and issues
• Make data-driven decisions
• Test and optimize based on insights

**Reporting & Dashboards:**
• Create monthly marketing reports
• Set up automated dashboards
• Track progress toward goals
• Share insights with stakeholders
• Use data to inform strategy

**Advanced Analytics:**
• Customer journey mapping
• Attribution modeling
• A/B testing and experimentation
• Predictive analytics
• Competitive analysis`,
      keywords: ['analytics', 'metrics', 'tracking', 'measurement', 'kpi', 'roi', 'data'],
      relatedTopics: ['seo', 'paid-advertising', 'conversion-optimization'],
      tools: ['Google Analytics', 'Google Search Console', 'Facebook Insights', 'Hotjar', 'Mixpanel'],
      examples: [
        'Tracking website traffic sources and conversions',
        'Measuring social media campaign performance',
        'Analyzing customer behavior and journey'
      ],
      quickWins: [
        'Set up Google Analytics and goals',
        'Create a simple monthly report template',
        'Track key metrics for each marketing channel',
        'Set up automated dashboards'
      ]
    });
  }

  getTopic(id: string): MarketingTopic | undefined {
    return this.topics.get(id);
  }

  searchTopics(query: string): MarketingTopic[] {
    const lowerQuery = query.toLowerCase();
    const results: MarketingTopic[] = [];

    for (const topic of this.topics.values()) {
      if (
        topic.title.toLowerCase().includes(lowerQuery) ||
        topic.description.toLowerCase().includes(lowerQuery) ||
        topic.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
      ) {
        results.push(topic);
      }
    }

    return results;
  }

  getRelatedTopics(topicId: string): MarketingTopic[] {
    const topic = this.topics.get(topicId);
    if (!topic) return [];

    return topic.relatedTopics
      .map(relatedId => this.topics.get(relatedId))
      .filter(Boolean) as MarketingTopic[];
  }

  getAllTopics(): MarketingTopic[] {
    return Array.from(this.topics.values());
  }

  getTopicSuggestions(userMessage: string): string[] {
    const lowerMessage = userMessage.toLowerCase();
    const suggestions: string[] = [];

    // Check for specific topics
    if (lowerMessage.includes('social') || lowerMessage.includes('facebook') || lowerMessage.includes('instagram')) {
      suggestions.push('Tell me about social media strategy');
    }
    if (lowerMessage.includes('seo') || lowerMessage.includes('google') || lowerMessage.includes('search')) {
      suggestions.push('How do I improve my SEO?');
    }
    if (lowerMessage.includes('content') || lowerMessage.includes('blog') || lowerMessage.includes('writing')) {
      suggestions.push('I want to start content marketing');
    }
    if (lowerMessage.includes('ads') || lowerMessage.includes('advertising') || lowerMessage.includes('paid')) {
      suggestions.push('What\'s the best way to advertise online?');
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('newsletter')) {
      suggestions.push('How do I build an email list?');
    }
    if (lowerMessage.includes('analytics') || lowerMessage.includes('tracking') || lowerMessage.includes('measure')) {
      suggestions.push('What metrics should I track?');
    }

    // Add general suggestions if none found
    if (suggestions.length === 0) {
      suggestions.push(
        'I need help with social media strategy',
        'How do I improve my website\'s SEO?',
        'I want to start content marketing',
        'Tell me about paid advertising options'
      );
    }

    return suggestions.slice(0, 4);
  }
} 