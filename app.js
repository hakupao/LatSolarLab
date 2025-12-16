/**
 * UI 交互逻辑
 */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 获取 DOM 元素
    const form = document.getElementById('calculator-form');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const dateInput = document.getElementById('date');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results');
    const errorMessage = document.getElementById('error-message');

    // 位置功能相关元素
    const citySearchInput = document.getElementById('city-search');
    const citySuggestions = document.getElementById('city-suggestions');
    const nearestCityText = document.getElementById('nearest-city-text');
    const formatToggle = document.getElementById('format-toggle');
    const formatText = document.getElementById('format-text');

    // 状态变量
    let isDMSFormat = false; // 当前是否为度分秒格式
    let currentLatDMS = null;
    let currentLonDMS = null;
    let currentMode = 'single'; // single, compare-loc, compare-date

    // 对比模式元素
    const modeOptions = document.querySelectorAll('.mode-option');
    const locationSection2 = document.getElementById('location-section-2');
    const dateSection2 = document.getElementById('date-section-2');

    // 第二个地点的输入元素
    const latitudeInput2 = document.getElementById('latitude-2');
    const longitudeInput2 = document.getElementById('longitude-2');
    const citySearchInput2 = document.getElementById('city-search-2');
    const citySuggestions2 = document.getElementById('city-suggestions-2');

    // 第二个日期输入
    const dateInput2 = document.getElementById('date-2');

    // ===== 语言初始化 =====
    initLanguage();
    updatePageLanguage();
    refreshCoordinateUI();

    // 语言切换按钮
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function () {
            toggleLanguage();
        });
    }

    // 监听语言变化事件,更新动态内容
    document.addEventListener('languageChanged', function (e) {
        refreshCoordinateUI();
        updateNearestCity();
    });

    // 设置默认日期为今天
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];

    // 设置默认坐标为横滨
    latitudeInput.value = '35.0';
    longitudeInput.value = '139.65';

    // 初始化时更新最近城市
    updateNearestCity();

    // ===== 模式切换逻辑 =====
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // 更新 UI 状态
            modeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // 更新当前模式
            currentMode = option.dataset.mode;
            updateFormVisibility();

            // 切换模式时隐藏结果和错误，避免混淆
            if (resultsSection) resultsSection.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
        });
    });

    function updateFormVisibility() {
        if (currentMode === 'single') {
            locationSection2.classList.add('hidden');
            dateSection2.classList.add('hidden');
            // 移除必填
            latitudeInput2.removeAttribute('required');
            longitudeInput2.removeAttribute('required');
            dateInput2.removeAttribute('required');
        } else if (currentMode === 'compare-loc') {
            locationSection2.classList.remove('hidden');
            dateSection2.classList.add('hidden');
            // 设置必填
            latitudeInput2.setAttribute('required', 'true');
            longitudeInput2.setAttribute('required', 'true');
            dateInput2.removeAttribute('required');
        } else if (currentMode === 'compare-date') {
            locationSection2.classList.add('hidden');
            dateSection2.classList.remove('hidden');
            // 设置必填
            latitudeInput2.removeAttribute('required');
            longitudeInput2.removeAttribute('required');
            dateInput2.setAttribute('required', 'true');

            // 默认设置第二个日期为明天
            if (!dateInput2.value) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateInput2.value = tomorrow.toISOString().split('T')[0];
            }
        }
    }

    function updateFormatToggleText() {
        if (!formatText) return;
        formatText.textContent = isDMSFormat ? t('formatToggleToDecimal') : t('formatToggleToDMS');
    }

    function updateCoordinateLabels() {
        const latLabel = document.querySelector('label[for="latitude"]');
        const lonLabel = document.querySelector('label[for="longitude"]');
        if (!latLabel || !lonLabel) return;

        if (isDMSFormat) {
            latLabel.textContent = t('latitudeDMS');
            lonLabel.textContent = t('longitudeDMS');
        } else {
            latLabel.textContent = `${t('latitude')} ${t('latitudeUnit')}`;
            lonLabel.textContent = `${t('longitude')} ${t('longitudeUnit')}`;
        }
    }

    function refreshCoordinateUI() {
        updateFormatToggleText();
        updateCoordinateLabels();
    }

    // 初始化第二个城市搜索逻辑 (复用现有逻辑的简化版)
    setupCitySearch(citySearchInput2, citySuggestions2, (city) => {
        latitudeInput2.value = city.lat.toFixed(4);
        longitudeInput2.value = city.lon.toFixed(4);
        citySearchInput2.value = `${city.name} (${city.nameEn})`;
        citySuggestions2.classList.remove('active');
    });

    // 表单提交事件
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateAndDisplay();
    });

    // 输入验证
    function validateInputs(lat, lon) {
        if (isNaN(lat) || lat < -90 || lat > 90) {
            return t('errorLatitude');
        }
        if (isNaN(lon) || lon < -180 || lon > 180) {
            return t('errorLongitude');
        }
        return null;
    }

    function parsePrimaryCoordinates() {
        if (isDMSFormat) {
            const lat = parseDMS(latitudeInput.value);
            const lon = parseDMS(longitudeInput.value);
            if (lat === null || lon === null) {
                return { error: t('errorDMSFormat') };
            }
            return { latitude: lat, longitude: lon };
        }

        return {
            latitude: parseFloat(latitudeInput.value),
            longitude: parseFloat(longitudeInput.value)
        };
    }

    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }

    // 计算并显示结果
    function calculateAndDisplay() {
        clearError();

        const { latitude, longitude, error: coordError } = parsePrimaryCoordinates();
        const dateValue = new Date(dateInput.value);

        if (coordError) return showError(coordError);

        const validationError = validateInputs(latitude, longitude);
        if (validationError) return showError(validationError);
        if (Number.isNaN(dateValue.getTime())) return showError(t('errorCalculation'));

        // 添加加载动画
        calculateBtn.textContent = t('calculating');
        calculateBtn.disabled = true;

        // 延迟一点以显示加载效果
        setTimeout(() => {
            try {
                // 根据模式执行计算
                if (currentMode === 'single') {
                    const result = calculateSolarRadiation(latitude, longitude, dateValue);

                    // 3D地球联动
                    if (window.focusGlobe) window.focusGlobe(latitude, longitude);
                    if (window.updateSunPosition) window.updateSunPosition(dateValue);

                    displayResults(result); // 单点显示
                } else if (currentMode === 'compare-loc') {
                    // 对比地点: 计算两组
                    const lat2 = parseFloat(latitudeInput2.value);
                    const lon2 = parseFloat(longitudeInput2.value);
                    const error2 = validateInputs(lat2, lon2);

                    if (error2) {
                        throw new Error(t('location2Label') + ": " + error2);
                    }

                    const result1 = calculateSolarRadiation(latitude, longitude, dateValue);
                    const result2 = calculateSolarRadiation(lat2, lon2, dateValue);

                    // 标题: 地点1 vs 地点2
                    const title1 = citySearchInput.value || `${latitude.toFixed(2)}°,${longitude.toFixed(2)}°`;
                    const title2 = citySearchInput2.value || `${lat2.toFixed(2)}°,${lon2.toFixed(2)}°`;

                    displayComparisonResults(result1, result2, title1, title2);
                } else if (currentMode === 'compare-date') {
                    // 对比日期: 计算两组
                    const dateValue2 = new Date(dateInput2.value);
                    if (Number.isNaN(dateValue2.getTime())) {
                        throw new Error(t('date2Label'));
                    }

                    const result1 = calculateSolarRadiation(latitude, longitude, dateValue);
                    const result2 = calculateSolarRadiation(latitude, longitude, dateValue2);

                    const dateStr1 = dateValue.toLocaleDateString();
                    const dateStr2 = dateValue2.toLocaleDateString();

                    displayComparisonResults(result1, result2, dateStr1, dateStr2);
                }

                // 显示结果区域
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } catch (err) {
                showError(t('errorCalculation') + ' ' + err.message);
            } finally {
                calculateBtn.textContent = t('calculate');
                calculateBtn.disabled = false;
            }
        }, 300);
    }

    // 显示错误信息
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        resultsSection.style.display = 'none';
    }

    // 显示计算结果 (单点模式)
    function displayResults(results) {
        const resultsCard = document.querySelector('#results .card');
        if (!resultsCard) return;

        // 格式化日期
        const locale = currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
        const dateStr = results.date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // 预处理数据
        const declinationText = `${results.declination.toFixed(2)}°`;

        let daylightText = `${results.daylight.toFixed(2)} ${t('hours')}`;
        if (results.isPolarNight) daylightText = `0 ${t('hours')} (${t('polarNight')})`;
        if (results.isPolarDay) daylightText = `24 ${t('hours')} (${t('polarDay')})`;

        const toaText = results.isPolarNight ? '0 W/m²' : `${results.toaRadiation.toFixed(2)} W/m²`;
        const netText = results.isPolarNight ? '0 W/m²' : `${results.netAbsorption.toFixed(2)} W/m²`;

        // 重建 HTML 结构
        resultsCard.innerHTML = `
            <h2 class="card-title" data-i18n="resultsTitle">${t('resultsTitle')}</h2>

            <div class="result-header">
                <div class="result-location">${t('latitude')} ${results.latitude.toFixed(2)}°, ${t('longitude')} ${results.longitude.toFixed(2)}°</div>
                <div class="result-date">${dateStr}</div>
            </div>

            <div class="results-grid">
                <div class="result-item">
                    <div class="result-label" data-i18n="dayOfYear">${t('dayOfYear')}</div>
                    <div class="result-value">${results.dayOfYear}</div>
                </div>

                <div class="result-item">
                    <div class="result-label" data-i18n="solarDeclination">${t('solarDeclination')}</div>
                    <div class="result-value">${declinationText}</div>
                </div>

                <div class="result-item">
                    <div class="result-label" data-i18n="daylightHours">${t('daylightHours')}</div>
                    <div class="result-value">${daylightText}</div>
                </div>

                <div class="result-item">
                    <div class="result-label" data-i18n="toaRadiation">${t('toaRadiation')}</div>
                    <div class="result-value highlight">${toaText}</div>
                </div>

                <div class="result-item">
                    <div class="result-label" data-i18n="netAbsorption">${t('netAbsorption')}</div>
                    <div class="result-value highlight">${netText}</div>
                </div>
            </div>

            <div class="seasonal-hint" id="seasonal-hint"></div>
        `;

        // 添加季节提示
        addSeasonalHint(results);
    }

    // 显示对比结果
    function displayComparisonResults(res1, res2, label1, label2) {
        // 直接获取卡片容器 (修复: 不要依赖子元素 .result-header)
        const resultsContainer = document.querySelector('#results .card');
        if (!resultsContainer) return;

        // 渲染对比 HTML
        resultsContainer.innerHTML = `
            <h2 class="card-title">${t('resultsTitle')} (Comparison)</h2>
            <div class="results-comparison-container">
                <!-- 列 1 -->
                <div class="comparison-column">
                    <div class="comparison-header">${label1}</div>
                    ${renderComparisonItem(res1, res2, 'daylight', t('daylightHours'), t('hours'))}
                    ${renderComparisonItem(res1, res2, 'toa', t('toaRadiation'), 'W/m²')}
                    ${renderComparisonItem(res1, res2, 'net', t('netAbsorption'), 'W/m²')}
                    
                    <div class="comparison-item" style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem;">
                        <div class="comparison-label">${t('solarDeclination')}</div>
                        <div class="comparison-value">${res1.declination.toFixed(2)}°</div>
                    </div>
                </div>

                <!-- 列 2 -->
                <div class="comparison-column">
                    <div class="comparison-header">${label2}</div>
                    ${renderComparisonItem(res2, res1, 'daylight', t('daylightHours'), t('hours'))}
                    ${renderComparisonItem(res2, res1, 'toa', t('toaRadiation'), 'W/m²')}
                    ${renderComparisonItem(res2, res1, 'net', t('netAbsorption'), 'W/m²')}
                    
                    <div class="comparison-item" style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem;">
                        <div class="comparison-label">${t('solarDeclination')}</div>
                        <div class="comparison-value">${res2.declination.toFixed(2)}°</div>
                    </div>
                </div>
            </div>
            
        `;
    }

    function renderComparisonItem(primary, secondary, type, label, unit) {
        let val1, val2;

        if (type === 'daylight') {
            val1 = primary.daylight;
            val2 = secondary.daylight;
        } else if (type === 'toa') {
            val1 = primary.toaRadiation;
            val2 = secondary.toaRadiation;
        } else {
            val1 = primary.netAbsorption;
            val2 = secondary.netAbsorption;
        }

        const diff = val1 - val2;
        const percent = val2 !== 0 ? (diff / val2) * 100 : null;
        let diffColor = diff > 0 ? '#30d158' : (diff < 0 ? '#ff453a' : '#888');
        let diffIcon = diff > 0 ? '▲' : (diff < 0 ? '▼' : '-');
        const percentText = percent === null ? '' : ` (${diff >= 0 ? '+' : '-'}${Math.abs(percent).toFixed(1)}%)`;

        return `
            <div class="comparison-item">
                <div class="comparison-label">${label}</div>
                <div class="comparison-value highlight">${val1.toFixed(2)} ${unit}</div>
                <div style="color: ${diffColor}; font-size: 0.8rem; margin-top: 0.2rem;">
                    ${diffIcon} ${Math.abs(diff).toFixed(2)}${percentText}
                </div>
            </div>
        `;
    }

    // 添加季节性提示
    function addSeasonalHint(results) {
        const hintElement = document.getElementById('seasonal-hint');
        if (!hintElement) return;

        let hint = '';
        const lat = results.latitude;
        const dec = results.declination;

        // 判断季节
        if (Math.abs(lat) < 23.45) {
            // 热带地区
            hint = t('seasonTropical');
        } else if (lat > 0) {
            // 北半球
            if (dec > 15) {
                hint = t('seasonNorthSummer');
            } else if (dec < -15) {
                hint = t('seasonNorthWinter');
            } else {
                hint = t('seasonNorthTransition');
            }
        } else {
            // 南半球
            if (dec > 15) {
                hint = t('seasonSouthWinter');
            } else if (dec < -15) {
                hint = t('seasonSouthSummer');
            } else {
                hint = t('seasonSouthTransition');
            }
        }

        hintElement.textContent = hint;
    }

    // 添加快速示例按钮功能
    const exampleButtons = document.querySelectorAll('.example-btn');
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const lat = parseFloat(this.dataset.lat);
            const lon = parseFloat(this.dataset.lon);
            const date = this.dataset.date;

            if (isDMSFormat) {
                latitudeInput.value = convertToDMS(lat, true);
                longitudeInput.value = convertToDMS(lon, false);
            } else {
                latitudeInput.value = lat;
                longitudeInput.value = lon;
            }
            if (date) {
                dateInput.value = date;
            }

            // 3D地球联动
            if (window.focusGlobe) {
                const label = this.textContent.trim();
                window.focusGlobe(lat, lon, label);
            }

            // 自动计算
            calculateAndDisplay();
        });
    });

    // ===== 位置功能 =====

    // 封装搜索逻辑为通用函数
    function setupCitySearch(inputElement, suggestionsElement, onSelectCallback) {
        let timeout;

        inputElement.addEventListener('input', function () {
            const query = this.value.trim();

            if (timeout) clearTimeout(timeout);

            if (query.length === 0) {
                suggestionsElement.classList.remove('active');
                suggestionsElement.innerHTML = '';
                return;
            }

            // 设置防抖
            timeout = setTimeout(async function () {
                suggestionsElement.innerHTML = `<div class="suggestion-loading">${t('searching')}</div>`;
                suggestionsElement.classList.add('active');

                try {
                    const results = await searchCitiesHybrid(query);

                    if (results.length === 0) {
                        suggestionsElement.innerHTML = `<div class="suggestion-loading">${t('noResults')}</div>`;
                        setTimeout(() => {
                            if (suggestionsElement.innerHTML.includes(t('noResults'))) {
                                suggestionsElement.classList.remove('active');
                            }
                        }, 3000);
                        return;
                    }

                    suggestionsElement.innerHTML = '';
                    results.forEach(city => {
                        const item = document.createElement('div');
                        item.className = 'suggestion-item';

                        const sourceTag = city.source === 'google' ? ` <span class="badge-source">${t('sourceGoogle')}</span>` :
                            (city.source === 'nominatim' ? ` <span class="badge-source">${t('sourceOSM')}</span>` : '');

                        item.innerHTML = `
                            <div class="suggestion-city-name">${city.name} / ${city.nameEn}${sourceTag}</div>
                            <div class="suggestion-city-info">${city.country} · ${city.lat.toFixed(2)}°, ${city.lon.toFixed(2)}°</div>
                        `;

                        item.addEventListener('click', function () {
                            onSelectCallback(city);
                        });

                        suggestionsElement.appendChild(item);
                    });
                } catch (error) {
                    console.error('Search error:', error);
                    suggestionsElement.innerHTML = `<div class="suggestion-loading error">${t('errorPrefix')}${error.message}</div>`;
                }
            }, 500);
        });

        // 点击外部关闭
        document.addEventListener('click', function (e) {
            if (!inputElement.contains(e.target) && !suggestionsElement.contains(e.target)) {
                suggestionsElement.classList.remove('active');
            }
        });
    }

    // 初始化主搜索框
    setupCitySearch(citySearchInput, citySuggestions, (city) => {
        selectCity(city);
    });

    // 选择城市
    function selectCity(city) {
        // 填充坐标
        if (isDMSFormat) {
            // 如果当前是DMS格式,先切换回十进制
            toggleCoordinateFormat();
        }

        latitudeInput.value = city.lat.toFixed(4);
        longitudeInput.value = city.lon.toFixed(4);

        // 更新城市搜索框
        citySearchInput.value = `${city.name} (${city.nameEn})`;

        // 关闭建议列表
        citySuggestions.classList.remove('active');

        // 更新最近城市显示
        updateNearestCity();

        // 3D地球联动
        if (window.focusGlobe) {
            window.focusGlobe(city.lat, city.lon, city.name);
        }

        // 可选: 自动计算
        // calculateAndDisplay();
    }

    // 坐标输入变化时更新最近城市
    latitudeInput.addEventListener('input', updateNearestCity);
    longitudeInput.addEventListener('input', updateNearestCity);

    // 更新最近城市显示
    function updateNearestCity() {
        const lat = isDMSFormat ? parseDMS(latitudeInput.value) : parseFloat(latitudeInput.value);
        const lon = isDMSFormat ? parseDMS(longitudeInput.value) : parseFloat(longitudeInput.value);

        if (lat === null || lon === null || Number.isNaN(lat) || Number.isNaN(lon)) {
            nearestCityText.textContent = t('nearestCity');
            return;
        }

        const result = findNearestCity(lat, lon);
        if (result && result.city) {
            const distanceStr = formatDistance(result.distance);
            nearestCityText.textContent = `${result.city.name} (${result.city.nameEn}) - ${distanceStr}`;
        } else {
            nearestCityText.textContent = t('nearestCity');
        }
    }

    // 格式切换按钮
    formatToggle.addEventListener('click', function () {
        toggleCoordinateFormat();
    });

    // 切换坐标格式
    function toggleCoordinateFormat() {
        if (isDMSFormat) {
            // DMS → 十进制
            const converted = convertDMSToDecimal();
            if (!converted) return;
            isDMSFormat = false;
        } else {
            // 十进制 → DMS
            const converted = convertDecimalToDMS();
            if (!converted) return;
            isDMSFormat = true;
        }

        refreshCoordinateUI();
        updateNearestCity();
    }

    // 十进制 → DMS
    function convertDecimalToDMS() {
        const lat = parseFloat(latitudeInput.value);
        const lon = parseFloat(longitudeInput.value);

        if (isNaN(lat) || isNaN(lon)) {
            return false;
        }

        // 保存当前十进制值
        currentLatDMS = lat;
        currentLonDMS = lon;

        // 转换并显示
        const latDMS = convertToDMS(lat, true);
        const lonDMS = convertToDMS(lon, false);

        // 修改输入框类型和属性
        latitudeInput.type = 'text';
        longitudeInput.type = 'text';
        latitudeInput.removeAttribute('step');
        longitudeInput.removeAttribute('step');
        latitudeInput.removeAttribute('min');
        longitudeInput.removeAttribute('min');
        latitudeInput.removeAttribute('max');
        longitudeInput.removeAttribute('max');

        latitudeInput.value = latDMS;
        longitudeInput.value = lonDMS;
        return true;
    }

    // DMS → 十进制
    function convertDMSToDecimal() {
        let latDecimal = parseDMS(latitudeInput.value);
        let lonDecimal = parseDMS(longitudeInput.value);

        // 如果当前输入无法解析,回退到最近一次保存的十进制值
        if (latDecimal === null || lonDecimal === null) {
            if (currentLatDMS === null || currentLonDMS === null) {
                return false;
            }
            latDecimal = currentLatDMS;
            lonDecimal = currentLonDMS;
        } else {
            currentLatDMS = latDecimal;
            currentLonDMS = lonDecimal;
        }

        latitudeInput.type = 'number';
        longitudeInput.type = 'number';
        latitudeInput.setAttribute('step', '0.0001');
        longitudeInput.setAttribute('step', '0.0001');
        latitudeInput.setAttribute('min', '-90');
        longitudeInput.setAttribute('min', '-180');
        latitudeInput.setAttribute('max', '90');
        longitudeInput.setAttribute('max', '180');

        latitudeInput.value = latDecimal.toFixed(4);
        longitudeInput.value = lonDecimal.toFixed(4);
        return true;
    }
});
