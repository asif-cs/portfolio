<h1>🚀 Personal Portfolio Website</h1>

<p>
A modern, responsive, and data-driven personal portfolio website built with
<strong>vanilla HTML, CSS, and JavaScript</strong>.
This project follows a <em>headless content approach</em>,
where all data is loaded dynamically from a JSON file —
allowing instant updates without touching application logic.
</p>

<hr />

<h2>✨ Key Features</h2>

<ul>
  <li>
    <strong>JSON-Driven Content</strong>
    <br />
    All profile details, projects, experience, and skills live inside
    <code>portfolio.json</code>. Editing this file updates the site instantly.
  </li>

  <li>
    <strong>Dark / Light Mode</strong>
    <br />
    Built-in theme switcher with persistence via Local Storage and automatic
    system preference detection.
  </li>

  <li>
    <strong>Interactive Background</strong>
    <br />
    Custom HTML5 Canvas network animation that pauses when the tab is inactive
    to conserve battery and CPU.
  </li>

  <li>
    <strong>Advanced Project Filtering</strong>
    <br />
    Robust multi-select filtering by skills and tags with an expandable UI.
  </li>

  <li>
    <strong>Responsive Design</strong>
    <br />
    Fully adaptive layout using modern CSS Grid and Flexbox — optimised for
    mobile, tablet, and desktop screens.
  </li>

  <li>
    <strong>Accessibility First</strong>
    <br />
    Semantic HTML, focus management for modals, and support for
    <code>prefers-reduced-motion</code>.
  </li>

  <li>
    <strong>SEO Optimised</strong>
    <br />
    Dynamically injects meta titles and descriptions from JSON configuration.
  </li>

  <li>
    <strong>Fullscreen Media Viewer</strong>
    <br />
    Custom lightbox/modal for viewing project images and videos.
  </li>
</ul>

<hr />

<h2>🛠️ Tech Stack</h2>

<ul>
  <li>
    <strong>Frontend:</strong> HTML5, CSS3 (Custom Properties / Variables)
  </li>
  <li>
    <strong>Logic:</strong> Vanilla JavaScript (ES6 Modules)
  </li>
  <li>
    <strong>Data:</strong> JSON
  </li>
  <li>
    <strong>Icons:</strong> Inline SVGs (no external icon fonts)
  </li>
  <li>
    <strong>Fonts:</strong> Inter (via Google Fonts)
  </li>
</ul>

<hr />

<h2>📂 Project Structure</h2>

<pre>
{`├── css/
│   ├── base-styles.css        # Variables, reset, typography, layout
│   └── sections.css           # Component-specific styles
├── js/
│   ├── loader.js              # Fetches JSON and handles loading errors
│   ├── main.js                # App bootstrap and initialisation
│   ├── renderers.js           # Dynamic HTML rendering functions
│   ├── ui-interactions.js     # Events, modals, theme switching
│   ├── utils.js               # Shared helper utilities
│   └── network-background.js  # Canvas animation logic
├── media/                     # Images and videos
├── index.html                 # Main HTML skeleton
├── portfolio.json             # 🔥 Content database (edit this!)
└── README.md`}
</pre>

<hr />

<h2>🚀 Getting Started</h2>

<h3>Prerequisites</h3>

<p>
You must run this project on a local web server.
Browsers block JSON fetching when opening <code>index.html</code> directly
due to CORS restrictions.
</p>

<h3>Installation</h3>

<pre>
{`git clone https://github.com/yourusername/portfolio.git
cd portfolio`}
</pre>

<h3>Run Locally</h3>

<ul>
  <li>
    <strong>VS Code</strong> — Install the <em>Live Server</em> extension and click
    <strong>“Go Live”</strong>
  </li>
  <li>
    <strong>Python 3</strong>
    <pre>{`python3 -m http.server`}</pre>
  </li>
  <li>
    <strong>Node.js (http-server)</strong>
    <pre>{`npx http-server .`}</pre>
  </li>
</ul>

<p>
Open your browser and navigate to:
<code>http://localhost:8000</code> (or the port shown in your terminal).
</p>

<hr />

<h2>📝 How to Customise</h2>

<p>
You never need to edit the HTML or JavaScript to update content.
Everything lives in <code>portfolio.json</code>.
</p>

<h3>1️⃣ Personal Information</h3>

<pre>
{`"personalInfo": {
  "name": "Jane Doe",
  "title": "Full Stack Developer",
  "email": "jane@example.com"
}`}
</pre>

<h3>2️⃣ Adding a Project</h3>

<pre>
{`{
  "id": "proj-new",
  "title": "My New App",
  "description": ["Paragraph 1", "Paragraph 2"],
  "tags": ["React", "Node.js"],
  "links": [{ "name": "Demo", "url": "https://..." }],
  "media": []
}`}
</pre>

<p>
Tags automatically become filterable options in the UI.
</p>

<h3>3️⃣ Changing Colours</h3>

<p>
Open <code>css/base-styles.css</code> and edit the CSS variables:
</p>

<pre>
{`:root {
  --accent-color: #4f46e5;
}`}
</pre>

<hr />

<h2>📄 Licence</h2>

<p>
This project is open source and released under the
<strong>MIT License</strong>.
</p>

<hr />

<h2>👤 Author</h2>

<p>
<strong>Asif Rabnawaz</strong>
</p>

<ul>
  <li><a href="https://www.linkedin.com/in/muhammad-asif-rabnawaz/" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></li>
  <li><a href="https://github.com/asif-cs" target="_blank" rel="noopener noreferrer">GitHub Profile</a></li>
</ul>
