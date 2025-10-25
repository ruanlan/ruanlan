# 部署指南

本文档介绍如何将React版本的高德地图车辆轨迹追踪系统部署到生产环境。

---

## 📦 构建生产版本

### 1. 准备工作

确保已安装依赖：

```bash
npm install
```

### 2. 配置生产环境

#### 配置高德地图API Key

编辑 `index.html`：

```html
<script type="text/javascript">
  window._AMapSecurityConfig = {
    securityJsCode: 'YOUR_PRODUCTION_SECURITY_CODE'
  }
</script>
<script src="https://webapi.amap.com/maps?v=2.0&key=YOUR_PRODUCTION_KEY"></script>
```

#### 配置环境变量（可选）

创建 `.env.production`：

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com/ws
```

### 3. 构建

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### 4. 预览构建结果

```bash
npm run preview
```

访问 http://localhost:4173 预览生产版本。

---

## 🚀 部署方式

### 方式一：静态网站托管

#### Vercel（推荐）

1. 安装Vercel CLI：

```bash
npm install -g vercel
```

2. 登录并部署：

```bash
vercel login
vercel --prod
```

3. 按提示完成配置即可。

**优点：**
- ✅ 免费
- ✅ 自动HTTPS
- ✅ CDN加速
- ✅ 自动构建

#### Netlify

1. 安装Netlify CLI：

```bash
npm install -g netlify-cli
```

2. 部署：

```bash
netlify deploy --prod --dir=dist
```

#### GitHub Pages

1. 修改 `vite.config.js`：

```javascript
export default defineConfig({
  base: '/your-repo-name/', // 仓库名
  // ...
})
```

2. 构建并部署：

```bash
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:username/repo.git master:gh-pages
```

### 方式二：云服务器部署

#### Nginx部署

1. 构建项目：

```bash
npm run build
```

2. 上传dist目录到服务器：

```bash
scp -r dist/* user@server:/var/www/amap-tracking/
```

3. 配置Nginx：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/amap-tracking;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. 重启Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### Apache部署

1. 上传dist目录到服务器

2. 配置 `.htaccess`：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 方式三：Docker部署

1. 创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

2. 创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

3. 构建镜像：

```bash
docker build -t amap-tracking .
```

4. 运行容器：

```bash
docker run -d -p 80:80 amap-tracking
```

### 方式四：Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

运行：

```bash
docker-compose up -d
```

---

## 🔐 HTTPS配置

### 使用Let's Encrypt（免费）

```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

### Nginx HTTPS配置

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/amap-tracking;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🎛️ 环境配置

### 开发环境

`.env.development`：

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

### 生产环境

`.env.production`：

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com/ws
```

---

## ⚡ 性能优化

### 1. 启用压缩

Nginx配置：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. 启用缓存

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 使用CDN

修改 `vite.config.js`：

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          amap: ['zustand', 'dayjs']
        }
      }
    }
  }
})
```

---

## 📊 监控和日志

### Nginx访问日志

```nginx
access_log /var/log/nginx/amap-tracking-access.log;
error_log /var/log/nginx/amap-tracking-error.log;
```

### 前端错误监控

可集成：
- Sentry
- LogRocket
- Google Analytics

---

## 🔄 CI/CD

### GitHub Actions示例

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Server
      uses: easingthemes/ssh-deploy@main
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        ARGS: "-rltgoDzvO --delete"
        SOURCE: "dist/"
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: "/var/www/amap-tracking/"
```

---

## 🐛 故障排查

### 问题1：页面刷新404

**原因：** SPA路由未正确配置

**解决：** 配置服务器将所有请求重定向到index.html

### 问题2：API跨域

**解决：** 配置Nginx反向代理

```nginx
location /api/ {
    proxy_pass http://backend-server/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 问题3：地图不显示

**检查：**
1. API Key是否正确
2. 域名是否在白名单
3. HTTPS配置是否正确

---

## 📋 部署检查清单

部署前检查：

- [ ] 配置生产环境API Key
- [ ] 设置环境变量
- [ ] 测试构建产物
- [ ] 配置域名
- [ ] 配置HTTPS
- [ ] 启用gzip压缩
- [ ] 配置缓存策略
- [ ] 设置监控告警
- [ ] 测试移动端兼容性
- [ ] 测试浏览器兼容性

---

## 🔗 相关资源

- [Vercel文档](https://vercel.com/docs)
- [Netlify文档](https://docs.netlify.com/)
- [Nginx文档](https://nginx.org/en/docs/)
- [Docker文档](https://docs.docker.com/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**祝部署顺利！** 🚀
