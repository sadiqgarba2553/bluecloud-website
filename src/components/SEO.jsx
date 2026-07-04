import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path = '', type = 'website' }) => {
  const siteUrl = 'https://bluecloudai.online';
  const fullUrl = `${siteUrl}${path}`;
  const image = `${siteUrl}/icon_no_background.PNG`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="BlueCloud Technologies" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@sadeeqsgi" />
    </Helmet>
  );
};

export default SEO;
