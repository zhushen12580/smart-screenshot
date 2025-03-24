// 精准截图弹出窗口脚本
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const startScreenshotBtn = document.getElementById('start-screenshot');
  const ratioSelect = document.getElementById('ratio-select');
  const saveFormatSelect = document.getElementById('save-format');
  const imageQualitySelect = document.getElementById('image-quality');
  const titleLink = document.getElementById('title-link');
  
  // 默认比例
  let selectedRatio = ratioSelect ? ratioSelect.value : '16:9';
  
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
  
  // 加载上次使用的设置
  loadSettings();
  
  // 开始截图按钮点击事件
  startScreenshotBtn.addEventListener('click', function() {
    // 禁用按钮防止重复点击
    startScreenshotBtn.disabled = true;
    startScreenshotBtn.textContent = "截图中...";
    
    // 获取图片质量
    const imageQuality = parseFloat(imageQualitySelect.value) || 1.0;
    
    // 准备截图选项
    const screenshotOptions = {
      ratio: selectedRatio,
      saveFormat: saveFormatSelect ? saveFormatSelect.value : 'png',
      imageQuality: imageQuality
    };
    
    // 保存当前设置
    saveSettings(screenshotOptions);
    
    // 同时也保存最近使用的比例
    chrome.storage.sync.set({ lastUsedRatio: selectedRatio });
    
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
    chrome.storage.sync.get(['ratio', 'saveFormat', 'imageQuality'], function(data) {
      // 设置比例
      if (data.ratio && ratioSelect) {
        ratioSelect.value = data.ratio;
        selectedRatio = data.ratio;
      }
      
      // 设置保存格式
      if (data.saveFormat && saveFormatSelect) {
        saveFormatSelect.value = data.saveFormat;
      }
      
      // 设置图片质量
      if (data.imageQuality && imageQualitySelect) {
        imageQualitySelect.value = data.imageQuality.toString();
      }
    });
  }
  
  // 保存设置
  function saveSettings(options) {
    chrome.storage.sync.set({
      ratio: options.ratio,
      saveFormat: options.saveFormat,
      imageQuality: options.imageQuality
    });
  }
}); 