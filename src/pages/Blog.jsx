import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import './Blog.css';

// Placeholder Blog Posts Data
export const blogPosts = [
  {
    id: 'future-of-web-dev-2026',
    title: 'The Future of Web Development in 2026',
    excerpt: 'Explore the latest trends in web development, from AI-assisted coding to Edge computing, and see how enterprise architectures are shifting.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
    date: 'July 5, 2026',
    readTime: '5 min read',
    tag: 'Web Dev'
  },
  {
    id: 'ai-essential-for-enterprises',
    title: 'Why AI is Essential for Modern Enterprises',
    excerpt: 'Artificial intelligence is no longer a luxury. Discover how automating workflows with AI can save your business thousands of hours.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
    date: 'June 28, 2026',
    readTime: '7 min read',
    tag: 'Artificial Intelligence'
  },
  {
    id: 'cybersecurity-best-practices',
    title: 'Cybersecurity Best Practices for 2026',
    excerpt: 'As threats evolve, so must your defenses. Learn the foundational security measures every modern web application must implement.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    date: 'June 15, 2026',
    readTime: '6 min read',
    tag: 'Security'
  }
];

const Blog = () => {
  return (
    <div className="blog-page">
      <SEO 
        title="Insights & News | BlueCloud Technologies"
        description="Read the latest articles on web development, artificial intelligence, and enterprise software engineering from the experts at BlueCloud."
        path="/blog"
      />
      <div className="container">
        <header className="blog-header">
          <h1 className="blog-title">Insights & Resources</h1>
          <p className="blog-subtitle">
            Expert perspectives on technology, artificial intelligence, and building scalable software for the future.
          </p>
        </header>

        <div className="blog-grid">
          {blogPosts.map(post => (
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
