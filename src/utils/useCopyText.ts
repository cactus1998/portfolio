import { ref, onUnmounted } from 'vue';

const FEEDBACK_MS = 2000;

/**
 * 複製文字到剪貼簿，並在一段時間內標記為「已複製」供畫面顯示回饋。
 * 用於 Email：mailto 依賴訪客電腦的預設郵件程式，沒設定時只會開出空白分頁，
 * 直接複製比較可靠。
 */
export function useCopyText(text: string) {
  const copied = ref(false);
  let timer: number | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 剪貼簿 API 不可用（非 HTTPS 或權限被拒）時，退回 mailto
      window.location.href = `mailto:${text}`;
      return;
    }
    copied.value = true;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => (copied.value = false), FEEDBACK_MS);
  }

  onUnmounted(() => window.clearTimeout(timer));

  return { copied, copy };
}
