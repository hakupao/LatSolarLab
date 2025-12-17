/**
 * 3D 地球可视化逻辑
 * 基于 Globe.gl 和 Three.js
 */

let world;
let globeContainer;
let sunLight;

document.addEventListener('DOMContentLoaded', function () {
    initGlobe();
});

function initGlobe() {
    globeContainer = document.getElementById('globe-container');
    if (!globeContainer || typeof Globe !== 'function') {
        return;
    }

    // 初始化地球
    world = Globe()
        (globeContainer)
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
        .backgroundColor('#000011') // 恢复深空蓝背景，避免全黑无法分辨
        .showAtmosphere(true)
        .atmosphereColor('#3a228a')
        .atmosphereAltitude(0.25)
        .pointOfView({ lat: 35.6762, lng: 139.6503, altitude: 2.5 }, 1000);

    // 加载地图数据
    // 使用 deck.gl 的稳定 CDN 源 (Natural Earth 110m)
    fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(countries => {
            world
                .hexPolygonsData(countries.features)
                .hexPolygonResolution(3)
                .hexPolygonMargin(0.3)
                .hexPolygonUseDots(true)
                .hexPolygonColor(() => {
                    // 随机亮色
                    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
                })
                .hexPolygonAltitude(0.01);
        })
        .catch(err => {
            console.error("Failed to load globe data:", err);
            // 失败时的回退：尝试加载 TopoJSON
            fallbackToTopoJSON();
        });

    function fallbackToTopoJSON() {
        console.log("Falling back to TopoJSON...");
        fetch('https://unpkg.com/world-atlas/countries-110m.json')
            .then(res => res.json())
            .then(landTopology => {
                const countries = topojson.feature(landTopology, landTopology.objects.countries).features;
                world.hexPolygonsData(countries)
                    .hexPolygonResolution(3)
                    .hexPolygonMargin(0.3)
                    .hexPolygonUseDots(true)
                    .hexPolygonColor(() => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`)
                    .hexPolygonAltitude(0.01);
            });
    }

    // 基础光照
    const scene = world.scene ? world.scene() : null;
    if (scene && window.THREE) {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
        sunLight.position.set(100, 10, 10);
        sunLight.userData.isSunLight = true;
        scene.add(sunLight);
    }

    // ===== 禁用交互 =====
    const controls = world.controls();
    if (controls) {
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.enablePan = false;
    }

    // 设置容器大小随窗口变化
    const resizeGlobe = () => {
        if (!globeContainer || !world) return;
        world.width(globeContainer.clientWidth);
        world.height(globeContainer.clientHeight);
    };

    window.addEventListener('resize', resizeGlobe);

    // 初始调整大小
    setTimeout(resizeGlobe, 100);

    // 初次设定太阳位置
    updateSunPosition(new Date());
}

/**
 * 将地球聚焦到指定位置
 * @param {number} lat - 纬度
 * @param {number} lon - 经度
 * @param {string} [label] - 标记文本
 */
function focusOnLocation(lat, lon, label) {
    if (!world) return;

    // 添加标记数据
    const markerData = [{
        lat: lat,
        lng: lon,
        color: '#ffdd00',
        radius: 0.5,
        label: label || 'Location'
    }];

    // 更新标记环
    world
        .ringsData(markerData)
        .ringColor(() => '#ffdd00')
        .ringMaxRadius(6)
        .ringPropagationSpeed(4)
        .ringRepeatPeriod(800);

    // 平滑飞行到目标位置
    world.pointOfView({
        lat: lat,
        lng: lon,
        altitude: 1.5
    }, 2000);
}

/**
 * 根据日期模拟太阳方向,用于光照效果
 * @param {Date} date
 */
function updateSunPosition(date = new Date()) {
    if (!sunLight) return;

    const toRadiansLocal = (degrees) => degrees * Math.PI / 180;
    let sunPosition;

    if (typeof calculateSunPosition === 'function') {
        sunPosition = calculateSunPosition(date);
    } else {
        // 退化到简单近似
        const start = Date.UTC(date.getUTCFullYear(), 0, 0);
        const diff = date.getTime() - start;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        const declination = 23.44 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
        const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
        const lon = ((12 - utcHours) * 15 + 180) % 360 - 180;
        sunPosition = { lat: declination, lon: lon };
    }

    const declinationRad = toRadiansLocal(sunPosition.lat);
    const lonRad = toRadiansLocal(sunPosition.lon);

    // 将球坐标转换为直角坐标，假设半径非常大
    const r = 100;
    const x = r * Math.cos(declinationRad) * Math.cos(lonRad);
    const y = r * Math.sin(declinationRad);
    const z = r * Math.cos(declinationRad) * Math.sin(lonRad);

    // 注意：Three.js 的坐标系 (x, y, z) 
    // Globe.gl 通常 y 轴向上？
    // 经纬度转换到 3D 坐标：
    // lat -> phi (与 y 轴夹角? 还是与 xz 平面夹角?) 
    // Globe.gl 内部转换: 
    // x = R * cos(lat) * sin(lng)
    // y = R * sin(lat)
    // z = R * cos(lat) * cos(lng)
    // 但是 ThreeJS 默认 Y 是上。
    // 计算光照位置不需要太精确对应物理，只要看起来对就行。
    // 之前的代码：
    // x = Math.cos(declinationRad) * Math.cos(lonRad);
    // y = Math.sin(declinationRad);
    // z = Math.cos(declinationRad) * Math.sin(lonRad);
    // 看起来像是 Z-up 或者 Y-up 混合了，要修正一下

    // 重新调整：让太阳位置更明显
    sunLight.position.set(x, y, -z);
    sunLight.lookAt(0, 0, 0);
}

// 暴露给其他脚本调用
window.focusGlobe = focusOnLocation;
window.updateSunPosition = updateSunPosition;
