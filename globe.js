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
    // 使用半透明贴图：轻度纹理辅助定位，但整体以线框为主
    const translucentEarth = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

    // 初始化地球
    world = Globe()
        (globeContainer)
        .globeImageUrl(translucentEarth)
        .backgroundColor('#0a1020')
        .showAtmosphere(true) // 气辉用于轮廓
        .pointOfView({ lat: 35.6762, lng: 139.6503, altitude: 2.5 }, 1000);

    // 基础光照,确保在移动端也有立体感
    const scene = world.scene ? world.scene() : null;
    if (scene && window.THREE) {
        const ambientLight = new THREE.AmbientLight(0x0f172a, 0.85);
        scene.add(ambientLight);

        sunLight = new THREE.DirectionalLight(0xffd58a, 0.85);
        sunLight.position.set(1.5, 0.5, 0.8);
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
        color: '#ff9500',
        radius: 0.5,
        label: label || 'Location'
    }];

    // 更新标记环
    world
        .ringsData(markerData)
        .ringColor(() => '#ff9500')
        .ringMaxRadius(5)
        .ringPropagationSpeed(5)
        .ringRepeatPeriod(1000);

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
        // 退化到简单近似,避免依赖缺失导致崩溃
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

    const x = Math.cos(declinationRad) * Math.cos(lonRad);
    const y = Math.sin(declinationRad);
    const z = Math.cos(declinationRad) * Math.sin(lonRad);

    sunLight.position.set(x * 4, y * 4, z * 4);
    sunLight.lookAt(0, 0, 0);
}

// 暴露给其他脚本调用
window.focusGlobe = focusOnLocation;
window.updateSunPosition = updateSunPosition;
