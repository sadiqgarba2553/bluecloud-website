import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  path = '',
  type = 'website',
  image = null,
  article = null,
  keywords = null,
}) => {
  const siteUrl = 'https://bluecloudai.online';
  const fullUrl = `${siteUrl}${path}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/icon_no_background.PNG`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BlueCloud Technologies" />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific OG */}
      {article && <meta property="article:published_time" content={article.publishedTime} />}
      {article && <meta property="article:modified_time" content={article.modifiedTime || article.publishedTime} />}
      {article && article.tags && article.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      {article && <meta property="article:author" content="Sadiq Garba Ibrahim" />}
      {article && <meta property="article:section" content={article.section || 'Technology'} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@sadeeqsgi" />
      <meta name="twitter:site" content="@sadeeqsgi" />

      {/* Article JSON-LD */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description: description,
            image: ogImage,
            url: fullUrl,
            datePublished: article.publishedTime,
            dateModified: article.modifiedTime || article.publishedTime,
            author: {
              '@type': 'Person',
              name: 'Sadiq Garba Ibrahim',
              url: 'https://bluecloudai.online/port/index.html',
            },
            publisher: {
              '@type': 'Organization',
              name: 'BlueCloud Technologies',
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/icon_no_background.PNG`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': fullUrl,
            },
            keywords: article.tags ? article.tags.join(', ') : '',
            inLanguage: 'en-US',
          })}
        </script>
      )}

      {/* BreadcrumbList JSON-LD for blog posts */}
      {path.startsWith('/blog/') && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
              { '@type': 'ListItem', position: 3, name: title, item: fullUrl },
            ],
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
