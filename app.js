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

    // ===== 语言初始化 =====
    // 初始化语言设置
    const initialLang = initLanguage();
    updatePageLanguage();

    // 语言切换按钮
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function () {
            toggleLanguage();
        });
    }

    // 监听语言变化事件,更新动态内容
    document.addEventListener('languageChanged', function (e) {
        // 更新格式切换按钮文本
        if (isDMSFormat) {
            formatText.textContent = t('formatToggleToDecimal');
        } else {
            formatText.textContent = t('formatToggleToDMS');
        }

        // 更新最近城市显示
        updateNearestCity();

        // 更新标签
        const latLabel = document.querySelector('label[for="latitude"]');
        const lonLabel = document.querySelector('label[for="longitude"]');
        if (latLabel && lonLabel) {
            if (isDMSFormat) {
                latLabel.textContent = t('latitudeDMS');
                lonLabel.textContent = t('longitudeDMS');
            } else {
                latLabel.textContent = t('latitude') + ' ' + t('latitudeUnit');
                lonLabel.textContent = t('longitude') + ' ' + t('longitudeUnit');
            }
        }
    });

    // 设置默认日期为今天
    const today = new Date();
    dateInput.value = today.toISOString().split('T')[0];

    // 设置默认坐标为横滨
    latitudeInput.value = '35.0';
    longitudeInput.value = '139.65';

    // 初始化时更新最近城市
    updateNearestCity();

    // 表单提交事件
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateAndDisplay();
    });

    // 输入验证
    function validateInputs(lat, lon) {
        if (isNaN(lat) || lat < -90 || lat > 90) {
            return '纬度必须在 -90° 到 90° 之间';
        }
        if (isNaN(lon) || lon < -180 || lon > 180) {
            return '经度必须在 -180° 到 180° 之间';
        }
        return null;
    }

    // 计算并显示结果
    function calculateAndDisplay() {
        // 清除之前的错误信息
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';

        // 获取输入值
        const latitude = parseFloat(latitudeInput.value);
        const longitude = parseFloat(longitudeInput.value);
        const dateValue = new Date(dateInput.value);

        // 验证输入
        const error = validateInputs(latitude, longitude);
        if (error) {
            showError(error);
            return;
        }

        // 添加加载动画
        calculateBtn.textContent = '计算中...';
        calculateBtn.disabled = true;

        // 延迟一点以显示加载效果
        setTimeout(() => {
            try {
                // 执行计算
                const result = calculateSolarRadiation(latitude, longitude, dateValue);

                // 3D地球联动
                if (window.focusGlobe) {
                    window.focusGlobe(latitude, longitude);
                }

                // 更新太阳光照位置
                if (window.updateSunPosition) {
                    window.updateSunPosition(dateValue);
                }

                // 显示结果
                displayResults(result);

                // 显示结果区域
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } catch (err) {
                showError('计算出错: ' + err.message);
            } finally {
                calculateBtn.textContent = '计算';
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

    // 显示计算结果
    function displayResults(results) {
        // 格式化日期
        const dateStr = results.date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // 更新结果显示
        document.getElementById('result-location').textContent =
            `纬度 ${results.latitude.toFixed(2)}°, 经度 ${results.longitude.toFixed(2)}°`;
        document.getElementById('result-date').textContent = dateStr;
        document.getElementById('result-day').textContent = results.dayOfYear;

        // 检查特殊情况
        if (results.isPolarNight) {
            document.getElementById('result-declination').textContent =
                `${results.declination.toFixed(2)}°`;
            document.getElementById('result-daylight').textContent = '0 小时 (极夜)';
            document.getElementById('result-toa').textContent = '0 W/m²';
            document.getElementById('result-net').textContent = '0 W/m²';
            return;
        }

        if (results.isPolarDay) {
            document.getElementById('result-declination').textContent =
                `${results.declination.toFixed(2)}°`;
            document.getElementById('result-daylight').textContent = '24 小时 (极昼)';
        } else {
            document.getElementById('result-declination').textContent =
                `${results.declination.toFixed(2)}°`;
            document.getElementById('result-daylight').textContent =
                `${results.daylight.toFixed(2)} 小时`;
        }

        document.getElementById('result-toa').textContent =
            `${results.toaRadiation.toFixed(2)} W/m²`;
        document.getElementById('result-net').textContent =
            `${results.netAbsorption.toFixed(2)} W/m²`;

        // 添加季节提示
        addSeasonalHint(results);
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
            hint = '🌴 热带地区,全年接收较高的太阳辐射';
        } else if (lat > 0) {
            // 北半球
            if (dec > 15) {
                hint = '☀️ 北半球夏季,日照时间长,辐射强';
            } else if (dec < -15) {
                hint = '❄️ 北半球冬季,日照时间短,辐射弱';
            } else {
                hint = '🍂 北半球春秋季,辐射适中';
            }
        } else {
            // 南半球
            if (dec > 15) {
                hint = '❄️ 南半球冬季,日照时间短,辐射弱';
            } else if (dec < -15) {
                hint = '☀️ 南半球夏季,日照时间长,辐射强';
            } else {
                hint = '🍂 南半球春秋季,辐射适中';
            }
        }

        hintElement.textContent = hint;
    }

    // 添加快速示例按钮功能
    const exampleButtons = document.querySelectorAll('.example-btn');
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const lat = this.dataset.lat;
            const lon = this.dataset.lon;
            const date = this.dataset.date;

            latitudeInput.value = lat;
            longitudeInput.value = lon;
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

    // 城市搜索输入事件 (带防抖)
    let searchTimeout;
    citySearchInput.addEventListener('input', function () {
        const query = this.value.trim();

        // 清除之前的定时器
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        if (query.length === 0) {
            citySuggestions.classList.remove('active');
            citySuggestions.innerHTML = '';
            return;
        }

        // 设置防抖,延迟 500ms 执行搜索
        searchTimeout = setTimeout(async function () {
            // 显示加载状态
            citySuggestions.innerHTML = '<div class="suggestion-loading">Searching...</div>';
            citySuggestions.classList.add('active');

            try {
                // 使用混合搜索 (本地 + API)
                const results = await searchCitiesHybrid(query);

                if (results.length === 0) {
                    citySuggestions.innerHTML = '<div class="suggestion-loading">No results found</div>';
                    // 3秒后隐藏
                    setTimeout(() => {
                        if (citySuggestions.innerHTML.includes('No results')) {
                            citySuggestions.classList.remove('active');
                        }
                    }, 3000);
                    return;
                }

                // 显示建议列表
                citySuggestions.innerHTML = '';
                results.forEach(city => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';

                    // 标记来源
                    const sourceTag = city.source === 'google' ? ' <span class="badge-source">Google</span>' :
                        (city.source === 'nominatim' ? ' <span class="badge-source">OSM</span>' : '');

                    item.innerHTML = `
                        <div class="suggestion-city-name">${city.name} / ${city.nameEn}${sourceTag}</div>
                        <div class="suggestion-city-info">${city.country} · ${city.lat.toFixed(2)}°, ${city.lon.toFixed(2)}°</div>
                    `;

                    item.addEventListener('click', function () {
                        selectCity(city);
                    });

                    citySuggestions.appendChild(item);
                });
            } catch (error) {
                console.error('Search error:', error);
                citySuggestions.innerHTML = `<div class="suggestion-loading error">Error: ${error.message}</div>`;
            }
        }, 500); // 500ms 延迟
    });

    // 点击外部关闭建议列表
    document.addEventListener('click', function (e) {
        if (!citySearchInput.contains(e.target) && !citySuggestions.contains(e.target)) {
            citySuggestions.classList.remove('active');
        }
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
        const lat = parseFloat(latitudeInput.value);
        const lon = parseFloat(longitudeInput.value);

        if (isNaN(lat) || isNaN(lon)) {
            nearestCityText.textContent = '输入坐标后显示最近城市';
            return;
        }

        const result = findNearestCity(lat, lon);
        if (result && result.city) {
            const distanceStr = formatDistance(result.distance);
            nearestCityText.textContent = `${result.city.name} (${result.city.nameEn}) - ${distanceStr}`;
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
            convertDMSToDecimal();
            formatText.textContent = '切换为度分秒';
            isDMSFormat = false;

            // 更新标签显示当前格式
            document.querySelector('label[for="latitude"]').textContent = '纬度 (°)';
            document.querySelector('label[for="longitude"]').textContent = '经度 (°)';
        } else {
            // 十进制 → DMS
            convertDecimalToDMS();
            formatText.textContent = '切换为十进制';
            isDMSFormat = true;

            // 更新标签显示当前格式
            document.querySelector('label[for="latitude"]').textContent = '纬度 (DMS)';
            document.querySelector('label[for="longitude"]').textContent = '经度 (DMS)';
        }
    }

    // 十进制 → DMS
    function convertDecimalToDMS() {
        const lat = parseFloat(latitudeInput.value);
        const lon = parseFloat(longitudeInput.value);

        if (isNaN(lat) || isNaN(lon)) {
            return;
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
    }

    // DMS → 十进制
    function convertDMSToDecimal() {
        // 恢复保存的十进制值
        if (currentLatDMS !== null && currentLonDMS !== null) {
            // 先恢复输入框类型和属性
            latitudeInput.type = 'number';
            longitudeInput.type = 'number';
            latitudeInput.setAttribute('step', '0.0001');
            longitudeInput.setAttribute('step', '0.0001');
            latitudeInput.setAttribute('min', '-90');
            longitudeInput.setAttribute('min', '-180');
            latitudeInput.setAttribute('max', '90');
            longitudeInput.setAttribute('max', '180');

            // 再设置值
            latitudeInput.value = currentLatDMS.toFixed(4);
            longitudeInput.value = currentLonDMS.toFixed(4);
        }
    }

    // 重写计算函数以支持DMS格式
    const originalCalculateAndDisplay = calculateAndDisplay;
    calculateAndDisplay = function () {
        // 如果是DMS格式,先转换为十进制
        if (isDMSFormat) {
            const latDMS = latitudeInput.value;
            const lonDMS = longitudeInput.value;

            const lat = parseDMS(latDMS);
            const lon = parseDMS(lonDMS);

            if (lat === null || lon === null) {
                showError('DMS格式错误,请使用格式: 35°30\'00"N');
                return;
            }

            // 临时保存DMS值
            const tempLatDMS = latDMS;
            const tempLonDMS = lonDMS;

            // 临时切换为十进制进行计算
            latitudeInput.type = 'number';
            longitudeInput.type = 'number';
            latitudeInput.value = lat;
            longitudeInput.value = lon;

            // 执行计算
            originalCalculateAndDisplay();

            // 恢复DMS显示
            latitudeInput.type = 'text';
            longitudeInput.type = 'text';
            latitudeInput.value = tempLatDMS;
            longitudeInput.value = tempLonDMS;
        } else {
            originalCalculateAndDisplay();
        }
    };
});
