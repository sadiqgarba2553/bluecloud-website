import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import SEO from '../components/SEO';
import { blogPosts } from './Blog';
import './Blog.css';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Find the post by slug
  const post = blogPosts.find(p => p.id === slug);

  if (!post) {
    return (
      <div className="blog-post-page container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <h2>Post not found</h2>
        <button onClick={() => navigate('/blog')} className="btn-primary" style={{ marginTop: '1rem' }}>
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="blog-post-page">
      <SEO 
        title={`${post.title} | BlueCloud Blog`}
        description={post.excerpt}
        path={`/blog/${post.id}`}
        type="article"
      />
      <div className="container">
        <header className="blog-post-header">
          <Link to="/blog" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-color)', textDecoration: 'none', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to all articles
          </Link>
          
          <div>
            <span className="post-tag">{post.tag}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            <span className="post-meta-item"><Calendar size={18} /> {post.date}</span>
            <span className="post-meta-item"><Clock size={18} /> {post.readTime}</span>
          </div>
        </header>

        <img src={post.image} alt={post.title} className="post-hero-image" />

        <div className="post-content">
          <p className="lead" style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-color)' }}>
            {post.excerpt}
          </p>

          <h2>The Landscape is Changing</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. 
            Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. 
            Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
          </p>

          <blockquote>
            "Technology is best when it brings people together and accelerates human potential. The tools we build today define the enterprises of tomorrow."
          </blockquote>

          <h2>Key Takeaways</h2>
          <ul>
            <li><strong>Embrace Automation:</strong> Automating repetitive tasks frees up your team for creative problem-solving.</li>
            <li><strong>Scale Safely:</strong> Enterprise software requires robust architecture from day one.</li>
            <li><strong>Prioritize UX:</strong> The best technology is invisible; the user experience is what matters.</li>
          </ul>

          <p>
            Integer vitae justo eget magna fermentum iaculis eu non diam. Phasellus vestibulum lorem sed risus ultricies tristique nulla. 
            Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Ut diam quam nulla porttitor massa.
          </p>
          
          <div style={{ marginTop: '4rem', padding: '2rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Ready to transform your business?</h3>
            <p style={{ marginBottom: '1.5rem', color: '#475569' }}>Let BlueCloud's experts build your next big solution.</p>
            <Link to="/contact" className="btn-primary">Get in Touch</Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
