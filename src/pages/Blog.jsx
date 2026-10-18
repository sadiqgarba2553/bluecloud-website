import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Star } from 'lucide-react';
import SEO from '../components/SEO';
import './Blog.css';

// Blog Posts Data — World Youth Day is the featured special post
export const blogPosts = [
  {
    id: 'world-youth-day-2026',
    title: 'World Youth Day 2026: A Global Celebration of Hope and Unity',
    excerpt:
      'On July 15th 2026, millions of young people across the globe will come together in spirit, purpose, and community to celebrate World Youth Day. It is an annual event that has, since 1985, grown into one of the largest youth gatherings in history.',
    image: '/world_youth_day_hero.png',
    date: 'July 14, 2026',
    readTime: '8 min read',
    tag: 'World Youth Day',
    featured: true,
    logo: '/worldsyouthdaylogo.svg',
    publishedTime: '2026-07-14T00:00:00Z',
    keywords: 'World Youth Day 2026, youth celebration, global youth event, BlueCloud, July 15 World Youth Day, young people, faith and technology',
    tags: ['World Youth Day', 'Youth', 'Community', 'BlueCloud', 'Nigeria'],
    section: 'Culture',
  },
  {
    id: 'future-of-web-dev-2026',
    title: 'The Future of Web Development in 2026',
    excerpt:
      'AI-assisted coding, edge computing, and WebAssembly are reshaping how we build for the web. Here is how enterprise architectures are shifting and what every development team needs to know to stay ahead.',
    image: '/web_dev_future.png',
    date: 'July 5, 2026',
    readTime: '5 min read',
    tag: 'Web Dev',
    publishedTime: '2026-07-05T00:00:00Z',
    keywords: 'web development 2026, AI coding tools, edge computing, WebAssembly, enterprise software, BlueCloud Technologies',
    tags: ['Web Development', 'AI', 'Edge Computing', 'Enterprise', 'BlueCloud'],
    section: 'Technology',
  },
  {
    id: 'ai-essential-for-enterprises',
    title: 'Why AI is No Longer Optional for Modern Enterprises',
    excerpt:
      'Artificial intelligence has crossed the threshold from competitive advantage to baseline expectation. Workflow automation, predictive analytics, and generative AI are saving businesses thousands of hours and millions in operational costs.',
    image: '/ai_enterprise_hero.png',
    date: 'June 28, 2026',
    readTime: '7 min read',
    tag: 'Artificial Intelligence',
    publishedTime: '2026-06-28T00:00:00Z',
    keywords: 'enterprise AI 2026, AI automation, generative AI business, predictive analytics, AI strategy Nigeria, BlueCloud AI solutions',
    tags: ['Artificial Intelligence', 'Enterprise', 'Automation', 'BlueCloud', 'Nigeria'],
    section: 'Technology',
  },
  {
    id: 'cybersecurity-best-practices',
    title: 'Cybersecurity Best Practices Every Developer Must Know in 2026',
    excerpt:
      'Cyber threats are growing more sophisticated with AI-powered attacks, zero-day exploits, and supply-chain vulnerabilities. Here are the foundational principles that define a truly secure modern web application.',
    image: '/cybersecurity_hero.png',
    date: 'June 15, 2026',
    readTime: '6 min read',
    tag: 'Security',
    publishedTime: '2026-06-15T00:00:00Z',
    keywords: 'cybersecurity 2026, web application security, zero trust, DevSecOps, supply chain security, BlueCloud Technologies Nigeria',
    tags: ['Cybersecurity', 'Security', 'DevSecOps', 'Enterprise', 'BlueCloud'],
    section: 'Technology',
  },
];

const Blog = () => {
  const featuredPost = blogPosts.find((p) => p.featured);
  const regularPosts = blogPosts.filter((p) => !p.featured);

  return (
    <div className="blog-page">
      <SEO
        title="Insights & News | BlueCloud Technologies"
        description="Read the latest articles on web development, artificial intelligence, cybersecurity, and enterprise software engineering from BlueCloud Technologies, based in Abuja, Nigeria."
        path="/blog"
        keywords="BlueCloud blog, web development articles, AI insights Nigeria, cybersecurity tips, enterprise software, BlueCloud Technologies"
      />
      <div className="container">
        <header className="blog-header">
          <h1 className="blog-title">Insights &amp; Resources</h1>
          <p className="blog-subtitle">
            Expert perspectives on technology, artificial intelligence, and building scalable software for the future.
          </p>
        </header>

        {/* ——— WORLD YOUTH DAY FEATURED BANNER ——— */}
        {featuredPost && (
          <div className="wyd-featured-wrapper">
            <div className="wyd-badge">
              <Star size={14} fill="currentColor" />
              Special Edition · Tomorrow
            </div>
            <article className="wyd-featured-card">
              <div className="wyd-featured-image-wrap">
                <img
                  src={featuredPost.image}
                  alt="World Youth Day 2026 Celebration"
                  className="wyd-featured-image"
                />
                <div className="wyd-overlay" />
              </div>
              <div className="wyd-featured-content">
                <div className="wyd-logo-row">
                  <img
                    src={featuredPost.logo}
                    alt="World Youth Day Logo"
                    className="wyd-logo"
                  />
                  <span className="wyd-tag">{featuredPost.tag}</span>
                </div>
                <h2 className="wyd-featured-title">{featuredPost.title}</h2>
                <p className="wyd-featured-excerpt">{featuredPost.excerpt}</p>
                <div className="wyd-meta-row">
                  <span className="wyd-meta-item">
                    <Calendar size={15} /> {featuredPost.date}
                  </span>
                  <span className="wyd-meta-item">
                    <Clock size={15} /> {featuredPost.readTime}
                  </span>
                </div>
                <Link to={`/blog/${featuredPost.id}`} className="wyd-read-btn">
                  Read Full Story <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          </div>
        )}

        {/* ——— REGULAR BLOG GRID ——— */}
        <div className="blog-grid">
          {regularPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <img src={post.image} alt={post.title} className="blog-card-img" />
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span className="blog-tag">{post.tag}</span>
                  <span className="blog-date">{post.date}</span>
                </div>
                <h3 className="blog-card-title">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="read-more">
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
