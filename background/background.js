// 简化版后台脚本 - 只保留核心功能
console.log("精准截图扩展启动");

// 默认设置
const DEFAULT_SETTINGS = {
  ratio: "16:9",
  saveFormat: "png",
  imageQuality: 1.0
};

// 监听键盘命令
chrome.commands.onCommand.addListener((command) => {
  console.log("收到键盘命令:", command);
  
  // 处理开始截图快捷键
  if (command === 'screenshot_start') {
    console.log("触发开始截图快捷键");
    
    // 从存储中获取最近使用的比例和其他设置
    chrome.storage.sync.get(['lastUsedRatio', 'saveFormat', 'imageQuality'], (data) => {
      // 使用最近一次使用的比例，如果没有则使用16:9作为默认值
      const ratio = data.lastUsedRatio || "16:9";
      
      const screenshotOptions = {
        ratio: ratio,
        saveFormat: data.saveFormat || DEFAULT_SETTINGS.saveFormat,
        imageQuality: data.imageQuality || DEFAULT_SETTINGS.imageQuality
      };
      
      console.log("开始截图选项:", screenshotOptions);
      
      // 启动截图流程
      startScreenshotProcess(screenshotOptions);
    });
  }
  // 处理确认截图快捷键
  else if (command === 'screenshot_confirm') {
    console.log("触发确认截图快捷键");
    
    // 向当前活动标签页发送确认命令
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) return;
      
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'screenshotConfirm'
      }).catch(error => {
        console.log("发送确认命令失败，可能截图模式未启动:", error);
      });
    });
  }
  // 处理取消截图快捷键
  else if (command === 'screenshot_cancel') {
    console.log("触发取消截图快捷键");
    
    // 向当前活动标签页发送取消命令
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) return;
      
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'screenshotCancel'
      }).catch(error => {
        console.log("发送取消命令失败，可能截图模式未启动:", error);
      });
    });
  }
  // 处理默认的扩展图标快捷键 - 这里不再执行任何操作，默认会显示弹出窗口
  else if (command === '_execute_action') {
    console.log("触发默认扩展图标快捷键 - 打开弹出窗口");
  }
});

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("收到消息:", message.action);
  
  // 处理开始截图命令
  if (message.action === 'startScreenshot') {
    sendResponse({ success: true });
    
    // 保存当前设置到存储中
    if (message.options) {
      chrome.storage.sync.set({
        ratio: message.options.ratio || DEFAULT_SETTINGS.ratio,
        saveFormat: message.options.saveFormat || DEFAULT_SETTINGS.saveFormat,
        imageQuality: message.options.imageQuality || DEFAULT_SETTINGS.imageQuality
      });
    }
    
    // 启动截图流程，直接使用消息中的选项
    startScreenshotProcess(message.options || {});
  }
  
  // 处理屏幕捕获命令
  else if (message.action === 'captureScreen') {
    captureScreen(sendResponse);
  }
  
  // 处理全页面捕获命令（新增）
  else if (message.action === 'captureFullPage') {
    captureFullPage(message, sender.tab.id, sendResponse);
  }
  
  // 处理保存截图命令
  else if (message.action === 'saveScreenshot') {
    saveScreenshot(message, sendResponse);
  }
  
  return true;
});

// 启动截图流程的统一函数
function startScreenshotProcess(options) {
  // 获取当前标签页并注入内容脚本
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) return;
    const tab = tabs[0];
    
    // 检查是否是有效页面
    if (!tab.url || tab.url.startsWith('chrome://') || 
        tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      console.log("无法在浏览器内部页面上使用");
      return;
    }
    
    // 注入内容脚本
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/content.js']
    }).then(() => {
      // 发送截图命令
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'initiateScreenshot',
          options: options
        });
      }, 100);
    }).catch(error => {
      console.error("内容脚本注入失败", error);
    });
  });
}

// 捕获当前屏幕内容
function captureScreen(sendResponse) {
  try {
    console.log("准备捕获屏幕...");
    
    // 使用更可靠的截图设置
    const screenshotOptions = { 
      format: 'png', 
      quality: 100 
    };
    
    chrome.tabs.captureVisibleTab(null, screenshotOptions, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("截图失败:", chrome.runtime.lastError);
        sendResponse({ 
          success: false, 
          error: chrome.runtime.lastError.message 
        });
        return;
      }
      
      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        console.error("截图数据无效");
        sendResponse({ 
          success: false, 
          error: "截图数据无效" 
        });
        return;
      }
      
      // 后台脚本没有Image对象，直接返回截图数据
      console.log("成功获取到截图，准备返回");
      sendResponse({ 
        success: true, 
        dataUrl: dataUrl
      });
    });
  } catch (error) {
    console.error("截图过程出错:", error);
    sendResponse({ 
      success: false, 
      error: error.message 
    });
  }
  
  // 必须返回true以保持sendResponse有效
  return true;
}

// 捕获完整页面（新增）
function captureFullPage(message, tabId, sendResponse) {
  try {
    console.log("准备捕获完整页面...");
    
    // 获取目标区域信息
    const targetArea = message.targetArea;
    console.log("目标区域:", targetArea);
    
    // 1. 获取页面原始滚动位置（需要在最后恢复）
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        return {
          scrollX: window.scrollX,
          scrollY: window.scrollY
        };
      }
    }).then(results => {
      const originalScroll = results[0].result;
      console.log("原始滚动位置:", originalScroll);
      
      // 2. 滚动到目标区域
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (targetArea) => {
          // 滚动到目标区域的左上角（留些边距）
          window.scrollTo({
            left: Math.max(0, targetArea.left - 50),
            top: Math.max(0, targetArea.top - 50),
            behavior: 'auto' // 使用即时滚动，而不是平滑滚动
          });
          
          // 返回当前视口信息，用于后续处理
          return {
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            dpr: window.devicePixelRatio || 1
          };
        },
        args: [targetArea]
      }).then(results => {
        const viewportInfo = results[0].result;
        console.log("已滚动到目标区域，当前视口信息:", viewportInfo);
        
        // 3. 给页面一些时间加载可能的懒加载内容
        setTimeout(() => {
          // 4. 截取当前可见区域
          chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, (dataUrl) => {
            if (chrome.runtime.lastError) {
              console.error("截取可见区域失败:", chrome.runtime.lastError);
              // 恢复原始滚动位置
              restoreScrollPosition(tabId, originalScroll);
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
              return;
            }
            
            console.log("成功获取区域截图");
            
            // 5. 恢复原始滚动位置
            restoreScrollPosition(tabId, originalScroll);
            
            // 6. 返回截图结果和视口信息
            sendResponse({
              success: true,
              dataUrl: dataUrl,
              viewportInfo: viewportInfo
            });
          });
        }, 200); // 等待200ms，让页面内容完全加载
      }).catch(error => {
        console.error("滚动到目标区域失败:", error);
        // 恢复原始滚动位置
        restoreScrollPosition(tabId, originalScroll);
        sendResponse({ success: false, error: error.message });
      });
    }).catch(error => {
      console.error("获取原始滚动位置失败:", error);
      sendResponse({ success: false, error: error.message });
    });
  } catch (error) {
    console.error("全页面截图过程出错:", error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true;
}

// 恢复滚动位置的辅助函数
function restoreScrollPosition(tabId, position) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (position) => {
      window.scrollTo({
        left: position.scrollX,
        top: position.scrollY,
        behavior: 'auto' // 使用即时滚动
      });
    },
    args: [position]
  }).catch(error => {
    console.error("恢复滚动位置失败:", error);
  });
}

// 保存截图到文件
function saveScreenshot(request, sendResponse) {
  try {
    if (!request.dataUrl || !request.dataUrl.startsWith('data:image/')) {
      console.error("保存失败: 数据URL无效");
      sendResponse({ success: false, error: "数据URL无效" });
      return true;
    }
    
    // 生成文件名，包含日期和可选后缀
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    const suffix = request.suffix || '';
    const filename = `精准截图_${dateStr}${suffix}.${request.format || 'png'}`;
    
    console.log(`保存截图到: ${filename}, 数据大小: ${request.dataUrl.length}`);
    
    // 使用chrome.downloads API保存
    chrome.downloads.download({
      url: request.dataUrl,
      filename: filename,
      saveAs: false // 不显示保存对话框，直接保存到下载文件夹
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("保存截图失败:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else if (downloadId) {
        console.log("截图已保存，下载ID:", downloadId);
        sendResponse({ success: true, downloadId: downloadId });
      } else {
        console.error("保存截图失败: 未获取到下载ID");
        sendResponse({ success: false, error: "保存失败" });
      }
    });
  } catch (error) {
    console.error("保存过程出错:", error);
    sendResponse({ success: false, error: error.message });
  }
  
  // 必须返回true以保持sendResponse有效
  return true;
} 