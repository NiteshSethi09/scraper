// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/services/scraper.ts
import * as cheerio from "cheerio";
var WebScraper = class {
  async scrapeUrl(url) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const $ = cheerio.load(html);
      const extractedData = this.extractMetadata($, url);
      return extractedData;
    } catch (error) {
      throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  extractMetadata($, url) {
    const title = this.extractTitle($);
    const description = this.extractDescription($);
    const author = this.extractAuthor($);
    const { datePublished, dateModified } = this.extractDates($);
    const image = this.extractImage($, url);
    const articleSection = this.extractArticleSection($);
    const articleBody = this.extractArticleBody($);
    const breadcrumbs = this.extractBreadcrumbs($, url);
    const faqs = this.extractFaqs($);
    const { publisherName, publisherLogo } = this.extractPublisher($);
    const authorUrl = this.extractAuthorUrl($, url);
    return {
      title,
      description,
      author,
      datePublished,
      dateModified,
      image,
      articleSection,
      articleBody,
      breadcrumbs,
      faqs,
      publisherName,
      publisherLogo,
      authorUrl
    };
  }
  extractTitle($) {
    const selectors = [
      "h1",
      "title",
      '[property="og:title"]',
      '[name="twitter:title"]',
      ".article-title",
      ".post-title",
      ".entry-title"
    ];
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        return element.attr("content") || element.text().trim();
      }
    }
    return "Untitled";
  }
  extractDescription($) {
    const selectors = [
      '[name="description"]',
      '[property="og:description"]',
      '[name="twitter:description"]',
      ".article-description",
      ".post-excerpt",
      ".entry-summary",
      "p"
    ];
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const content = element.attr("content") || element.text().trim();
        if (content && content.length > 20) {
          return content.substring(0, 300) + (content.length > 300 ? "..." : "");
        }
      }
    }
    return "";
  }
  extractAuthor($) {
    const selectors = [
      '[rel="author"]',
      '[property="article:author"]',
      '[name="author"]',
      ".author",
      ".byline",
      ".article-author",
      ".post-author"
    ];
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const content = element.attr("content") || element.text().trim();
        if (content) {
          return content;
        }
      }
    }
    return void 0;
  }
  extractDates($) {
    const publishedSelectors = [
      '[property="article:published_time"]',
      '[name="publishdate"]',
      "time[datetime]",
      ".published",
      ".date"
    ];
    const modifiedSelectors = [
      '[property="article:modified_time"]',
      '[name="modifieddate"]',
      ".updated",
      ".modified"
    ];
    let datePublished;
    let dateModified;
    for (const selector of publishedSelectors) {
      const element = $(selector).first();
      if (element.length) {
        datePublished = element.attr("content") || element.attr("datetime") || element.text().trim();
        if (datePublished) break;
      }
    }
    for (const selector of modifiedSelectors) {
      const element = $(selector).first();
      if (element.length) {
        dateModified = element.attr("content") || element.attr("datetime") || element.text().trim();
        if (dateModified) break;
      }
    }
    return {
      datePublished: datePublished ? this.formatDate(datePublished) : void 0,
      dateModified: dateModified ? this.formatDate(dateModified) : void 0
    };
  }
  extractImage($, baseUrl) {
    const selectors = [
      '[property="og:image"]',
      '[name="twitter:image"]',
      "article img",
      ".featured-image img",
      ".post-image img",
      "img"
    ];
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const src = element.attr("content") || element.attr("src");
        if (src) {
          const absoluteUrl = this.makeAbsoluteUrl(src, baseUrl);
          const width = element.attr("width") ? parseInt(element.attr("width")) : void 0;
          const height = element.attr("height") ? parseInt(element.attr("height")) : void 0;
          return {
            url: absoluteUrl,
            width: width || 940,
            height: height || 564
          };
        }
      }
    }
    return void 0;
  }
  extractArticleSection($) {
    const selectors = [
      '[property="article:section"]',
      ".category",
      ".section",
      ".article-category",
      ".post-category",
      "nav .breadcrumb a:last-of-type"
    ];
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const content = element.attr("content") || element.text().trim();
        if (content) {
          return content;
        }
      }
    }
    return void 0;
  }
  extractArticleBody($) {
    const contentSelectors = [
      "article p",
      ".post-content p",
      ".entry-content p",
      ".article-content p",
      ".content p",
      "main p"
    ];
    let fullText = "";
    for (const selector of contentSelectors) {
      const paragraphs = $(selector);
      if (paragraphs.length > 5) {
        let combinedText = "";
        paragraphs.each((index, elem) => {
          const text = $(elem).text().trim();
          if (text.length > 20) {
            combinedText += text + " ";
          }
        });
        if (combinedText.length > fullText.length) {
          fullText = combinedText;
        }
      }
    }
    if (fullText.length < 500) {
      const containerSelectors = [
        '[property="articleBody"]',
        ".article-body",
        ".post-body",
        ".entry-body",
        ".article-content",
        ".post-content",
        ".entry-content",
        ".content-area",
        ".main-content",
        "article",
        ".content",
        "main"
      ];
      for (const selector of containerSelectors) {
        const element = $(selector).first();
        if (element.length) {
          const contentElement = element.clone();
          contentElement.find("script, style, nav, header, footer, .navigation, .breadcrumb, .social-share, .comments, .sidebar, .related-posts, .author-box, .tags, .categories, .meta, .advertisement, .ads, .social-media, .share-buttons").remove();
          const content = contentElement.text().trim();
          const cleanContent = content.replace(/\s+/g, " ").trim();
          if (cleanContent.length > fullText.length && cleanContent.length > 200) {
            fullText = cleanContent;
          }
        }
      }
    }
    if (fullText.length > 200) {
      const cleanText = fullText.replace(/\s+/g, " ").trim();
      return cleanText;
    }
    return void 0;
  }
  extractBreadcrumbs($, url) {
    const breadcrumbs = [];
    const breadcrumbSelectors = [
      ".breadcrumb a",
      ".breadcrumbs a",
      '[typeof="BreadcrumbList"] a',
      'nav[aria-label*="bread" i] a'
    ];
    let found = false;
    for (const selector of breadcrumbSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        elements.each((index, element) => {
          const $el = $(element);
          const text = $el.text().trim();
          const href = $el.attr("href");
          if (text && href) {
            let absoluteUrl = this.makeAbsoluteUrl(href, url);
            if (index < elements.length - 1 && !absoluteUrl.endsWith("/") && !absoluteUrl.includes("?") && !absoluteUrl.includes("#")) {
              absoluteUrl += "/";
            }
            breadcrumbs.push({
              name: text,
              url: absoluteUrl,
              position: index + 1
            });
          }
        });
        found = true;
        break;
      }
    }
    if (!found) {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/").filter((segment) => segment.length > 0);
      breadcrumbs.push({
        name: "Home",
        url: `${urlObj.protocol}//${urlObj.host}`,
        position: 1
      });
      let currentPath = "";
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const name = segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        const urlPath = index < pathSegments.length - 1 ? `${currentPath}/` : currentPath;
        breadcrumbs.push({
          name,
          url: `${urlObj.protocol}//${urlObj.host}${urlPath}`,
          position: index + 2
        });
      });
    }
    return breadcrumbs;
  }
  extractPublisher($) {
    const nameSelectors = [
      '[property="og:site_name"]',
      ".site-name",
      ".site-title",
      'meta[name="application-name"]'
    ];
    const logoSelectors = [
      'link[rel="icon"]',
      'link[rel="apple-touch-icon"]',
      ".logo img",
      ".site-logo img"
    ];
    let publisherName;
    let publisherLogo;
    for (const selector of nameSelectors) {
      const element = $(selector).first();
      if (element.length) {
        publisherName = element.attr("content") || element.text().trim();
        if (publisherName) break;
      }
    }
    for (const selector of logoSelectors) {
      const element = $(selector).first();
      if (element.length) {
        publisherLogo = element.attr("href") || element.attr("src");
        if (publisherLogo) break;
      }
    }
    return { publisherName, publisherLogo };
  }
  extractAuthorUrl($, baseUrl) {
    const selectors = [
      '[rel="author"]',
      ".author a",
      ".byline a",
      ".article-author a",
      ".post-author a",
      ".entry-author a",
      'a[href*="/author/"]',
      'a[href*="/authors/"]',
      ".author-info a",
      ".author-name a"
    ];
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.attr("href")) {
        const href = element.attr("href");
        return this.makeAbsoluteUrl(href, baseUrl);
      }
    }
    return void 0;
  }
  extractFaqs($) {
    const faqs = [];
    const faqSelectors = [
      // Standard FAQ sections
      ".faq-item, .faq-question, .faq-entry",
      ".accordion-item, .accordion",
      '[class*="faq"] [class*="item"]',
      '[class*="faq"] dt, [class*="faq"] dd',
      // Question/Answer patterns
      ".question, .answer",
      ".qa-item, .qa-pair",
      '[class*="question"], [class*="answer"]',
      // Details/Summary HTML5 elements
      "details summary, details",
      // Heading + paragraph patterns
      "h3 + p, h4 + p, h5 + p",
      "h3 + div, h4 + div, h5 + div",
      // Schema.org structured data
      '[itemtype*="Question"], [itemtype*="Answer"]'
    ];
    $(".faq-item, .faq-question, .faq-entry, .accordion-item").each((_, element) => {
      const $item = $(element);
      const questionSelectors = ["h3, h4, h5, h6", ".question", ".faq-question", "summary", '[class*="question"]'];
      const answerSelectors = ["p, div:not(.question)", ".answer", ".faq-answer", '[class*="answer"]'];
      let question = "";
      let answer = "";
      for (const qSelector of questionSelectors) {
        const qElement = $item.find(qSelector).first();
        if (qElement.length && qElement.text().trim()) {
          question = qElement.text().trim();
          break;
        }
      }
      for (const aSelector of answerSelectors) {
        const aElement = $item.find(aSelector).first();
        if (aElement.length && aElement.text().trim() && aElement.text().trim() !== question) {
          answer = aElement.text().trim();
          break;
        }
      }
      if (question && answer && question !== answer) {
        faqs.push({ question, answer });
      }
    });
    if (faqs.length === 0) {
      $("details").each((_, element) => {
        const $details = $(element);
        const question = $details.find("summary").first().text().trim();
        const $content = $details.clone();
        $content.find("summary").remove();
        const answer = $content.text().trim();
        if (question && answer && question !== answer) {
          faqs.push({ question, answer });
        }
      });
    }
    if (faqs.length === 0) {
      $("h3, h4, h5, h6").each((_, element) => {
        const $heading = $(element);
        const headingText = $heading.text().trim();
        if (headingText.includes("?") || headingText.toLowerCase().includes("what") || headingText.toLowerCase().includes("how") || headingText.toLowerCase().includes("why") || headingText.toLowerCase().includes("when") || headingText.toLowerCase().includes("where") || headingText.toLowerCase().includes("can") || headingText.toLowerCase().includes("will") || headingText.toLowerCase().includes("should") || headingText.toLowerCase().includes("do ") || headingText.toLowerCase().includes("does ") || headingText.toLowerCase().includes("is ")) {
          const $next = $heading.next();
          if ($next.length && ($next.is("p") || $next.is("div"))) {
            const answer = $next.text().trim();
            if (answer && answer !== headingText && answer.length > 20) {
              faqs.push({ question: headingText, answer });
            }
          }
        }
      });
    }
    if (faqs.length === 0) {
      $('script[type="application/ld+json"]').each((_, element) => {
        try {
          const data = JSON.parse($(element).html() || "");
          if (data["@type"] === "FAQPage" && data.mainEntity) {
            data.mainEntity.forEach((item) => {
              if (item["@type"] === "Question" && item.name && item.acceptedAnswer) {
                const question = item.name;
                const answer = item.acceptedAnswer.text || item.acceptedAnswer.name || "";
                if (question && answer) {
                  faqs.push({ question, answer });
                }
              }
            });
          }
        } catch (e) {
        }
      });
    }
    const uniqueFaqs = faqs.filter(
      (faq, index, self) => index === self.findIndex((f) => f.question.toLowerCase() === faq.question.toLowerCase())
    );
    return uniqueFaqs.slice(0, 20);
  }
  makeAbsoluteUrl(url, baseUrl) {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }
  formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr;
      }
      return date.toISOString();
    } catch {
      return dateStr;
    }
  }
};

// server/services/schemaGenerator.ts
var SchemaGenerator = class {
  generateArticleSchema(data, url) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };
    if (data.description) {
      schema.description = data.description;
    }
    if (data.image) {
      schema.image = {
        "@type": "ImageObject",
        "url": data.image.url,
        ...data.image.height && { height: data.image.height },
        ...data.image.width && { width: data.image.width }
      };
    }
    if (data.author) {
      schema.author = {
        "@type": "Person",
        "name": data.author,
        ...data.authorUrl && { url: data.authorUrl }
      };
    }
    if (data.publisherName) {
      schema.publisher = {
        "@type": "Organization",
        "name": data.publisherName,
        ...data.publisherLogo && {
          logo: {
            "@type": "ImageObject",
            "url": data.publisherLogo
          }
        }
      };
    }
    if (data.datePublished) {
      schema.datePublished = data.datePublished;
    }
    if (data.dateModified) {
      schema.dateModified = data.dateModified;
    }
    if (data.articleSection) {
      schema.articleSection = data.articleSection;
    }
    if (data.articleBody) {
      schema.articleBody = data.articleBody;
    }
    return schema;
  }
  generateBreadcrumbSchema(data) {
    if (!data.breadcrumbs || data.breadcrumbs.length === 0) {
      return null;
    }
    const schema = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      "name": data.title,
      "itemListElement": data.breadcrumbs.map((breadcrumb) => ({
        "@type": "ListItem",
        "position": breadcrumb.position.toString(),
        "item": {
          "@id": breadcrumb.url,
          "name": breadcrumb.name
        }
      }))
    };
    return schema;
  }
  generateFaqSchema(data) {
    if (!data.faqs || data.faqs.length === 0) {
      return null;
    }
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    return schema;
  }
};

// shared/schema.ts
import { z } from "zod";
var scrapeRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  generateArticle: z.boolean().default(true),
  generateBreadcrumb: z.boolean().default(true),
  generateFaq: z.boolean().default(true)
});
var extractedDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string().optional(),
  datePublished: z.string().optional(),
  dateModified: z.string().optional(),
  image: z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional()
  }).optional(),
  articleSection: z.string().optional(),
  articleBody: z.string().optional(),
  breadcrumbs: z.array(z.object({
    name: z.string(),
    url: z.string(),
    position: z.number()
  })),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })),
  publisherName: z.string().optional(),
  publisherLogo: z.string().optional(),
  authorUrl: z.string().optional()
});
var schemaResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    extractedData: extractedDataSchema,
    schemas: z.object({
      article: z.record(z.any()).optional(),
      breadcrumb: z.record(z.any()).optional(),
      faq: z.record(z.any()).optional()
    })
  }).optional(),
  error: z.string().optional()
});

// server/routes.ts
async function registerRoutes(app2) {
  const scraper = new WebScraper();
  const schemaGenerator = new SchemaGenerator();
  app2.post("/api/scrape", async (req, res) => {
    try {
      const validationResult = scrapeRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request data: " + validationResult.error.errors.map((e) => e.message).join(", ")
        });
      }
      const { url, generateArticle, generateBreadcrumb, generateFaq } = validationResult.data;
      const extractedData = await scraper.scrapeUrl(url);
      const schemas = {};
      if (generateArticle) {
        schemas.article = schemaGenerator.generateArticleSchema(extractedData, url);
      }
      if (generateBreadcrumb) {
        const breadcrumbSchema = schemaGenerator.generateBreadcrumbSchema(extractedData);
        if (breadcrumbSchema) {
          schemas.breadcrumb = breadcrumbSchema;
        }
      }
      if (generateFaq) {
        const faqSchema = schemaGenerator.generateFaqSchema(extractedData);
        if (faqSchema) {
          schemas.faq = faqSchema;
        }
      }
      const response = {
        success: true,
        data: {
          extractedData,
          schemas
        }
      };
      res.json(response);
    } catch (error) {
      console.error("Scraping error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "An error occurred while scraping the URL"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5005", 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
