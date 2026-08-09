import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  path = '',
  type = 'website',
  image = null,
  article = null,
  keywords = null,
  faq = null,
  breadcrumbLabel = null,
}) => {
  const siteUrl = 'https://bluecloudai.online';
  const fullUrl = `${siteUrl}${path}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/icon_no_background.PNG`;

  // Build breadcrumb items
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
  ];

  if (path.startsWith('/blog/')) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` });
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: breadcrumbLabel || title, item: fullUrl });
  } else if (path && path !== '/') {
    const label = breadcrumbLabel || title.split('—')[0].split('|')[0].trim();
    breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: label, item: fullUrl });
  }

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

      {/* WebPage JSON-LD — renders on every page */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': article ? 'BlogPosting' : 'WebPage',
          name: title,
          description: description,
          url: fullUrl,
          image: ogImage,
          inLanguage: 'en-US',
          isPartOf: {
            '@type': 'WebSite',
            name: 'BlueCloud Technologies',
            url: siteUrl,
          },
          ...(article ? {
            headline: title,
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
          } : {
            publisher: {
              '@type': 'Organization',
              name: 'BlueCloud Technologies',
              url: siteUrl,
            },
          }),
        })}
      </script>

      {/* BreadcrumbList JSON-LD — renders on all pages with a path */}
      {path && path !== '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems,
          })}
        </script>
      )}

      {/* FAQPage JSON-LD — optional, for pages with FAQ sections */}
      {faq && faq.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
