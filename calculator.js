/**
 * 太阳辐射计算引擎
 * 基于简化的能量收支模型
 */

// 物理常数
const SOLAR_CONSTANT = 1367; // 太阳常数 W/m²
const ABSORPTION_FACTOR = 0.55; // 有效吸收因子 k

/**
 * 计算一年中的第几天 (1-365/366)
 * @param {Date} date - 日期对象
 * @returns {number} 日序数
 */
function calculateDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * 将角度转换为弧度
 * @param {number} degrees - 角度
 * @returns {number} 弧度
 */
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * 将弧度转换为角度
 * @param {number} radians - 弧度
 * @returns {number} 角度
 */
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

/**
 * 计算太阳赤纬角 (δ)
 * 公式: δ = 23.45° × sin(360° × (284 + n) / 365)
 * @param {number} dayOfYear - 日序数 (1-365)
 * @returns {number} 赤纬角(度)
 */
function calculateSolarDeclination(dayOfYear) {
    const angle = 360 * (284 + dayOfYear) / 365;
    return 23.45 * Math.sin(toRadians(angle));
}

/**
 * 计算日出/日落时角 (ω)
 * 公式: cos(ω) = -tan(φ) × tan(δ)
 * @param {number} latitude - 纬度(度)
 * @param {number} declination - 赤纬角(度)
 * @returns {number|null} 时角(弧度),如果极昼/极夜返回null
 */
function calculateHourAngle(latitude, declination) {
    const latRad = toRadians(latitude);
    const decRad = toRadians(declination);

    const cosOmega = -Math.tan(latRad) * Math.tan(decRad);

    // 检查极昼/极夜情况
    if (cosOmega > 1) {
        return 0; // 极夜,无日照
    }
    if (cosOmega < -1) {
        return Math.PI; // 极昼,24小时日照
    }

    return Math.acos(cosOmega);
}

/**
 * 计算日照时长(小时)
 * @param {number} hourAngle - 时角(弧度)
 * @returns {number} 日照时长(小时)
 */
function calculateDaylight(hourAngle) {
    return (2 * hourAngle * 24) / (2 * Math.PI);
}

/**
 * 计算日地距离修正因子
 * @param {number} dayOfYear - 日序数
 * @returns {number} 修正因子
 */
function calculateDistanceCorrection(dayOfYear) {
    return 1 + 0.033 * Math.cos(toRadians(360 * dayOfYear / 365));
}

/**
 * 计算日总太阳辐射 (TOA - Top of Atmosphere)
 * 公式: H = (S₀/π) × (1 + 0.033cos(360n/365)) × [ω×sin(φ)sin(δ) + cos(φ)cos(δ)sin(ω)]
 * @param {number} latitude - 纬度(度)
 * @param {number} dayOfYear - 日序数
 * @returns {Object} 包含各种计算结果的对象
 */
function calculateDailyRadiation(latitude, dayOfYear) {
    const declination = calculateSolarDeclination(dayOfYear);
    const hourAngle = calculateHourAngle(latitude, declination);

    // 如果是极夜
    if (hourAngle === 0) {
        return {
            declination: declination,
            hourAngle: 0,
            daylight: 0,
            toaRadiation: 0,
            netAbsorption: 0,
            isPolarNight: true,
            isPolarDay: false
        };
    }

    // 如果是极昼
    const isPolarDay = hourAngle === Math.PI;

    const latRad = toRadians(latitude);
    const decRad = toRadians(declination);
    const distCorrection = calculateDistanceCorrection(dayOfYear);

    // 计算日总辐射
    const term1 = hourAngle * Math.sin(latRad) * Math.sin(decRad);
    const term2 = Math.cos(latRad) * Math.cos(decRad) * Math.sin(hourAngle);

    const H = (SOLAR_CONSTANT / Math.PI) * distCorrection * (term1 + term2);

    // 计算净吸收
    const netAbsorption = H * ABSORPTION_FACTOR;

    // 计算日照时长
    const daylight = calculateDaylight(hourAngle);

    return {
        declination: declination,
        hourAngle: toDegrees(hourAngle),
        daylight: daylight,
        toaRadiation: H,
        netAbsorption: netAbsorption,
        isPolarNight: false,
        isPolarDay: isPolarDay
    };
}

/**
 * 主计算函数 - 供外部调用
 * @param {number} latitude - 纬度 (-90 到 90)
 * @param {number} longitude - 经度 (-180 到 180, 本模型中不使用)
 * @param {Date} date - 日期
 * @returns {Object} 完整的计算结果
 */
function calculateSolarRadiation(latitude, longitude, date) {
    const dayOfYear = calculateDayOfYear(date);
    const results = calculateDailyRadiation(latitude, dayOfYear);

    return {
        // 输入参数
        latitude: latitude,
        longitude: longitude,
        date: date,
        dayOfYear: dayOfYear,

        // 计算结果
        declination: results.declination,
        hourAngle: results.hourAngle,
        daylight: results.daylight,
        toaRadiation: results.toaRadiation,
        netAbsorption: results.netAbsorption,

        // 特殊情况标记
        isPolarNight: results.isPolarNight,
        isPolarDay: results.isPolarDay
    };
}

/**
 * 计算给定时间的太阳直射点位置 (用于3D地球光照)
 * @param {Date} date - 日期对象
 * @returns {Object} { lat, lon } 太阳直射点的经纬度
 */
function calculateSunPosition(date) {
    // 1. 计算赤纬 (直射纬度)
    // 简复用 calculateDayOfYear 逻辑
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // 简化的赤纬公式
    const declination = 23.45 * Math.sin(toRadians(360 / 365 * (284 + dayOfYear)));

    // 2. 计算直射经度
    // 太阳在中午12:00 (UTC) 直射本初子午线
    // 经度 = (12 - UTC时间) * 15
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
    let sunLon = (12 - utcHours) * 15;

    // 规范化到 -180 到 180
    if (sunLon > 180) sunLon -= 360;
    if (sunLon < -180) sunLon += 360;

    return {
        lat: declination,
        lon: sunLon
    };
}
