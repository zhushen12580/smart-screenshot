// 精准截图弹出窗口脚本
import { getCurrentLanguage, getText, getRatioGroupLabel, getRatioOptionText, updateI18nTexts } from '../utils/i18n.js';

document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const startScreenshotBtn = document.getElementById('start-screenshot');
  const ratioSelect = document.getElementById('ratio-select');
  const saveFormatSelect = document.getElementById('save-format');
  const titleLink = document.getElementById('title-link');
  const normalModeBtn = document.getElementById('normal-mode');
  const inspectModeBtn = document.getElementById('inspect-mode');
  const shortcutKey = document.querySelector('[data-command="screenshot_start"]');
  const quickShareBtn = document.getElementById('quick-share');
  const quickFeedbackBtn = document.getElementById('quick-feedback');
  
  // 获取截图参数
  let selectedRatio = ratioSelect.value;
  let isInspectMode = false;
  
  // 监听模式切换
  normalModeBtn.addEventListener('click', function() {
    isInspectMode = false;
    normalModeBtn.classList.add('active');
    inspectModeBtn.classList.remove('active');
    ratioSelect.disabled = false;
    
    // 保存模式设置，以便快捷键可以使用正确的模式
    chrome.storage.sync.set({ isInspectMode: false });
  });
  
  inspectModeBtn.addEventListener('click', function() {
    isInspectMode = true;
    inspectModeBtn.classList.add('active');
    normalModeBtn.classList.remove('active');
    ratioSelect.value = 'free';
    ratioSelect.disabled = true;
    
    // 保存模式设置，以便快捷键可以使用正确的模式
    chrome.storage.sync.set({ isInspectMode: true });
  });
  
  // 监听比例选择改变
  if (ratioSelect) {
    ratioSelect.addEventListener('change', function() {
      selectedRatio = this.value;
    });
  }
  
  // 添加标题链接点击事件
  if (titleLink) {
    titleLink.addEventListener('click', function(e) {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://puzzledu.com/' });
    });
  }
  
  // 一键分享按钮点击事件
  if (quickShareBtn) {
    quickShareBtn.addEventListener('click', function() {
      // 准备要分享的介绍文字
      const introText = 
        "🔍 精准截图 | 高效智能的屏幕截图工具\n\n" +
        "✨ 特色功能：\n" +
        "✅ 支持多种屏幕比例，适合社交媒体分享\n" +
        "✅ 智能模式自动识别界面元素边缘\n" +
        "✅ 一键截取、复制、保存，操作便捷\n" +
        "✅ 高清无损截图，还原真实画面效果\n\n" +
        "👉 立即下载体验：https://puzzledu.com/shot";
      
      // 复制到剪贴板
      navigator.clipboard.writeText(introText)
        .then(() => {
          // 显示成功通知
          showNotification(getText('quickActions_shareSuccess'));
        })
        .catch(err => {
          // 复制失败时的处理
          console.error('复制失败:', err);
          showNotification(getText('quickActions_shareFailed'));
        });
    });
  }
  
  // 问题反馈按钮点击事件
  if (quickFeedbackBtn) {
    quickFeedbackBtn.addEventListener('click', function() {
      // 打开反馈页面
      chrome.tabs.create({ url: 'https://tally.so/r/mZe4go' });
    });
  }
  
  // 显示通知提示
  function showNotification(message) {
    // 检查是否已存在通知，如果有则移除
    const existingNotification = document.querySelector('.popup-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = 'popup-notification';
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加样式
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      z-index: 9999;
    `;
    
    // 淡入
    notification.animate([
      { opacity: 0, transform: 'translate(-50%, 20px)' },
      { opacity: 1, transform: 'translate(-50%, 0)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
    
    // 3秒后淡出
    setTimeout(() => {
      notification.animate([
        { opacity: 1, transform: 'translate(-50%, 0)' },
        { opacity: 0, transform: 'translate(-50%, -10px)' }
      ], {
        duration: 300,
        easing: 'ease-in'
      }).onfinish = () => notification.remove();
    }, 3000);
  }
  
  // 加载上次使用的设置
  loadSettings();
  
  // 开始截图按钮点击事件
  startScreenshotBtn.addEventListener('click', function() {
    // 禁用按钮防止重复点击
    startScreenshotBtn.disabled = true;
    startScreenshotBtn.textContent = getText('capturing');
    
    // 准备截图选项
    const screenshotOptions = {
      ratio: selectedRatio,
      saveFormat: saveFormatSelect.value,
      imageQuality: 1.0,
      isInspectMode: isInspectMode
    };
    
    // 保存当前设置
    saveSettings(screenshotOptions);
    
    // 发送消息到background启动截图流程
    chrome.runtime.sendMessage({
      action: 'startScreenshot',
      options: screenshotOptions
    });
    
    // 自动关闭弹窗
    setTimeout(() => {
      window.close();
    }, 500);
  });
  
  // 加载设置
  function loadSettings() {
    chrome.storage.sync.get(['lastUsedRatio', 'saveFormat', 'imageQuality', 'isInspectMode'], function(data) {
      // 设置模式
      if (data.isInspectMode) {
        inspectModeBtn.click();
      }
      
      // 设置比例
      if (data.lastUsedRatio && ratioSelect && !data.isInspectMode) {
        ratioSelect.value = data.lastUsedRatio;
        selectedRatio = data.lastUsedRatio;
      }
      
      // 设置保存格式
      if (data.saveFormat && saveFormatSelect) {
        saveFormatSelect.value = data.saveFormat;
      }
      
      // 设置图片质量
      if (data.imageQuality) {
        // 这里不需要设置 imageQuality，因为我们在截图选项中直接使用固定值
      }
    });
  }
  
  // 保存设置
  function saveSettings(options) {
    chrome.storage.sync.set({
      lastUsedRatio: options.ratio,
      saveFormat: options.saveFormat,
      imageQuality: options.imageQuality,
      isInspectMode: options.isInspectMode
    });
  }

  // 初始化时更新所有文本
  updateI18nTexts();
}); 