# LatSolarLab 

**Latitude Solar Radiation Calculator / 纬度太阳辐射计算器**

LatSolarLab is a web application that calculates solar radiation received at any location on Earth for any given date. It combines a simplified energy balance model with an interactive 3D globe visualization.

LatSolarLab 是一个基于 Web 的应用程序，用于计算地球上任意位置在任意日期的太阳辐射量。它结合了简化的能量平衡模型和交互式 3D 地球可视化。

---

## Features (功能)

*   **Solar Radiation Calculation (太阳辐射计算)**: Calculate TOA (Top of Atmosphere) daily radiation and net absorption. (计算大气顶层日总辐射和净吸收辐射)
*   **Interactive 3D Globe (交互式 3D 地球)**: Visualize the location and sunlight on a 3D globe. (在 3D 地球上可视化位置和光照)
*   **Geocoding (地理编码)**: Search for cities worldwide using Google Maps API or OpenStreetMap (Nominatim). (使用 Google Maps API 或 OSM 搜索全球城市)
*   **Bilingual Support (双语支持)**: Fully localized in English and Chinese. (完全支持中英文双语)
*   **Responsive Design (响应式设计)**: Works seamlessly on desktop and mobile devices. (完美适配桌面和移动设备)

## Technology Stack (技术栈)

*   **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
*   **3D Visualization**: Three.js, Globe.gl
*   **Geocoding**: Google Maps API / Nominatim API
*   **Formulas**: Simplified solar energy balance equations

## Installation & Setup (安装与设置)

1.  **Clone the repository (克隆仓库)**:
    ```bash
    git clone https://github.com/yourusername/LatSolarLab.git
    cd LatSolarLab
    ```

2.  **Configuration (配置)**:
    *   Duplicate `config.example.js` and rename it to `config.js`. (复制 `config.example.js` 并重命名为 `config.js`)
    *   Add your Google Geocoding API Key to `config.js`. (在 `config.js` 中添加您的 Google API 密钥)
    ```javascript
    const CONFIG = {
        GOOGLE_API_KEY: 'YOUR_API_KEY_HERE'
    };
    ```

3.  **Run Locally (本地运行)**:
    *   Simply open `index.html` in your browser. (直接在浏览器中打开 `index.html`)
    *   Or use a local server (recommended for 3D textures loading): (或使用本地服务器 - 推荐)
    ```bash
    npx http-server .
    ```

## Deployment (部署)

This project is ready for deployment on static hosting services like **Cloudflare Pages**, **Vercel**, or **GitHub Pages**.

### Cloudflare Pages
*   **Build Command**: `node generate-config.js`
*   **Build Output Directory**: `.` (Root directory / 根目录)
*   **Environment Variables**: Add `GOOGLE_API_KEY` with your API key. (添加环境变量 `GOOGLE_API_KEY`)

## License (许可证)

MIT License. See [LICENSE](LICENSE) file for details.
