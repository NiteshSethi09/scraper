# Schema Generator - Complete with FAQ Support

A comprehensive web scraping tool that extracts content from URLs and automatically generates Schema.org Article, Breadcrumb, and FAQ markup.

## ✨ Features

- **Article Schema**: Extract metadata, author, dates, images, and content
- **Breadcrumb Schema**: Generate navigation breadcrumbs with proper URL formatting  
- **FAQ Schema**: Intelligent FAQ detection and structured data generation
- **Script Tag Wrapping**: All schemas include proper HTML script tags
- **Copy & Minify**: Both formatted and minified versions with one-click copy
- **Google Testing**: Direct integration with Google Rich Results testing
- **No API Keys**: Works completely out of the box

## 🚀 Quick Deploy

### Railway (Recommended - Free)
1. Upload to GitHub repository
2. Go to [railway.app](https://railway.app)
3. Connect GitHub and deploy
4. Your app will be live instantly!

### Other Free Options
- **Render**: Great for Node.js apps
- **Vercel**: Perfect for full-stack applications  
- **Netlify**: Frontend + separate backend

## 📁 Installation

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm start
```

## 🔧 Build Settings

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+
- **Port**: Automatically assigned by hosting platform

## 🎯 FAQ Extraction Intelligence

The FAQ extractor uses multiple detection methods:

- **Structured Sections**: `.faq-item`, `.accordion-item` patterns
- **HTML5 Elements**: `<details>` and `<summary>` tags
- **Question Headers**: H3-H6 headers followed by content paragraphs
- **JSON-LD Detection**: Existing structured data extraction
- **Pattern Recognition**: Detects question words (what, how, why, etc.)

## 📊 Schema Output

All schemas are generated in proper JSON-LD format:
- Article Schema with full content and metadata
- Breadcrumb Schema with trailing slash URLs
- FAQ Schema with question/answer pairs
- Complete `<script type="application/ld+json">` wrapping

## 🌟 Perfect For

- SEO agencies and consultants
- Content creators and bloggers
- E-commerce websites
- Documentation sites with FAQs
- Any website needing structured data

Your complete Schema Generator is ready for deployment! 🚀