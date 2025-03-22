// 简化版弹出窗口脚本
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const startScreenshotBtn = document.getElementById('start-screenshot');
  const ratioSelect = document.getElementById('ratio-select');
  const saveFormatSelect = document.getElementById('save-format');
  const imageQualitySelect = document.getElementById('image-quality');
  
  // 默认比例
  let selectedRatio = ratioSelect ? ratioSelect.value : '16:9';
  
  // 监听比例选择改变
  if (ratioSelect) {
    ratioSelect.addEventListener('change', function() {
      selectedRatio = this.value;
    });
  }
  
  // 开始截图按钮点击事件
  startScreenshotBtn.addEventListener('click', function() {
    // 禁用按钮防止重复点击
    startScreenshotBtn.disabled = true;
    startScreenshotBtn.textContent = "截图中...";
    
    // 获取图片质量
    const imageQuality = parseFloat(imageQualitySelect.value) || 0.95;
    
    // 准备截图选项
    const screenshotOptions = {
      ratio: selectedRatio,
      saveFormat: saveFormatSelect ? saveFormatSelect.value : 'png',
      imageQuality: imageQuality
    };
    
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
}); 