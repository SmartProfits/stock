/* ==========================================================================
   启动引导：jsPDF 兼容 + Service Worker 注册与更新
   ========================================================================== */
window.addEventListener('load', function () {
  // 确保 jsPDF 全局可用
  window.jspdf = window.jspdf || {};
  if (typeof window.jsPDF !== 'undefined') {
    window.jspdf.jsPDF = window.jsPDF;
  }

  // 注册 Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(function (registration) {
        console.log('Service Worker 注册成功，范围：', registration.scope);

        // 每次启动主动检查一次更新：手机上 PWA 常驻后台，
        // 不主动 update() 可能几天都拿不到新版界面（看不到新加的按钮）。
        registration.update();

        // 发现新版本就绪：自动接管，并在下次进入页面时生效
        registration.addEventListener('updatefound', function () {
          var installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', function () {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('检测到新版本，界面资源已更新');
            }
          });
        });
      })
      .catch(function (error) {
        console.log('Service Worker 注册失败：', error);
      });

    // 页面回到前台时再检查一次（手机切回 App 的典型场景）
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistration().then(function (reg) {
          if (reg) reg.update();
        });
      }
    });
  }
});
