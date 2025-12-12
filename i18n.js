/**
 * LatSolar - 国际化语言文件
 * 支持中文和英文双语切换
 */

const translations = {
    zh: {
        // 页面标题
        pageTitle: "LatSolar - 纬度太阳辐射计算器",
        metaDescription: "计算地球上任意位置在任意日期接收的太阳辐射量",

        // 头部
        title: "LatSolar",
        subtitle: "纬度太阳辐射计算器",
        description: "计算地球上任意位置接收的太阳辐射量",

        // 输入表单
        inputTitle: "📍 输入位置和日期",
        citySearch: "🔍 搜索城市",
        citySearchPlaceholder: "输入城市名称 (中文或英文)...",
        citySearchHint: "选择城市后将自动填充坐标",

        latitude: "纬度",
        latitudeDMS: "纬度 (DMS)",
        latitudeUnit: "(°)",
        latitudePlaceholder: "例: 35.0",
        latitudeHint: "范围: -90° (南极) 到 90° (北极)",

        longitude: "经度",
        longitudeDMS: "经度 (DMS)",
        longitudeUnit: "(°)",
        longitudePlaceholder: "例: 139.65",
        longitudeHint: "范围: -180° 到 180°",

        date: "日期",

        nearestCity: "输入坐标后显示最近城市",
        formatToggleToDMS: "切换为度分秒",
        formatToggleToDecimal: "切换为十进制",

        calculate: "计算",
        calculating: "计算中...",

        // 快速示例
        examplesTitle: "快速示例:",
        exampleYokohama: "🗾 横滨 (35°N)",
        exampleEquator: "🌍 赤道",
        exampleArctic: "🌌 北极圈",
        exampleAntarctic: "🐧 南极圈",

        // 结果显示
        resultsTitle: "📊 计算结果",
        dayOfYear: "日序数",
        solarDeclination: "太阳赤纬角 (δ)",
        daylightHours: "日照时长",
        toaRadiation: "TOA 日总辐射 (H)",
        netAbsorption: "净吸收辐射 (F_in)",

        hours: "小时",
        polarNight: "极夜",
        polarDay: "极昼",

        // 季节提示
        seasonTropical: "🌴 热带地区,全年接收较高的太阳辐射",
        seasonNorthSummer: "☀️ 北半球夏季,日照时间长,辐射强",
        seasonNorthWinter: "❄️ 北半球冬季,日照时间短,辐射弱",
        seasonNorthTransition: "🍂 北半球春秋季,辐射适中",
        seasonSouthSummer: "☀️ 南半球夏季,日照时间长,辐射强",
        seasonSouthWinter: "❄️ 南半球冬季,日照时间短,辐射弱",
        seasonSouthTransition: "🍂 南半球春秋季,辐射适中",

        // 公式参考
        formulaTitle: "📐 计算公式参考",
        formulaSolarDeclination: "太阳赤纬角:",
        formulaHourAngle: "日出/日落时角:",
        formulaDaylight: "日照时长:",
        formulaTOA: "日总辐射 (TOA):",
        formulaNetAbsorption: "净吸收辐射:",
        formulaNote: "说明:",
        formulaNoteItems: [
            "S₀ = 1367 W/m² (太阳常数)",
            "φ = 纬度, δ = 赤纬角, ω = 时角, n = 日序数",
            "TOA = Top of Atmosphere (大气顶层)",
            "k = 有效吸收因子,考虑大气散射、云反射、地表反照率等综合效应"
        ],

        // 页脚
        footerText: "基于简化的能量收支模型 | 数据仅供参考",
        footerCopyright: "© 2025 LatSolar",

        // 错误信息
        errorLatitude: "纬度必须在 -90° 到 90° 之间",
        errorLongitude: "经度必须在 -180° 到 180° 之间",
        errorCalculation: "计算出错:",
        errorDMSFormat: "DMS格式错误,请使用格式: 35°30'00\"N",

        // 语言切换
        languageName: "中文",
        switchLanguage: "English"
    },

    en: {
        // Page title
        pageTitle: "LatSolar - Latitude Solar Radiation Calculator",
        metaDescription: "Calculate solar radiation received at any location on Earth on any date",

        // Header
        title: "LatSolar",
        subtitle: "Latitude Solar Radiation Calculator",
        description: "Calculate solar radiation at any location on Earth",

        // Input form
        inputTitle: "📍 Enter Location and Date",
        citySearch: "🔍 Search City",
        citySearchPlaceholder: "Enter city name (Chinese or English)...",
        citySearchHint: "Coordinates will be auto-filled after selecting a city",

        latitude: "Latitude",
        latitudeDMS: "Latitude (DMS)",
        latitudeUnit: "(°)",
        latitudePlaceholder: "e.g. 35.0",
        latitudeHint: "Range: -90° (South Pole) to 90° (North Pole)",

        longitude: "Longitude",
        longitudeDMS: "Longitude (DMS)",
        longitudeUnit: "(°)",
        longitudePlaceholder: "e.g. 139.65",
        longitudeHint: "Range: -180° to 180°",

        date: "Date",

        nearestCity: "Nearest city will be shown after entering coordinates",
        formatToggleToDMS: "Switch to DMS",
        formatToggleToDecimal: "Switch to Decimal",

        calculate: "Calculate",
        calculating: "Calculating...",

        // Quick examples
        examplesTitle: "Quick Examples:",
        exampleYokohama: "🗾 Yokohama (35°N)",
        exampleEquator: "🌍 Equator",
        exampleArctic: "🌌 Arctic Circle",
        exampleAntarctic: "🐧 Antarctic Circle",

        // Results
        resultsTitle: "📊 Calculation Results",
        dayOfYear: "Day of Year",
        solarDeclination: "Solar Declination (δ)",
        daylightHours: "Daylight Hours",
        toaRadiation: "TOA Daily Radiation (H)",
        netAbsorption: "Net Absorption (F_in)",

        hours: "hours",
        polarNight: "Polar Night",
        polarDay: "Polar Day",

        // Season hints
        seasonTropical: "🌴 Tropical region, high solar radiation year-round",
        seasonNorthSummer: "☀️ Northern summer, long daylight, strong radiation",
        seasonNorthWinter: "❄️ Northern winter, short daylight, weak radiation",
        seasonNorthTransition: "🍂 Northern spring/autumn, moderate radiation",
        seasonSouthSummer: "☀️ Southern summer, long daylight, strong radiation",
        seasonSouthWinter: "❄️ Southern winter, short daylight, weak radiation",
        seasonSouthTransition: "🍂 Southern spring/autumn, moderate radiation",

        // Formula reference
        formulaTitle: "📐 Formula Reference",
        formulaSolarDeclination: "Solar Declination:",
        formulaHourAngle: "Hour Angle:",
        formulaDaylight: "Daylight Hours:",
        formulaTOA: "Daily Radiation (TOA):",
        formulaNetAbsorption: "Net Absorption:",
        formulaNote: "Notes:",
        formulaNoteItems: [
            "S₀ = 1367 W/m² (Solar constant)",
            "φ = Latitude, δ = Declination, ω = Hour angle, n = Day of year",
            "TOA = Top of Atmosphere",
            "k = Effective absorption factor, considering atmospheric scattering, cloud reflection, surface albedo, etc."
        ],

        // Footer
        footerText: "Based on simplified energy balance model | Data for reference only",
        footerCopyright: "© 2025 LatSolar",

        // Error messages
        errorLatitude: "Latitude must be between -90° and 90°",
        errorLongitude: "Longitude must be between -180° and 180°",
        errorCalculation: "Calculation error:",
        errorDMSFormat: "DMS format error, please use format: 35°30'00\"N",

        // Language toggle
        languageName: "English",
        switchLanguage: "中文"
    }
};

// 当前语言
let currentLanguage = 'zh';

/**
 * 初始化语言设置
 */
function initLanguage() {
    // 从 localStorage 读取保存的语言偏好
    const savedLang = localStorage.getItem('language');

    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
        currentLanguage = savedLang;
    } else {
        // 检测浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        currentLanguage = browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    return currentLanguage;
}

/**
 * 设置语言
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 */
function setLanguage(lang) {
    if (lang !== 'zh' && lang !== 'en') {
        console.error('Invalid language:', lang);
        return;
    }

    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
function getLanguage() {
    return currentLanguage;
}

/**
 * 获取翻译文本
 * @param {string} key - 翻译键
 * @returns {string} 翻译后的文本
 */
function t(key) {
    const text = translations[currentLanguage][key];
    if (text === undefined) {
        console.warn('Translation missing for key:', key);
        return key;
    }
    return text;
}

/**
 * 更新页面所有文本
 */
function updatePageLanguage() {
    // 更新页面标题
    document.title = t('pageTitle');

    // 更新 meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = t('metaDescription');
    }

    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = t(key);

        // 根据元素类型更新内容
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.hasAttribute('placeholder')) {
                element.placeholder = text;
            } else {
                element.value = text;
            }
        } else {
            element.textContent = text;
        }
    });

    // 更新语言切换按钮
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = t('switchLanguage');
    }

    // 触发自定义事件,通知其他模块语言已更改
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: currentLanguage }
    }));
}

/**
 * 切换语言
 */
function toggleLanguage() {
    const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
}
