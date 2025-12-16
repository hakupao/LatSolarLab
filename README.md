# LatSolarLab

Latitude Solar Radiation Calculator / 纬度太阳辐射计算器

计算地球上任意位置在任意日期的太阳辐射量, 并在 3D 地球上联动展示。DMS/十进制坐标切换、双语界面、最近城市提示和地点/日期对比模式均已开箱可用。

---

## Features / 功能
- Solar radiation: TOA 日总辐射与净吸收计算, 支持极昼/极夜提示。
- Dual coordinate formats: 十进制与度分秒互转, 示例按钮与最近城市均支持 DMS。
- Geocoding: 本地城市库 + Nominatim 免费 API, 配置密钥后可切换 Google。
- I18n: 中英文双语, 动态文本与格式切换同步更新。
- Visualization: Three.js + Globe.gl 背景地球, 聚焦选定地点并模拟太阳方向。
- Responsive: 适配桌面与移动端。

## Setup / 安装
1) 克隆仓库 / Clone  
```bash
git clone https://github.com/yourusername/LatSolarLab.git
cd LatSolarLab
```

2) 配置 API 密钥 (可选)  
- 默认使用免费 OSM Nominatim, 无需密钥。  
- 若需 Google Geocoding, 复制 `config.example.js` 为 `config.js` 并填写 `GOOGLE_API_KEY`，或在构建时注入环境变量：  
```bash
GOOGLE_API_KEY=your_key node generate-config.js
```
> 生产环境不要提交真实密钥；`config.js` 已列入 `.gitignore`。

3) 本地运行  
- 直接双击 `index.html`，或使用本地服务器（贴图加载更稳定）：  
```bash
npx http-server .
```

## Deployment / 部署
- 适用于静态托管 (Cloudflare Pages / Vercel / GitHub Pages)。  
- Cloudflare Pages 示例:  
  - Build Command: `node generate-config.js`  
  - Build Output: `.`  
  - Env: `GOOGLE_API_KEY` (可选, 留空则自动回退 OSM)

## Notes / 说明
- DMS 输入错误会提示并阻止计算，避免错误数据进入模型。  
- 最近城市、示例按钮与 3D 聚焦均使用解析后的经纬度，保持一致性。  
- 如果缺失外部依赖 (Globe.gl/Three), 相关功能会优雅降级而不阻塞页面。

## License
MIT License. See [LICENSE](LICENSE) file for details.
