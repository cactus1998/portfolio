// 等待 index.html 的 Loading 畫面結束（window load 後 #app 才會顯示）
export const whenAppLoaded = () =>
  new Promise((resolve) => {
    if (window.__appLoaded) {
      resolve();
      return;
    }
    window.addEventListener("app-loaded", () => resolve(), { once: true });
  });
