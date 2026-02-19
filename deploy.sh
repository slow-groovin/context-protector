#!/bin/bash

# GitHub Pages 部署脚本
# 用法: ./deploy.sh [commit-message]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 开始部署到 GitHub Pages...${NC}"

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📍 当前分支: $CURRENT_BRANCH${NC}"

# 构建
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build:ghpages

# 复制 404.html
echo -e "${YELLOW}📄 创建 404.html...${NC}"
cp dist/index.html dist/404.html

# 检查是否有更改
cd dist

# 如果 dist 不是 git 仓库，初始化为独立分支
if [ ! -d .git ]; then
  echo -e "${YELLOW}📦 初始化 git 仓库...${NC}"
  git init
  git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
fi

# 添加远程仓库（如果不存在）
REMOTE_URL=$(git remote get-url origin 2>/dev/null || true)
if [ -z "$REMOTE_URL" ]; then
  # 获取原始仓库的 remote
  cd ..
  ORIGIN_URL=$(git remote get-url origin)
  cd dist
  git remote add origin "$ORIGIN_URL"
fi

# 添加所有文件
git add -A

# 提交
COMMIT_MSG="${1:-Deploy to GitHub Pages: $(date '+%Y-%m-%d %H:%M:%S')}"
git commit -m "$COMMIT_MSG" || echo -e "${YELLOW}⚠️ 没有更改需要提交${NC}"

# 推送到 gh-pages 分支
echo -e "${YELLOW}📤 推送到 gh-pages 分支...${NC}"
git push -f origin gh-pages

cd ..

echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}🌐 访问地址: https://slow-groovin.github.io/context-protector/${NC}"
