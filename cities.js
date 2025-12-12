/**
 * 城市数据库和地理计算函数
 * 包含世界主要城市数据及位置相关功能
 */

// 世界主要城市数据库
const CITIES_DATABASE = [
    // 亚洲 - 东亚
    { name: "东京", nameEn: "Tokyo", country: "日本", countryEn: "Japan", lat: 35.6762, lon: 139.6503 },
    { name: "横滨", nameEn: "Yokohama", country: "日本", countryEn: "Japan", lat: 35.4437, lon: 139.6380 },
    { name: "大阪", nameEn: "Osaka", country: "日本", countryEn: "Japan", lat: 34.6937, lon: 135.5023 },
    { name: "京都", nameEn: "Kyoto", country: "日本", countryEn: "Japan", lat: 35.0116, lon: 135.7681 },
    { name: "札幌", nameEn: "Sapporo", country: "日本", countryEn: "Japan", lat: 43.0642, lon: 141.3469 },
    { name: "福冈", nameEn: "Fukuoka", country: "日本", countryEn: "Japan", lat: 33.5904, lon: 130.4017 },
    { name: "北京", nameEn: "Beijing", country: "中国", countryEn: "China", lat: 39.9042, lon: 116.4074 },
    { name: "上海", nameEn: "Shanghai", country: "中国", countryEn: "China", lat: 31.2304, lon: 121.4737 },
    { name: "广州", nameEn: "Guangzhou", country: "中国", countryEn: "China", lat: 23.1291, lon: 113.2644 },
    { name: "深圳", nameEn: "Shenzhen", country: "中国", countryEn: "China", lat: 22.5431, lon: 114.0579 },
    { name: "香港", nameEn: "Hong Kong", country: "中国", countryEn: "China", lat: 22.3193, lon: 114.1694 },
    { name: "台北", nameEn: "Taipei", country: "台湾", countryEn: "Taiwan", lat: 25.0330, lon: 121.5654 },
    { name: "首尔", nameEn: "Seoul", country: "韩国", countryEn: "South Korea", lat: 37.5665, lon: 126.9780 },
    { name: "釜山", nameEn: "Busan", country: "韩国", countryEn: "South Korea", lat: 35.1796, lon: 129.0756 },

    // 亚洲 - 东南亚
    { name: "新加坡", nameEn: "Singapore", country: "新加坡", countryEn: "Singapore", lat: 1.3521, lon: 103.8198 },
    { name: "曼谷", nameEn: "Bangkok", country: "泰国", countryEn: "Thailand", lat: 13.7563, lon: 100.5018 },
    { name: "雅加达", nameEn: "Jakarta", country: "印度尼西亚", countryEn: "Indonesia", lat: -6.2088, lon: 106.8456 },
    { name: "马尼拉", nameEn: "Manila", country: "菲律宾", countryEn: "Philippines", lat: 14.5995, lon: 120.9842 },
    { name: "河内", nameEn: "Hanoi", country: "越南", countryEn: "Vietnam", lat: 21.0285, lon: 105.8542 },
    { name: "胡志明市", nameEn: "Ho Chi Minh City", country: "越南", countryEn: "Vietnam", lat: 10.8231, lon: 106.6297 },
    { name: "吉隆坡", nameEn: "Kuala Lumpur", country: "马来西亚", countryEn: "Malaysia", lat: 3.1390, lon: 101.6869 },

    // 亚洲 - 南亚
    { name: "孟买", nameEn: "Mumbai", country: "印度", countryEn: "India", lat: 19.0760, lon: 72.8777 },
    { name: "德里", nameEn: "Delhi", country: "印度", countryEn: "India", lat: 28.7041, lon: 77.1025 },
    { name: "班加罗尔", nameEn: "Bangalore", country: "印度", countryEn: "India", lat: 12.9716, lon: 77.5946 },
    { name: "加尔各答", nameEn: "Kolkata", country: "印度", countryEn: "India", lat: 22.5726, lon: 88.3639 },
    { name: "达卡", nameEn: "Dhaka", country: "孟加拉国", countryEn: "Bangladesh", lat: 23.8103, lon: 90.4125 },
    { name: "卡拉奇", nameEn: "Karachi", country: "巴基斯坦", countryEn: "Pakistan", lat: 24.8607, lon: 67.0011 },

    // 亚洲 - 西亚/中东
    { name: "迪拜", nameEn: "Dubai", country: "阿联酋", countryEn: "UAE", lat: 25.2048, lon: 55.2708 },
    { name: "伊斯坦布尔", nameEn: "Istanbul", country: "土耳其", countryEn: "Turkey", lat: 41.0082, lon: 28.9784 },
    { name: "德黑兰", nameEn: "Tehran", country: "伊朗", countryEn: "Iran", lat: 35.6892, lon: 51.3890 },
    { name: "利雅得", nameEn: "Riyadh", country: "沙特阿拉伯", countryEn: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },

    // 欧洲 - 西欧
    { name: "伦敦", nameEn: "London", country: "英国", countryEn: "UK", lat: 51.5074, lon: -0.1278 },
    { name: "巴黎", nameEn: "Paris", country: "法国", countryEn: "France", lat: 48.8566, lon: 2.3522 },
    { name: "柏林", nameEn: "Berlin", country: "德国", countryEn: "Germany", lat: 52.5200, lon: 13.4050 },
    { name: "慕尼黑", nameEn: "Munich", country: "德国", countryEn: "Germany", lat: 48.1351, lon: 11.5820 },
    { name: "阿姆斯特丹", nameEn: "Amsterdam", country: "荷兰", countryEn: "Netherlands", lat: 52.3676, lon: 4.9041 },
    { name: "布鲁塞尔", nameEn: "Brussels", country: "比利时", countryEn: "Belgium", lat: 50.8503, lon: 4.3517 },
    { name: "苏黎世", nameEn: "Zurich", country: "瑞士", countryEn: "Switzerland", lat: 47.3769, lon: 8.5417 },
    { name: "维也纳", nameEn: "Vienna", country: "奥地利", countryEn: "Austria", lat: 48.2082, lon: 16.3738 },

    // 欧洲 - 南欧
    { name: "罗马", nameEn: "Rome", country: "意大利", countryEn: "Italy", lat: 41.9028, lon: 12.4964 },
    { name: "米兰", nameEn: "Milan", country: "意大利", countryEn: "Italy", lat: 45.4642, lon: 9.1900 },
    { name: "马德里", nameEn: "Madrid", country: "西班牙", countryEn: "Spain", lat: 40.4168, lon: -3.7038 },
    { name: "巴塞罗那", nameEn: "Barcelona", country: "西班牙", countryEn: "Spain", lat: 41.3851, lon: 2.1734 },
    { name: "里斯本", nameEn: "Lisbon", country: "葡萄牙", countryEn: "Portugal", lat: 38.7223, lon: -9.1393 },
    { name: "雅典", nameEn: "Athens", country: "希腊", countryEn: "Greece", lat: 37.9838, lon: 23.7275 },

    // 欧洲 - 北欧
    { name: "斯德哥尔摩", nameEn: "Stockholm", country: "瑞典", countryEn: "Sweden", lat: 59.3293, lon: 18.0686 },
    { name: "哥本哈根", nameEn: "Copenhagen", country: "丹麦", countryEn: "Denmark", lat: 55.6761, lon: 12.5683 },
    { name: "奥斯陆", nameEn: "Oslo", country: "挪威", countryEn: "Norway", lat: 59.9139, lon: 10.7522 },
    { name: "赫尔辛基", nameEn: "Helsinki", country: "芬兰", countryEn: "Finland", lat: 60.1699, lon: 24.9384 },
    { name: "雷克雅未克", nameEn: "Reykjavik", country: "冰岛", countryEn: "Iceland", lat: 64.1466, lon: -21.9426 },

    // 欧洲 - 东欧
    { name: "莫斯科", nameEn: "Moscow", country: "俄罗斯", countryEn: "Russia", lat: 55.7558, lon: 37.6173 },
    { name: "圣彼得堡", nameEn: "Saint Petersburg", country: "俄罗斯", countryEn: "Russia", lat: 59.9311, lon: 30.3609 },
    { name: "华沙", nameEn: "Warsaw", country: "波兰", countryEn: "Poland", lat: 52.2297, lon: 21.0122 },
    { name: "布拉格", nameEn: "Prague", country: "捷克", countryEn: "Czech Republic", lat: 50.0755, lon: 14.4378 },
    { name: "布达佩斯", nameEn: "Budapest", country: "匈牙利", countryEn: "Hungary", lat: 47.4979, lon: 19.0402 },

    // 北美洲
    { name: "纽约", nameEn: "New York", country: "美国", countryEn: "USA", lat: 40.7128, lon: -74.0060 },
    { name: "洛杉矶", nameEn: "Los Angeles", country: "美国", countryEn: "USA", lat: 34.0522, lon: -118.2437 },
    { name: "芝加哥", nameEn: "Chicago", country: "美国", countryEn: "USA", lat: 41.8781, lon: -87.6298 },
    { name: "旧金山", nameEn: "San Francisco", country: "美国", countryEn: "USA", lat: 37.7749, lon: -122.4194 },
    { name: "西雅图", nameEn: "Seattle", country: "美国", countryEn: "USA", lat: 47.6062, lon: -122.3321 },
    { name: "华盛顿", nameEn: "Washington DC", country: "美国", countryEn: "USA", lat: 38.9072, lon: -77.0369 },
    { name: "波士顿", nameEn: "Boston", country: "美国", countryEn: "USA", lat: 42.3601, lon: -71.0589 },
    { name: "迈阿密", nameEn: "Miami", country: "美国", countryEn: "USA", lat: 25.7617, lon: -80.1918 },
    { name: "拉斯维加斯", nameEn: "Las Vegas", country: "美国", countryEn: "USA", lat: 36.1699, lon: -115.1398 },
    { name: "多伦多", nameEn: "Toronto", country: "加拿大", countryEn: "Canada", lat: 43.6532, lon: -79.3832 },
    { name: "温哥华", nameEn: "Vancouver", country: "加拿大", countryEn: "Canada", lat: 49.2827, lon: -123.1207 },
    { name: "蒙特利尔", nameEn: "Montreal", country: "加拿大", countryEn: "Canada", lat: 45.5017, lon: -73.5673 },
    { name: "墨西哥城", nameEn: "Mexico City", country: "墨西哥", countryEn: "Mexico", lat: 19.4326, lon: -99.1332 },

    // 南美洲
    { name: "圣保罗", nameEn: "Sao Paulo", country: "巴西", countryEn: "Brazil", lat: -23.5505, lon: -46.6333 },
    { name: "里约热内卢", nameEn: "Rio de Janeiro", country: "巴西", countryEn: "Brazil", lat: -22.9068, lon: -43.1729 },
    { name: "布宜诺斯艾利斯", nameEn: "Buenos Aires", country: "阿根廷", countryEn: "Argentina", lat: -34.6037, lon: -58.3816 },
    { name: "利马", nameEn: "Lima", country: "秘鲁", countryEn: "Peru", lat: -12.0464, lon: -77.0428 },
    { name: "波哥大", nameEn: "Bogota", country: "哥伦比亚", countryEn: "Colombia", lat: 4.7110, lon: -74.0721 },
    { name: "圣地亚哥", nameEn: "Santiago", country: "智利", countryEn: "Chile", lat: -33.4489, lon: -70.6693 },

    // 非洲
    { name: "开罗", nameEn: "Cairo", country: "埃及", countryEn: "Egypt", lat: 30.0444, lon: 31.2357 },
    { name: "拉各斯", nameEn: "Lagos", country: "尼日利亚", countryEn: "Nigeria", lat: 6.5244, lon: 3.3792 },
    { name: "约翰内斯堡", nameEn: "Johannesburg", country: "南非", countryEn: "South Africa", lat: -26.2041, lon: 28.0473 },
    { name: "开普敦", nameEn: "Cape Town", country: "南非", countryEn: "South Africa", lat: -33.9249, lon: 18.4241 },
    { name: "内罗毕", nameEn: "Nairobi", country: "肯尼亚", countryEn: "Kenya", lat: -1.2864, lon: 36.8172 },
    { name: "卡萨布兰卡", nameEn: "Casablanca", country: "摩洛哥", countryEn: "Morocco", lat: 33.5731, lon: -7.5898 },
    { name: "阿尔及尔", nameEn: "Algiers", country: "阿尔及利亚", countryEn: "Algeria", lat: 36.7538, lon: 3.0588 },

    // 大洋洲
    { name: "悉尼", nameEn: "Sydney", country: "澳大利亚", countryEn: "Australia", lat: -33.8688, lon: 151.2093 },
    { name: "墨尔本", nameEn: "Melbourne", country: "澳大利亚", countryEn: "Australia", lat: -37.8136, lon: 144.9631 },
    { name: "布里斯班", nameEn: "Brisbane", country: "澳大利亚", countryEn: "Australia", lat: -27.4698, lon: 153.0251 },
    { name: "珀斯", nameEn: "Perth", country: "澳大利亚", countryEn: "Australia", lat: -31.9505, lon: 115.8605 },
    { name: "奥克兰", nameEn: "Auckland", country: "新西兰", countryEn: "New Zealand", lat: -36.8485, lon: 174.7633 },
    { name: "惠灵顿", nameEn: "Wellington", country: "新西兰", countryEn: "New Zealand", lat: -41.2865, lon: 174.7762 },

    // 极地和特殊位置
    { name: "朗伊尔城", nameEn: "Longyearbyen", country: "挪威", countryEn: "Norway", lat: 78.2232, lon: 15.6267 },
    { name: "费尔班克斯", nameEn: "Fairbanks", country: "美国", countryEn: "USA", lat: 64.8378, lon: -147.7164 },
    { name: "基多", nameEn: "Quito", country: "厄瓜多尔", countryEn: "Ecuador", lat: -0.1807, lon: -78.4678 },
];

/**
 * 使用 Haversine 公式计算两点间的距离
 * @param {number} lat1 - 第一个点的纬度
 * @param {number} lon1 - 第一个点的经度
 * @param {number} lat2 - 第二个点的纬度
 * @param {number} lon2 - 第二个点的经度
 * @returns {number} 距离 (公里)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径 (公里)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

/**
 * 查找最近的城市
 * @param {number} lat - 纬度
 * @param {number} lon - 经度
 * @returns {Object} 包含城市信息和距离的对象
 */
function findNearestCity(lat, lon) {
    let nearest = null;
    let minDistance = Infinity;

    for (const city of CITIES_DATABASE) {
        const distance = calculateDistance(lat, lon, city.lat, city.lon);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = city;
        }
    }

    return {
        city: nearest,
        distance: minDistance
    };
}

/**
 * 搜索城市 (支持中英文)
 * @param {string} query - 搜索关键词
 * @returns {Array} 匹配的城市列表
 */
function searchCities(query) {
    if (!query || query.trim() === '') {
        return [];
    }

    const lowerQuery = query.toLowerCase().trim();
    const results = [];

    for (const city of CITIES_DATABASE) {
        // 检查中文名、英文名、国家名
        if (city.name.toLowerCase().includes(lowerQuery) ||
            city.nameEn.toLowerCase().includes(lowerQuery) ||
            city.country.toLowerCase().includes(lowerQuery) ||
            city.countryEn.toLowerCase().includes(lowerQuery)) {
            results.push(city);
        }
    }

    // 限制返回结果数量
    return results.slice(0, 10);
}

/**
 * 将十进制度数转换为度分秒格式
 * @param {number} decimal - 十进制度数
 * @param {boolean} isLatitude - 是否为纬度 (true) 或经度 (false)
 * @returns {string} 度分秒格式字符串
 */
function convertToDMS(decimal, isLatitude) {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal - minutes) * 60);

    // 确定方向
    let direction;
    if (isLatitude) {
        direction = decimal >= 0 ? 'N' : 'S';
    } else {
        direction = decimal >= 0 ? 'E' : 'W';
    }

    return `${degrees}°${minutes}'${seconds}"${direction}`;
}

/**
 * 将度分秒格式转换为十进制度数
 * @param {number} degrees - 度
 * @param {number} minutes - 分
 * @param {number} seconds - 秒
 * @param {string} direction - 方向 (N/S/E/W)
 * @returns {number} 十进制度数
 */
function convertToDecimal(degrees, minutes, seconds, direction) {
    let decimal = degrees + minutes / 60 + seconds / 3600;

    // 南纬和西经为负数
    if (direction === 'S' || direction === 'W') {
        decimal = -decimal;
    }

    return decimal;
}

/**
 * 解析 DMS 格式字符串
 * @param {string} dmsString - DMS 格式字符串 (例: "35°30'00\"N")
 * @returns {number|null} 十进制度数,解析失败返回 null
 */
function parseDMS(dmsString) {
    // 匹配格式: 35°30'00"N 或 35° 30' 00" N
    const regex = /(\d+)°\s*(\d+)'\s*(\d+)"\s*([NSEW])/i;
    const match = dmsString.match(regex);

    if (!match) {
        return null;
    }

    const degrees = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseInt(match[3]);
    const direction = match[4].toUpperCase();

    return convertToDecimal(degrees, minutes, seconds, direction);
}

/**
 * 格式化距离显示
 * @param {number} distance - 距离 (公里)
 * @returns {string} 格式化的距离字符串
 */
function formatDistance(distance) {
    if (distance < 1) {
        return `${Math.round(distance * 1000)} 米`;
    } else if (distance < 10) {
        return `${distance.toFixed(1)} 公里`;
    } else {
        return `${Math.round(distance)} 公里`;
    }
}

// ===== Geocoding API 集成 =====

/**
 * API 配置
 * 支持两种API: Nominatim (免费) 和 Google Geocoding (需要密钥)
 */
const API_CONFIG = {
    // 当前使用的API提供商: 'nominatim' 或 'google'
    provider: 'google',

    // Google Geocoding API 密钥 (如果使用Google)
    // 获取方式: https://console.cloud.google.com/
    googleApiKey: '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l483TeFcXqg', // 在这里填入你的Google API密钥

    // Nominatim API配置 (免费,无需密钥)
    nominatim: {
        baseUrl: 'https://nominatim.openstreetmap.org/search',
        userAgent: 'LatSolar/1.0',
        limit: 5
    },

    // Google Geocoding API配置
    google: {
        baseUrl: 'https://maps.googleapis.com/maps/api/geocode/json'
    },

    // 缓存配置
    cache: {
        enabled: true,
        expiryDays: 7 // 缓存有效期(天)
    }
};

/**
 * 从缓存获取搜索结果
 * @param {string} query - 搜索关键词
 * @returns {Array|null} 缓存的结果或null
 */
function getCachedResults(query) {
    if (!API_CONFIG.cache.enabled) return null;

    try {
        const cacheKey = `geocode_${query.toLowerCase()}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const data = JSON.parse(cached);
            const now = new Date().getTime();
            const expiryTime = data.timestamp + (API_CONFIG.cache.expiryDays * 24 * 60 * 60 * 1000);

            if (now < expiryTime) {
                return data.results;
            } else {
                // 缓存过期,删除
                localStorage.removeItem(cacheKey);
            }
        }
    } catch (error) {
        console.error('Cache read error:', error);
    }

    return null;
}

/**
 * 保存搜索结果到缓存
 * @param {string} query - 搜索关键词
 * @param {Array} results - 搜索结果
 */
function cacheResults(query, results) {
    if (!API_CONFIG.cache.enabled) return;

    try {
        const cacheKey = `geocode_${query.toLowerCase()}`;
        const data = {
            timestamp: new Date().getTime(),
            results: results
        };
        localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
        console.error('Cache write error:', error);
    }
}

/**
 * 使用 Nominatim API 搜索地点
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
async function searchWithNominatim(query) {
    const url = `${API_CONFIG.nominatim.baseUrl}?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&limit=${API_CONFIG.nominatim.limit}` +
        `&addressdetails=1`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': API_CONFIG.nominatim.userAgent
        }
    });

    if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    // 转换为统一格式
    return data.map(item => {
        // 提取城市名称
        const address = item.address || {};
        const cityName = address.city || address.town || address.village ||
            item.display_name.split(',')[0];

        // 提取国家
        const country = address.country || '';

        return {
            name: cityName,
            nameEn: cityName,
            country: country,
            countryEn: country,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            displayName: item.display_name,
            source: 'nominatim'
        };
    });
}

/**
 * 使用 Google Geocoding API 搜索地点
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
async function searchWithGoogle(query) {
    if (!API_CONFIG.googleApiKey) {
        throw new Error('Google API key not configured');
    }

    // 自动清理可能存在的 GOCSPX- 前缀
    const cleanKey = API_CONFIG.googleApiKey.replace(/^GOCSPX-/, '');

    const url = `${API_CONFIG.google.baseUrl}?` +
        `address=${encodeURIComponent(query)}` +
        `&key=${cleanKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error(`Google API status: ${data.status}`);
    }

    // 转换为统一格式
    return data.results.map(item => {
        const location = item.geometry.location;
        const addressComponents = item.address_components;

        // 提取城市和国家
        let cityName = '';
        let country = '';

        for (const component of addressComponents) {
            if (component.types.includes('locality')) {
                cityName = component.long_name;
            }
            if (component.types.includes('country')) {
                country = component.long_name;
            }
        }

        if (!cityName) {
            cityName = item.formatted_address.split(',')[0];
        }

        return {
            name: cityName,
            nameEn: cityName,
            country: country,
            countryEn: country,
            lat: location.lat,
            lon: location.lng,
            displayName: item.formatted_address,
            source: 'google'
        };
    });
}

/**
 * 使用API搜索地点
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
async function searchWithAPI(query) {
    if (API_CONFIG.provider === 'google') {
        return await searchWithGoogle(query);
    } else {
        return await searchWithNominatim(query);
    }
}

/**
 * 混合搜索: 本地数据库 + API
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
async function searchCitiesHybrid(query) {
    if (!query || query.trim() === '') {
        return [];
    }

    // 1. 先搜索本地数据库 (快速)
    const localResults = searchCities(query);

    // 2. 如果本地结果充足,直接返回
    if (localResults.length >= 5) {
        return localResults;
    }

    // 3. 检查缓存
    const cachedResults = getCachedResults(query);
    if (cachedResults) {
        // 合并本地结果和缓存结果
        return [...localResults, ...cachedResults].slice(0, 10);
    }

    // 4. 如果查询太短,不调用API
    if (query.trim().length < 2) {
        return localResults;
    }

    // 5. 调用API补充结果
    try {
        const apiResults = await searchWithAPI(query);

        // 过滤掉与本地结果重复的项
        const uniqueApiResults = apiResults.filter(apiCity => {
            return !localResults.some(localCity =>
                Math.abs(localCity.lat - apiCity.lat) < 0.1 &&
                Math.abs(localCity.lon - apiCity.lon) < 0.1
            );
        });

        // 缓存API结果
        if (uniqueApiResults.length > 0) {
            cacheResults(query, uniqueApiResults);
        }

        // 合并结果: 本地优先,然后是API
        const combined = [...localResults, ...uniqueApiResults];
        return combined.slice(0, 10);

    } catch (error) {
        console.error('API search failed:', error);
        // API失败时降级到本地结果
        return localResults;
    }
}

/**
 * 设置API提供商
 * @param {string} provider - 'nominatim' 或 'google'
 * @param {string} apiKey - Google API密钥 (如果使用Google)
 */
function setAPIProvider(provider, apiKey = '') {
    if (provider === 'google' && !apiKey) {
        console.warn('Google API key is required');
        return false;
    }

    API_CONFIG.provider = provider;
    if (provider === 'google') {
        API_CONFIG.googleApiKey = apiKey;
    }

    console.log(`API provider set to: ${provider}`);
    return true;
}

