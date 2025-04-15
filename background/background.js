// 简化版后台脚本 - 只保留核心功能
console.log("精准截图扩展启动");

// 导入配置
import config from '../config.local.js';

// 默认设置
const DEFAULT_SETTINGS = {
  ratio: "free",
  saveFormat: "png",
  imageQuality: 1.0,
  isInspectMode: false
};

// 自定义快捷键配置
let customShortcuts = {};

// 加载自定义快捷键
loadCustomShortcuts();

// 加载用户自定义的快捷键
function loadCustomShortcuts() {
  chrome.storage.sync.get('custom_shortcuts', (data) => {
    if (data.custom_shortcuts) {
      customShortcuts = data.custom_shortcuts;
      console.log("已加载自定义快捷键:", customShortcuts);
      
      // 确保自定义快捷键不为空字符串
      Object.keys(customShortcuts).forEach(key => {
        if (!customShortcuts[key]) {
          // 如果某个快捷键被清除，使用默认值
          customShortcuts[key] = DEFAULT_SETTINGS.key;
        }
      });
    }
  });
}

// 添加全局键盘事件监听
chrome.runtime.onInstalled.addListener(() => {
  // 注册全局键盘事件监听器(用于自定义快捷键)
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && 
        !tab.url.startsWith('chrome://') && 
        !tab.url.startsWith('edge://') && 
        !tab.url.startsWith('about:')) {
      
      // 注入键盘监听脚本
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: injectKeyboardListener
      }).catch(error => {
        console.log('无法在此页面注入键盘监听:', error);
      });
    }
  });

  // 立即为所有活动标签页注入键盘监听器
  chrome.tabs.query({active: true}, function(tabs) {
    tabs.forEach(tab => {
      if (tab.url && 
          !tab.url.startsWith('chrome://') && 
          !tab.url.startsWith('edge://') && 
          !tab.url.startsWith('about:')) {
        
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: injectKeyboardListener
        }).catch(error => {
          console.log('无法在此页面注入键盘监听:', error);
        });
      }
    });
  });
});

// 注入键盘监听函数
function injectKeyboardListener() {
  // 防止重复注入
  if (window._ratioScreenshotKeyboardListenerInjected) {
    console.log('键盘监听器已经注入，跳过');
    return;
  }
  window._ratioScreenshotKeyboardListenerInjected = true;
  
  // 添加键盘事件监听
  document.addEventListener('keydown', function(e) {
    // 跳过输入框中的按键
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }
    
    // 构建快捷键字符串
    let shortcut = '';
    if (e.ctrlKey) shortcut += 'Ctrl+';
    if (e.shiftKey) shortcut += 'Shift+';
    if (e.altKey) shortcut += 'Alt+';
    
    // 获取主键名称
    function getKeyName(keyCode) {
      // 基本键映射
      const keyMap = {
        8: 'Backspace', 9: 'Tab', 13: 'Enter', 16: 'Shift', 17: 'Ctrl', 18: 'Alt',
        27: 'Escape', 32: 'Space', 37: 'ArrowLeft', 38: 'ArrowUp', 39: 'ArrowRight',
        40: 'ArrowDown', 46: 'Delete'
      };
      
      // 数字键 0-9
      if (keyCode >= 48 && keyCode <= 57) return String.fromCharCode(keyCode);
      
      // 字母键 A-Z
      if (keyCode >= 65 && keyCode <= 90) return String.fromCharCode(keyCode);
      
      // 功能键 F1-F12
      if (keyCode >= 112 && keyCode <= 123) return 'F' + (keyCode - 111);
      
      return keyMap[keyCode] || String.fromCharCode(keyCode);
    }
    
    shortcut += getKeyName(e.keyCode);
    
    console.log("检测到按键组合:", shortcut);
    
    // 将事件对象转换为可序列化结构
    const eventData = {
      keyCode: e.keyCode,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      key: e.key
    };
    
    // 发送消息到后台脚本
    chrome.runtime.sendMessage({
      action: 'keyboardShortcut',
      shortcut: shortcut,
      eventData: eventData
    });
  });
  
  console.log('精准截图: 键盘监听器已注入');
}

// 监听键盘命令
chrome.commands.onCommand.addListener((command) => {
  console.log("收到键盘命令:", command);
  
  // 处理开始截图快捷键
  if (command === 'screenshot_start') {
    console.log("触发开始截图快捷键");
    
    // 从存储中获取最近使用的比例和其他设置，包括智能模式设置
    chrome.storage.sync.get(['lastUsedRatio', 'saveFormat', 'imageQuality', 'isInspectMode'], (data) => {
      // 使用最近一次使用的比例，如果没有则使用free作为默认值
      const ratio = data.isInspectMode ? "free" : (data.lastUsedRatio || "free");
      
      const screenshotOptions = {
        ratio: ratio,
        saveFormat: data.saveFormat || DEFAULT_SETTINGS.saveFormat,
        imageQuality: data.imageQuality || DEFAULT_SETTINGS.imageQuality,
        isInspectMode: data.isInspectMode || DEFAULT_SETTINGS.isInspectMode
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

// 监听自定义键盘快捷键
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'keyboardShortcut') {
    const shortcut = message.shortcut;
    console.log("收到快捷键:", shortcut, "当前配置:", customShortcuts);
    
    // 检查是否匹配任何自定义快捷键
    if (customShortcuts.screenshot_start && shortcut === customShortcuts.screenshot_start) {
      console.log("触发自定义开始截图快捷键:", shortcut);
      
      // 从存储中获取最近使用的比例和其他设置
      chrome.storage.sync.get(['lastUsedRatio', 'saveFormat', 'imageQuality', 'isInspectMode'], (data) => {
        const ratio = data.isInspectMode ? "free" : (data.lastUsedRatio || "free");
        
        const screenshotOptions = {
          ratio: ratio,
          saveFormat: data.saveFormat || DEFAULT_SETTINGS.saveFormat,
          imageQuality: data.imageQuality || DEFAULT_SETTINGS.imageQuality,
          isInspectMode: data.isInspectMode || DEFAULT_SETTINGS.isInspectMode
        };
        
        console.log("开始截图选项:", screenshotOptions);
        
        // 启动截图流程
        startScreenshotProcess(screenshotOptions);
      });
      return true;
    }
    // 确认截图快捷键
    else if (customShortcuts.screenshot_confirm && shortcut === customShortcuts.screenshot_confirm) {
      console.log("触发自定义确认截图快捷键:", shortcut);
      
      // 向当前活动标签页发送确认命令
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return;
        
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'screenshotConfirm'
        }).catch(error => {
          console.log("发送确认命令失败，可能截图模式未启动:", error);
        });
      });
      return true;
    }
    // 取消截图快捷键
    else if (customShortcuts.screenshot_cancel && shortcut === customShortcuts.screenshot_cancel) {
      console.log("触发自定义取消截图快捷键:", shortcut);
      
      // 向当前活动标签页发送取消命令
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return;
        
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'screenshotCancel'
        }).catch(error => {
          console.log("发送取消命令失败，可能截图模式未启动:", error);
        });
      });
      return true;
    } else {
      // 记录未匹配的快捷键
      console.log("快捷键未匹配任何配置:", shortcut);
    }
  }
  
  return true;  // 保持消息通道开放
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
  
  // 处理保存最近截图数据
  else if (message.action === 'saveLastScreenshotData') {
    saveLastScreenshotData(message.dataUrl);
    sendResponse({ success: true });
  }
  
  // 处理GLM-4V-Flash API调用请求
  else if (message.action === 'callGLM4VFlashAPI') {
    callGLM4VFlashAPI(message, sendResponse);
  }
  
  // 处理DeepSeek API调用请求（新增）
  else if (message.action === 'callDeepSeekAPI') {
    callDeepSeekAPI(message, sendResponse);
  }
  
  // 处理打开AI对话窗口请求
  else if (message.action === 'openAIDialog') {
    openAIDialog(message.url, message.options);
    sendResponse({ success: true });
  }
  
  // 处理更新快捷键配置请求
  else if (message.action === 'updateShortcuts') {
    if (message.shortcuts) {
      // 更新内存中的快捷键
      customShortcuts = message.shortcuts;
      console.log("已更新自定义快捷键:", customShortcuts);
      
      // 同时保存到存储中，确保持久化
      chrome.storage.sync.set({ 
        custom_shortcuts: customShortcuts 
      }, function() {
        console.log("快捷键已保存到存储中");
      });
      
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: "没有提供快捷键数据" });
    }
  }
  
  // 处理重新加载键盘监听器请求
  else if (message.action === 'reloadKeyboardListeners') {
    console.log("开始重新加载所有标签页的键盘监听器");
    
    // 重新为所有标签页注入键盘监听器
    chrome.tabs.query({}, function(tabs) {
      // 跟踪成功注入的标签页数量
      let successCount = 0;
      let totalAttempts = 0;
      
      tabs.forEach(tab => {
        if (tab.url && 
            !tab.url.startsWith('chrome://') && 
            !tab.url.startsWith('edge://') && 
            !tab.url.startsWith('about:')) {
          
          totalAttempts++;
          
          // 先移除旧的监听器
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              window._ratioScreenshotKeyboardListenerInjected = false;
              console.log("键盘监听器标记已重置");
            }
          }).then(() => {
            // 再注入新的监听器
            return chrome.scripting.executeScript({
              target: { tabId: tab.id },
              function: injectKeyboardListener
            });
          }).then(() => {
            successCount++;
            console.log(`成功重新注入键盘监听器到标签页 ${tab.id} (${tab.url})`);
            if (successCount === totalAttempts) {
              console.log(`所有 ${successCount} 个标签页已重新注入键盘监听器`);
            }
          }).catch(error => {
            console.log(`重新注入键盘监听器到标签页 ${tab.id} 失败:`, error);
          });
        }
      });
      
      if (totalAttempts === 0) {
        console.log("没有找到适合注入的标签页");
      }
    });
    
    sendResponse({ success: true });
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
    
    // 使用分块截图方法
    captureFullPageByTiles(tabId, targetArea, sendResponse);
  } catch (error) {
    console.error("全页面截图过程出错:", error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true;
}

// 使用分块截图方法实现全页面截图
function captureFullPageByTiles(tabId, targetArea, sendResponse) {
  // 步骤1: 获取页面原始滚动位置和视口信息
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      return {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        dpr: window.devicePixelRatio || 1
      };
    }
  }).then(results => {
    const originalInfo = results[0].result;
    console.log("原始视口信息:", originalInfo);
    
    // 步骤2: 计算需要捕获的块数
    const tilesInfo = calculateTiles(targetArea, originalInfo);
    console.log("分块信息:", tilesInfo);
    
    // 用于存储所有分块的图像数据
    const tiles = [];
    
    // 步骤3: 开始分块捕获过程
    captureNextTile(tabId, targetArea, originalInfo, tilesInfo, tiles, 0)
      .then(() => {
        console.log(`全部 ${tiles.length} 个分块捕获完成`);
        
        // 步骤4: 合并所有分块
        mergeAndProcessTiles(targetArea, originalInfo, tiles, sendResponse, tabId);
      })
      .catch(error => {
        console.error("分块捕获过程失败:", error);
        restoreScrollPosition(tabId, originalInfo);
        sendResponse({ success: false, error: error.message });
      });
  }).catch(error => {
    console.error("获取原始滚动位置失败:", error);
    sendResponse({ success: false, error: error.message });
  });
}

// 计算需要的分块
function calculateTiles(targetArea, viewportInfo) {
  // 使用更大的分块大小以减少总分块数量
  // 使用视口尺寸的75%作为分块大小，确保不会生成太多分块
  const effectiveWidth = Math.max(Math.floor(viewportInfo.viewportWidth * 0.75), 600);
  const effectiveHeight = Math.max(Math.floor(viewportInfo.viewportHeight * 0.75), 500);
  
  console.log(`分块大小: ${effectiveWidth}x${effectiveHeight}, 视口大小: ${viewportInfo.viewportWidth}x${viewportInfo.viewportHeight}`);
  
  // 计算总共需要的行数和列数
  const startCol = Math.floor(targetArea.left / effectiveWidth);
  const startRow = Math.floor(targetArea.top / effectiveHeight);
  const endCol = Math.ceil((targetArea.left + targetArea.width) / effectiveWidth);
  const endRow = Math.ceil((targetArea.top + targetArea.height) / effectiveHeight);
  
  // 当区域特别大时，限制最大分块数，防止过多API调用
  const maxTiles = 9; // 最多3x3的网格
  const totalTiles = (endRow - startRow) * (endCol - startCol);
  
  // 如果分块太多，增大分块尺寸
  let adjustedEffectiveWidth = effectiveWidth;
  let adjustedEffectiveHeight = effectiveHeight;
  
  if (totalTiles > maxTiles) {
    console.log(`分块数量过多(${totalTiles})，调整分块大小`);
    const scale = Math.sqrt(totalTiles / maxTiles);
    adjustedEffectiveWidth = Math.ceil(effectiveWidth * scale);
    adjustedEffectiveHeight = Math.ceil(effectiveHeight * scale);
    
    console.log(`调整后分块大小: ${adjustedEffectiveWidth}x${adjustedEffectiveHeight}`);
  }
  
  // 构建分块信息
  const tiles = [];
  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      tiles.push({
        row,
        col,
        scrollX: col * adjustedEffectiveWidth,
        scrollY: row * adjustedEffectiveHeight
      });
    }
  }
  
  console.log(`生成了 ${tiles.length} 个分块`);
  
  return {
    startCol,
    startRow,
    endCol,
    endRow,
    rows: endRow - startRow,
    cols: endCol - startCol,
    effectiveWidth: adjustedEffectiveWidth,
    effectiveHeight: adjustedEffectiveHeight,
    tiles
  };
}

// 递归捕获每个分块
function captureNextTile(tabId, targetArea, originalInfo, tilesInfo, tiles, currentIndex) {
  return new Promise((resolve, reject) => {
    // 所有分块都已处理完成
    if (currentIndex >= tilesInfo.tiles.length) {
      resolve();
      return;
    }
    
    const tile = tilesInfo.tiles[currentIndex];
    console.log(`准备捕获分块 ${currentIndex + 1}/${tilesInfo.tiles.length}: 行=${tile.row}, 列=${tile.col}`);
    
    // 滚动到分块位置
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (scrollX, scrollY) => {
        try {
          window.scrollTo({
            left: scrollX,
            top: scrollY,
            behavior: 'auto'
          });
          
          // 返回实际滚动位置 (可能与请求的位置不同)
          return {
            actualScrollX: window.scrollX,
            actualScrollY: window.scrollY,
            success: true
          };
        } catch (error) {
          return {
            success: false,
            error: error.toString()
          };
        }
      },
      args: [tile.scrollX, tile.scrollY]
    }).then(scrollResults => {
      if (!scrollResults || !scrollResults[0] || !scrollResults[0].result) {
        reject(new Error("滚动操作没有返回结果"));
        return;
      }
      
      const scrollResult = scrollResults[0].result;
      
      if (!scrollResult.success) {
        reject(new Error(`滚动操作失败: ${scrollResult.error}`));
        return;
      }
      
      const actualScroll = {
        actualScrollX: scrollResult.actualScrollX,
        actualScrollY: scrollResult.actualScrollY
      };
      
      console.log(`已滚动到位置: (${actualScroll.actualScrollX}, ${actualScroll.actualScrollY})`);
      
      // 给页面充分的时间来适应滚动和加载内容
      // 增加延迟以避免超出配额限制
      const captureDelay = 500 + (currentIndex * 100); // 随着分块数增加延迟
      
      console.log(`等待 ${captureDelay}ms 后捕获...`);
      setTimeout(() => {
        try {
          // 捕获当前视口
          chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, dataUrl => {
            if (chrome.runtime.lastError) {
              const errorMsg = chrome.runtime.lastError.message || "未知错误";
              console.error(`捕获视口失败: ${errorMsg}`);
              
              // 检查是否是配额错误
              if (errorMsg.includes("MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND")) {
                console.log("检测到配额限制，增加更长的延迟后重试...");
                // 遇到配额限制，增加延迟后重试同一分块
                setTimeout(() => {
                  captureNextTile(tabId, targetArea, originalInfo, tilesInfo, tiles, currentIndex)
                    .then(resolve)
                    .catch(reject);
                }, 2000);  // 增加2秒长延迟后重试
                return;
              }
              
              reject(new Error(`捕获视口失败: ${errorMsg}`));
              return;
            }
            
            if (!dataUrl || !dataUrl.startsWith('data:image/')) {
              reject(new Error("捕获的数据无效"));
              return;
            }
            
            console.log(`成功捕获分块 ${currentIndex + 1}`);
            
            // 记录这个分块的信息
            tiles.push({
              dataUrl,
              position: {
                scrollX: actualScroll.actualScrollX,
                scrollY: actualScroll.actualScrollY
              }
            });
            
            // 为下一个分块添加间隔，避免触发配额限制
            setTimeout(() => {
              // 继续下一个分块
              captureNextTile(tabId, targetArea, originalInfo, tilesInfo, tiles, currentIndex + 1)
                .then(resolve)
                .catch(reject);
            }, 500);
          });
        } catch (error) {
          console.error("捕获过程中发生异常:", error);
          reject(error);
        }
      }, captureDelay);
    }).catch(error => {
      console.error("滚动执行脚本失败:", error);
      reject(error);
    });
  });
}

// 合并分块并处理最终图像
function mergeAndProcessTiles(targetArea, originalInfo, tiles, sendResponse, tabId) {
  try {
    // 恢复原始滚动位置
    restoreScrollPosition(tabId, originalInfo);
    
    console.log(`准备合并 ${tiles.length} 个分块...`);
    
    // 在内容脚本中处理图像合并
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (params) => {
        try {
          const { tiles, targetArea, originalInfo } = params;
          
          console.log(`内容脚本: 开始合并 ${tiles.length} 个分块, 目标区域: ${targetArea.width}x${targetArea.height}`);
          
          // 创建合并用的画布
          const mergeCanvas = document.createElement('canvas');
          mergeCanvas.width = targetArea.width * originalInfo.dpr;
          mergeCanvas.height = targetArea.height * originalInfo.dpr;
          const ctx = mergeCanvas.getContext('2d');
          
          // 用于跟踪加载进度的计数器
          let loadedCount = 0;
          const totalTiles = tiles.length;
          
          return new Promise((resolve) => {
            if (totalTiles === 0) {
              console.warn("没有分块数据，返回空白图像");
              try {
                const emptyDataUrl = mergeCanvas.toDataURL('image/png');
                resolve({ success: true, dataUrl: emptyDataUrl });
              } catch (error) {
                console.error("创建空白图像失败:", error);
                resolve({ success: false, error: `创建空白图像失败: ${error.message || error}` });
              }
              return;
            }
            
            // 处理所有图像分块
            tiles.forEach((tile, index) => {
              const img = new Image();
              
              img.onload = () => {
                try {
                  // 计算这个分块的位置
                  const tilePosition = tile.position;
                  
                  // 计算源区域 - 该分块中要提取的区域
                  const srcX = Math.max(0, targetArea.left - tilePosition.scrollX);
                  const srcY = Math.max(0, targetArea.top - tilePosition.scrollY);
                  const srcWidth = Math.min(
                    originalInfo.viewportWidth, 
                    targetArea.width, 
                    originalInfo.viewportWidth - srcX
                  );
                  const srcHeight = Math.min(
                    originalInfo.viewportHeight, 
                    targetArea.height, 
                    originalInfo.viewportHeight - srcY
                  );
                  
                  // 计算目标区域 - 这个分块应绘制到画布上的位置
                  const dstX = Math.max(0, tilePosition.scrollX - targetArea.left) * originalInfo.dpr;
                  const dstY = Math.max(0, tilePosition.scrollY - targetArea.top) * originalInfo.dpr;
                  
                  // 应用设备像素比
                  const scaledSrcX = srcX * originalInfo.dpr;
                  const scaledSrcY = srcY * originalInfo.dpr;
                  const scaledSrcWidth = srcWidth * originalInfo.dpr;
                  const scaledSrcHeight = srcHeight * originalInfo.dpr;
                  
                  console.log(`内容脚本: 处理分块 ${index + 1}/${totalTiles}, 源区域: (${srcX},${srcY},${srcWidth},${srcHeight}), 目标位置: (${dstX},${dstY})`);
                  
                  // 绘制到合并画布
                  ctx.drawImage(
                    img, 
                    scaledSrcX, scaledSrcY, scaledSrcWidth, scaledSrcHeight,
                    dstX, dstY, scaledSrcWidth, scaledSrcHeight
                  );
                  
                  console.log(`内容脚本: 分块 ${index + 1} 已绘制`);
                } catch (error) {
                  console.error(`内容脚本: 处理分块 ${index + 1} 时出错:`, error);
                }
                
                // 增加计数器
                loadedCount++;
                console.log(`内容脚本: 已处理 ${loadedCount}/${totalTiles} 个分块`);
                
                // 检查是否所有分块都已处理
                checkAllProcessed();
              };
              
              img.onerror = (event) => {
                console.error(`内容脚本: 分块 ${index + 1} 图像加载失败`, event);
                loadedCount++;
                checkAllProcessed();
              };
              
              // 设置图像源
              img.src = tile.dataUrl;
            });
            
            // 检查所有分块是否都已处理完成
            function checkAllProcessed() {
              if (loadedCount === totalTiles) {
                console.log("内容脚本: 所有分块处理完成，导出最终图像");
                try {
                  // 导出最终图像
                  const finalDataUrl = mergeCanvas.toDataURL('image/png');
                  console.log(`内容脚本: 成功导出图像，数据大小约 ${Math.round(finalDataUrl.length / 1024)} KB`);
                  resolve({ success: true, dataUrl: finalDataUrl });
                } catch (error) {
                  console.error("内容脚本: 导出最终图像失败:", error);
                  resolve({ success: false, error: `导出最终图像失败: ${error.message || error}` });
                }
              }
            }
          });
        } catch (error) {
          console.error("内容脚本: 图像合并过程中发生异常:", error);
          return { success: false, error: `内容脚本合并图像失败: ${error.message || error}` };
        }
      },
      args: [{
        tiles: tiles,
        targetArea: targetArea,
        originalInfo: originalInfo
      }]
    }).then(results => {
      if (results && results[0] && results[0].result) {
        const result = results[0].result;
        if (result.success) {
          console.log("成功合并所有分块");
          sendResponse({
            success: true,
            dataUrl: result.dataUrl,
            viewportInfo: {
              scrollX: targetArea.left,
              scrollY: targetArea.top,
              viewportWidth: targetArea.width,
              viewportHeight: targetArea.height,
              dpr: originalInfo.dpr
            }
          });
        } else {
          const errorMsg = result.error || "未知错误";
          console.error("合并分块失败:", errorMsg);
          sendResponse({ success: false, error: errorMsg });
        }
      } else {
        console.error("合并分块失败: 未获取到结果", results);
        sendResponse({ success: false, error: "合并分块失败: 未获取到有效结果" });
      }
    }).catch(error => {
      const errorMsg = error.message || error.toString() || "未知错误";
      console.error("分块合并过程出错:", errorMsg);
      sendResponse({ success: false, error: errorMsg });
    });
  } catch (error) {
    const errorMsg = error.message || error.toString() || "未知错误";
    console.error("执行合并操作时出错:", errorMsg);
    sendResponse({ success: false, error: errorMsg });
  }
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

// 调用GLM-4V-Flash API
function callGLM4VFlashAPI(request, sendResponse) {
  console.log("准备调用GLM-4V-Flash API...");
  
  // 从存储中获取API密钥
  chrome.storage.sync.get(['glm4v_api_key'], (data) => {
    // 优先使用用户设置的API密钥，如果没有则使用默认配置
    const apiKey = data.glm4v_api_key || config.GLM4V_API_KEY;
    
    // 准备API请求参数
    const apiEndpoint = config.GLM4V_API_ENDPOINT;
    
    // 根据真实示例构建请求体
    const requestBody = {
      model: "glm-4v-flash",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${request.image}`
              }
            },
            {
              type: "text",
              text: request.message
            }
          ]
        }
      ]
    };
    
    console.log("发送API请求...");
    
    // 通过网络请求发送
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("收到API响应:", data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiResponse = data.choices[0].message.content;
        sendResponse({
          success: true,
          aiResponse: aiResponse
        });
      } else {
        throw new Error("API响应格式不正确");
      }
    })
    .catch(error => {
      console.error("API调用出错:", error);
      sendResponse({
        success: false,
        error: error.message || "调用GLM-4V-Flash API失败"
      });
    });
  });
  
  // 必须返回true以保持sendResponse有效
  return true;
}

// 打开AI对话窗口
function openAIDialog(url, options = {}) {
  console.log("打开AI对话窗口:", url);
  
  // 默认窗口选项
  const defaultOptions = {
    width: 900,
    height: 700,
    left: 0,
    top: 0,
    type: 'popup',
    focused: true
  };
  
  // 合并选项
  const windowOptions = { ...defaultOptions, ...options };
  
  // 创建新窗口
  chrome.windows.create({
    url: url,
    type: windowOptions.type,
    width: windowOptions.width,
    height: windowOptions.height,
    left: windowOptions.left,
    top: windowOptions.top,
    focused: windowOptions.focused
  }, (window) => {
    if (chrome.runtime.lastError) {
      console.error("创建对话窗口失败:", chrome.runtime.lastError);
    } else {
      console.log("成功创建对话窗口, ID:", window.id);
    }
  });
}

// 保存最近截图数据
function saveLastScreenshotData(dataUrl) {
  // 保存到本地存储
  chrome.storage.local.set({
    lastScreenshotData: dataUrl,
    lastScreenshotTime: Date.now()
  });
  console.log("已保存最近截图数据");
}

// 调用DeepSeek API
function callDeepSeekAPI(request, sendResponse) {
  console.log("准备调用DeepSeek API...");
  
  // 从存储中获取API密钥
  chrome.storage.sync.get(['deepseek_api_key'], (data) => {
    // 优先使用用户设置的API密钥，如果没有则使用默认配置
    const apiKey = data.deepseek_api_key || config.DEEPSEEK_API_KEY;
    
    // 如果没有设置API密钥，返回错误
    if (!apiKey) {
      console.error("DeepSeek API密钥未设置");
      sendResponse({
        success: false,
        error: "DeepSeek API密钥未设置，请在设置中配置"
      });
      return;
    }
    
    // 准备API请求参数
    const apiEndpoint = config.DEEPSEEK_API_ENDPOINT || "https://api.deepseek.com/chat/completions";
    
    // 构建请求体 - 启用流式输出
    const requestBody = {
      model: "deepseek-chat",
      messages: request.messages,
      stream: true
    };
    
    console.log("发送DeepSeek API流式请求...");
    
    // 通过fetch API发送请求并处理流式响应
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      
      // 创建响应读取器
      const reader = response.body.getReader();
      // 完整消息内容
      let fullContent = "";
      // 用于解码
      const decoder = new TextDecoder();
      // 标记流是否结束
      let streamDone = false;
      
      // 初始化成功响应
      sendResponse({
        success: true,
        streaming: true,
        content: "",
        done: false
      });
      
      // 递归读取数据流
      function readStream() {
        // 如果流已结束，不再继续读取
        if (streamDone) return;
        
        reader.read().then(({ done, value }) => {
          // 检查流是否结束
          if (done) {
            console.log("DeepSeek API流式响应已完成");
            // 通知前端流已结束
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs && tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: 'streamComplete',
                  content: fullContent
                });
              }
            });
            streamDone = true;
            return;
          }
          
          // 解码二进制数据
          const chunk = decoder.decode(value, { stream: true });
          // 分割成行
          const lines = chunk.split('\n');
          
          // 处理每一行数据
          for (const line of lines) {
            // 跳过空行
            if (!line.trim()) continue;
            
            // 处理SSE格式数据
            if (line.startsWith('data: ')) {
              // 提取JSON数据
              const jsonData = line.substring(6);
              
              // 跳过[DONE]标记
              if (jsonData.trim() === '[DONE]') {
                continue;
              }
              
              try {
                // 解析JSON数据
                const data = JSON.parse(jsonData);
                // 提取delta内容
                if (data.choices && data.choices[0] && data.choices[0].delta) {
                  const delta = data.choices[0].delta;
                  
                  // 如果有新内容
                  if (delta.content) {
                    // 累加到完整内容
                    fullContent += delta.content;
                    
                    // 发送增量更新到前端
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                      if (tabs && tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                          action: 'streamUpdate',
                          content: delta.content,
                          fullContent: fullContent
                        });
                      }
                    });
                  }
                  
                  // 检查是否结束
                  if (data.choices[0].finish_reason === 'stop') {
                    console.log("DeepSeek API流式响应已完成");
                    streamDone = true;
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                      if (tabs && tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                          action: 'streamComplete',
                          content: fullContent
                        });
                      }
                    });
                    return;
                  }
                }
              } catch (error) {
                console.error("处理流数据出错:", error, "原数据:", jsonData);
              }
            }
          }
          
          // 继续读取流
          readStream();
        }).catch(error => {
          console.error("读取响应流时出错:", error);
          // 通知前端错误
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: 'streamError',
                error: error.message || "读取响应流时出错"
              });
            }
          });
        });
      }
      
      // 开始读取流
      readStream();
    })
    .catch(error => {
      console.error("DeepSeek API调用出错:", error);
      sendResponse({
        success: false,
        error: error.message || "调用DeepSeek API失败"
      });
    });
  });
  
  // 必须返回true以保持sendResponse有效
  return true;
} 