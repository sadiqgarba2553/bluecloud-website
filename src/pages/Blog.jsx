import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Star } from 'lucide-react';
import SEO from '../components/SEO';
import './Blog.css';

// Blog Posts Data — World Youth Day is the featured special post
import { blogPosts } from '../data/blog';

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
              From the journal
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
                    className="wyd-logo squircle-logo"
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
