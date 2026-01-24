<!--# Context Protector ![Context Protector](/public/favicon.ico)-->
<h1 align="center">
  <img src="/public/icon-192.png" alt="icon" width="24" height="24">   Context Protector
</h1>

<div align="center" style="display: flex; justify-content: center; align-items: center; gap: 4rem; flex-wrap: nowrap;">
<a href="./README_CN.md">中文README</a> 
<a href="https://context-protector.api2o.com" target="_blank">🌐Try it</a>
<br/>
<br/>
<a href="https://vercel.com/new/clone?repository-url=https://github.com/slow-groovin/context-protector"><img src="https://vercel.com/button" alt="Deploy with Vercel" style=""></a>
<a href="https://deploy.workers.cloudflare.com/?url=https://github.com/slow-groovin/context-protector"><img src="https://camo.githubusercontent.com/aa3de9a0130879a84691a2286f5302105d5f3554c5d0af4e3f2f24174eeeea25/68747470733a2f2f6465706c6f792e776f726b6572732e636c6f7564666c6172652e636f6d2f627574746f6e" alt="Deploy to Cloudflare Workers" style="height: 34px;"></a>
</div>

**Replace your sensitive data before pasting it to ChatGPT, Claude, Gemini, or any other AI sites**

<video src="https://github.com/user-attachments/assets/5ef7b0ed-f9a3-4d06-af6d-4fffcdfcfdc7" controls  style="max-width: 80%;">
  Your browser does not support the video tag.
</video>


## ✨ Why Context Protector?

When using AI sites like ChatGPT, Claude, or Gemini, you often need to share code snippets, logs, or documents that may contain sensitive informations. Context Protector helps you redact them.

- 🎯 **Precision Control** - Use regex or exact text matching for perfect replacements
- 🚀 **Work Faster** - Paste, replace, and copy in seconds
- 💾 **Work Offline** - Everything runs locally in your browser.

## 🚀 Installation and Usage

### 1. Web

Simply visit [https://context-protector.api2o.com](https://context-protector.api2o.com) and start using immediately - no installation required.

**PWA Installation**

1. Visit the web app
2. Click the "Install" button in your browser's address bar
3. Use it like a native app with offline support

### 2. Self Hosted
#### Serverless
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/slow-groovin/context-protector)

[![Deploy to Cloudflare Workers](https://camo.githubusercontent.com/aa3de9a0130879a84691a2286f5302105d5f3554c5d0af4e3f2f24174eeeea25/68747470733a2f2f6465706c6f792e776f726b6572732e636c6f7564666c6172652e636f6d2f627574746f6e)](https://deploy.workers.cloudflare.com/?url=https://github.com/slow-groovin/context-protector)

#### 🐳 Docker
```sh
docker run -d \
  --name context-protector \
  -p 8080:80 \
  --restart unless-stopped \
  ghcr.io/slow-groovin/context-protector:latest
```

**Docker Compose**
```yml
services:
  context-protector:
    image: ghcr.io/slow-groovin/context-protector:latest
    container_name: context-protector
    ports:
      - "8080:80"
    restart: unless-stopped
```
#### npm
```sh
npm install
npm run build
npm run preview
```

## 📊 Data Storage

Context Protector stores all your data locally in your browser using the **Origin Private File System (OPFS)**.


## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/slow-groovin/context-protector.git
cd context-protector

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```
