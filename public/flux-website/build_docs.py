import os
import glob
import markdown

HEADER = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — Flux Documentation</title>
    <link rel="icon" href="../assets/fluxlogo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<!-- NAV -->
<nav>
    <div class="container">
        <a href="../index.html" class="nav-logo">
            <img src="../assets/fluxlogo.png" alt="Flux">
            Flux
        </a>
        <ul class="nav-links">
            <li><a href="../examples.html">Examples</a></li>
            <li><a href="../features.html">Features</a></li>
            <li><a href="../roadmap.html">Roadmap</a></li>
            <li><a href="../docs.html" class="active">Documentation</a></li>
            <li><a href="../about.html">About</a></li>
            <li><a href="https://github.com/flux-bybluecloud/flux">GitHub</a></li>
        </ul>
    </div>
</nav>
<div class="container docs-layout">
    <aside class="docs-sidebar">
        <div class="docs-nav-group">
            <div class="docs-nav-group-title">Documentation</div>
            <ul class="docs-nav">
                <li><a href="../docs.html">← Back to Index</a></li>
            </ul>
        </div>
    </aside>
    <main class="docs-content">
"""

FOOTER = """
    </main>
</div>
<!-- FOOTER -->
<footer>
    <div class="container">
        <div class="footer-content">
            <div class="footer-text">
                Flux Programming Language · MIT License · 2026<br>
                Made by <a href="https://bluecloudai.online" target="_blank">BlueCloud Technologies</a>
                <img src="../assets/bluecloud_logo.png" alt="BlueCloud Technologies" style="vertical-align: middle; margin-left: 8px;">
            </div>
            <ul class="footer-links">
                <li><a href="https://github.com/flux-bybluecloud/flux">GitHub</a></li>
                <li><a href="../docs.html">Documentation</a></li>
                <li><a href="../about.html">About BlueCloud</a></li>
            </ul>
        </div>
    </div>
</footer>
</body>
</html>
"""

DOCS_INDEX_HEADER = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation — Flux</title>
    <link rel="icon" href="assets/fluxlogo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<!-- NAV -->
<nav>
    <div class="container">
        <a href="index.html" class="nav-logo">
            <img src="assets/fluxlogo.png" alt="Flux">
            Flux
        </a>
        <ul class="nav-links">
            <li><a href="examples.html">Examples</a></li>
            <li><a href="features.html">Features</a></li>
            <li><a href="roadmap.html">Roadmap</a></li>
            <li><a href="docs.html" class="active">Documentation</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="https://github.com/flux-bybluecloud/flux">GitHub</a></li>
        </ul>
    </div>
</nav>

<section class="hero" style="padding: 100px 0 40px;">
    <div class="container">
        <h1 class="section-title">Documentation</h1>
        <p class="section-desc" style="margin: 0 auto;">Everything you need to know about the Flux programming language.</p>
    </div>
</section>

<section style="padding-top: 0;">
    <div class="container">
"""

DOCS_INDEX_FOOTER = """
    </div>
</section>
<!-- FOOTER -->
<footer>
    <div class="container">
        <div class="footer-content">
            <div class="footer-text">
                Flux Programming Language · MIT License · 2026<br>
                Made by <a href="https://bluecloudai.online" target="_blank">BlueCloud Technologies</a>
                <img src="assets/bluecloud_logo.png" alt="BlueCloud Technologies" style="vertical-align: middle; margin-left: 8px;">
            </div>
            <ul class="footer-links">
                <li><a href="https://github.com/flux-bybluecloud/flux">GitHub</a></li>
                <li><a href="docs.html">Documentation</a></li>
                <li><a href="about.html">About BlueCloud</a></li>
            </ul>
        </div>
    </div>
</footer>
</body>
</html>
"""

def build_docs():
    docs_dir = "/home/sadiqgarba/Desktop/flux/docs"
    out_dir = "/home/sadiqgarba/Desktop/flux/website/docs"
    
    os.makedirs(out_dir, exist_ok=True)
    
    md_files = glob.glob(f"{docs_dir}/**/*.md", recursive=True)
    
    # Generate individual pages
    links = []
    for md_file in md_files:
        rel_path = os.path.relpath(md_file, docs_dir)
        html_file = rel_path.replace(".md", ".html")
        out_path = os.path.join(out_dir, html_file)
        
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        
        with open(md_file, "r") as f:
            content = f.read()
            
        html_content = markdown.markdown(content, extensions=['fenced_code', 'tables'])
        title = os.path.basename(md_file).replace(".md", "").replace("-", " ").title()
        
        full_html = HEADER.format(title=title) + html_content + FOOTER
        
        with open(out_path, "w") as f:
            f.write(full_html)
            
        links.append((rel_path.split("/")[0], html_file, title))

    # Generate Docs Index Page
    links.sort()
    
    index_content = DOCS_INDEX_HEADER
    
    current_category = ""
    for category, html_file, title in links:
        cat_title = category.replace("-", " ").title()
        if category != current_category:
            if current_category != "":
                index_content += "</ul>\n"
            index_content += f"<h2 style='margin-top: 32px;'>{cat_title}</h2>\n<ul>\n"
            current_category = category
        
        index_content += f"<li><a href='docs/{html_file}' style='color: var(--accent); font-weight: 500;'>{title}</a></li>\n"
        
    if links:
        index_content += "</ul>\n"
        
    index_content += DOCS_INDEX_FOOTER
    
    with open("/home/sadiqgarba/Desktop/flux/website/docs.html", "w") as f:
        f.write(index_content)
        
if __name__ == "__main__":
    build_docs()
