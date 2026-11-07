const CLOUD_APPS = [
  { id: 'doc-cloud', name: 'Doc Cloud', icon: '/doc-cloud.svg', description: 'Write, edit and organize your documents.' },
  { id: 'sheet-cloud', name: 'Sheet Cloud', icon: '/sheet-cloud.svg', description: 'Formulas, tables, charts and everyday planning.' },
  { id: 'slide-cloud', name: 'Slide Cloud', icon: '/slide-cloud.png', description: 'Editable presentations, speaker notes and slideshows.' },
  { id: 'canvas-cloud', name: 'Canvas Cloud', icon: '/canvas-cloud.png', description: 'A local-first whiteboard for notes and visual ideas.' },
];

export default function CloudApps() {
  return <div className="list-grid">{CLOUD_APPS.map(app => <article className="editorial-block" key={app.id}>
    <div className="tooldeck-heading"><img className="artwork od-media" src={app.icon} alt="" width="128" height="128" loading="lazy" /><div><h3>{app.name}</h3><span className="status">Available · Linux alpha</span></div></div>
    <p style={{ marginTop: 'var(--space-3)' }}>{app.description}</p>
    <a className="text-link" href={'/linux/#' + app.id}>Download for Linux →</a>
  </article>)}</div>;
}
