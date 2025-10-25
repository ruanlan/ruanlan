# 高德地图 API 配置指南

本文档详细说明如何获取和配置高德地图 API Key。

## 为什么需要 API Key？

高德地图 JavaScript API 是一个强大的地图服务，需要 API Key 来验证和授权访问。所有高德地图 API 的调用都需要有效的 API Key。

## 获取 API Key 的步骤

### 1. 注册高德开放平台账号

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 点击右上角"注册"按钮
3. 填写注册信息（手机号、邮箱等）
4. 完成账号注册

### 2. 登录控制台

1. 使用注册的账号登录
2. 进入"控制台"

### 3. 创建应用

1. 在控制台左侧菜单选择"应用管理"
2. 点击"我的应用"
3. 点击"创建新应用"按钮
4. 填写应用信息：
   - **应用名称**: 可以填写 "车辆轨迹追踪系统"
   - **应用类型**: 选择 "Web端"
   - **应用描述**: 填写简要描述（可选）
5. 点击"提交"创建应用

### 4. 添加 Key

1. 在刚创建的应用下，点击"添加"按钮
2. 填写 Key 信息：
   - **Key 名称**: 可以填写 "Web端JS API"
   - **服务平台**: 选择 "Web端(JS API)"
   - **绑定域名**: 在开发阶段可以留空或填写 `localhost`
     - 如果需要在生产环境使用，需要填写实际的域名
     - 多个域名可以用逗号分隔
3. 勾选服务项：
   - 确保勾选 "Web端(JS API)"
   - 建议勾选 "静态地图API"（可选）
4. 点击"提交"

### 5. 获取 Key

1. 创建成功后，在应用列表中可以看到刚创建的 Key
2. 复制 "Key" 列中的字符串（一串由字母和数字组成的字符串）
3. 保存好这个 Key，稍后需要配置到项目中

## 配置 API Key 到项目

### 方法 1: 直接修改 HTML 文件

1. 打开项目根目录下的 `index.html` 文件
2. 找到第 8 行的代码：
   ```html
   <script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY"></script>
   ```
3. 将 `YOUR_AMAP_KEY` 替换为你刚才复制的 API Key
4. 保存文件

**示例：**
```html
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"></script>
```

### 方法 2: 使用环境变量（推荐用于生产环境）

如果你不想将 API Key 直接写在代码中，可以使用环境变量的方式：

1. 创建一个新的 JavaScript 文件 `config.js`：
   ```javascript
   const AMAP_CONFIG = {
       key: 'YOUR_AMAP_KEY_HERE'
   };
   ```

2. 在 `index.html` 中引入配置文件：
   ```html
   <script src="config.js"></script>
   <script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY"></script>
   ```

3. 将 `config.js` 添加到 `.gitignore` 文件中，避免提交到代码仓库

## 验证配置是否成功

1. 启动 HTTP 服务器：
   ```bash
   ./start.sh  # Linux/Mac
   # 或
   start.bat   # Windows
   ```

2. 在浏览器中打开 `http://localhost:8000`

3. 打开浏览器的开发者工具（F12）

4. 查看控制台（Console）：
   - **成功**: 应该看到 "地图加载完成" 的消息
   - **失败**: 如果看到错误信息，请检查：
     - API Key 是否正确
     - 网络连接是否正常
     - 域名是否在白名单中

## 常见问题

### Q1: 提示 "INVALID_USER_KEY" 错误

**原因**: API Key 无效或配置错误

**解决方案**:
- 检查是否正确复制了 API Key
- 确认 Key 对应的服务平台是 "Web端(JS API)"
- 确认 Key 的状态是"正常"而不是"停用"

### Q2: 提示 "USERKEY_PLAT_NOMATCH" 错误

**原因**: 当前域名不在 Key 的白名单中

**解决方案**:
- 在控制台中编辑 Key，添加当前域名到白名单
- 开发环境可以添加 `localhost` 或留空
- 生产环境需要添加实际的域名

### Q3: 地图不显示，控制台没有错误

**原因**: 可能是网络问题或浏览器兼容性问题

**解决方案**:
- 检查网络连接
- 尝试使用其他浏览器（推荐 Chrome）
- 检查是否使用 HTTP 服务器访问（不要直接打开 HTML 文件）

### Q4: 提示配额不足

**原因**: 超过了免费配额限制

**解决方案**:
- 查看高德开放平台的配额说明
- 个人开发者账号有每日调用次数限制
- 如需更高配额，可能需要进行认证或付费

## API Key 安全建议

### 开发环境
- 可以直接将 Key 写在代码中
- 建议使用 localhost 域名限制

### 生产环境
1. **域名白名单**: 务必配置域名白名单，限制 Key 的使用范围
2. **不要公开**: 不要将包含 Key 的代码提交到公开的代码仓库
3. **定期更新**: 定期更新 Key，增强安全性
4. **监控使用**: 在控制台中监控 Key 的使用情况，及时发现异常

## API 使用限额

高德地图 API 提供免费配额，具体限额请参考官方文档：
- [高德开放平台价格说明](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)

一般个人开发者的免费配额为：
- 每日调用次数：30万次
- 每秒并发：60次

对于本项目的使用场景，免费配额完全足够。

## 进一步学习

- [高德地图 JavaScript API 官方文档](https://lbs.amap.com/api/javascript-api/summary)
- [高德地图开发示例](https://lbs.amap.com/demo/list/js-api)
- [常见问题 FAQ](https://lbs.amap.com/faq/js-api)

## 需要帮助？

如果在配置过程中遇到问题：
1. 查看浏览器控制台的错误信息
2. 访问高德开放平台的帮助中心
3. 查看本项目的 README.md 文件
4. 在项目的 Issues 中提问

---

**祝你配置顺利！** 🎉
