// 精准截图扩展设置页面脚本
import { getText, updateI18nTexts } from '../utils/i18n.js';

// 快捷键配置相关常量
const KEY_MAP = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Ctrl',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: 'Space',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  // 数字键0-9
  48: '0', 49: '1', 50: '2', 51: '3', 52: '4',
  53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
  // 字母键A-Z
  65: 'A', 66: 'B', 67: 'C', 68: 'D', 69: 'E', 70: 'F', 71: 'G',
  72: 'H', 73: 'I', 74: 'J', 75: 'K', 76: 'L', 77: 'M', 78: 'N',
  79: 'O', 80: 'P', 81: 'Q', 82: 'R', 83: 'S', 84: 'T', 85: 'U',
  86: 'V', 87: 'W', 88: 'X', 89: 'Y', 90: 'Z',
  // 功能键F1-F12
  112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
  118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
  // 其他常用键
  186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/',
  192: '`', 219: '[', 220: '\\', 221: ']', 222: '\''
};

// 命令ID映射
const COMMAND_IDS = {
  'shortcut-start': 'screenshot_start',
  'shortcut-confirm': 'screenshot_confirm',
  'shortcut-cancel': 'screenshot_cancel'
};

// 默认快捷键配置
const DEFAULT_SHORTCUTS = {
  'screenshot_start': 'Ctrl+Shift+S',
  'screenshot_confirm': 'Enter',
  'screenshot_cancel': 'Escape'
};

// DOM元素
const elements = {
  shortcutInputs: {},
  clearButtons: {},
  saveShortcutsBtn: null,
  resetShortcutsBtn: null,
  openChromeShortcutsBtn: null,
  glm4vApiKey: null,
  deepseekApiKey: null,
  saveApiKeysBtn: null
};

// 当前快捷键配置
let currentShortcuts = { ...DEFAULT_SHORTCUTS };

// 初始化
document.addEventListener('DOMContentLoaded', async function() {
  // 获取DOM元素
  initElements();
  
  // 加载已保存的设置
  await loadSettings();
  
  // 初始化事件监听
  initEventListeners();
  
  // 更新多语言文本
  updateI18nTexts();
  
  // 更新版本号
  const manifest = chrome.runtime.getManifest();
  document.getElementById('version').textContent = manifest.version;
});

// 初始化DOM元素引用
function initElements() {
  // 快捷键输入框
  elements.shortcutInputs = {
    'shortcut-start': document.getElementById('shortcut-start'),
    'shortcut-confirm': document.getElementById('shortcut-confirm'),
    'shortcut-cancel': document.getElementById('shortcut-cancel')
  };
  
  // 清除按钮
  document.querySelectorAll('.clear-btn').forEach(btn => {
    const target = btn.dataset.target;
    elements.clearButtons[target] = btn;
  });
  
  // 按钮
  elements.saveShortcutsBtn = document.getElementById('save-shortcuts');
  elements.resetShortcutsBtn = document.getElementById('reset-shortcuts');
  elements.openChromeShortcutsBtn = document.getElementById('open-chrome-shortcuts');
  
  // API设置
  elements.glm4vApiKey = document.getElementById('glm4v-api-key');
  elements.deepseekApiKey = document.getElementById('deepseek-api-key');
  elements.saveApiKeysBtn = document.getElementById('save-api-keys');
}

// 初始化事件监听
function initEventListeners() {
  // 快捷键输入框点击事件
  Object.entries(elements.shortcutInputs).forEach(([id, input]) => {
    input.addEventListener('click', function() {
      startRecordingShortcut(id);
    });
  });
  
  // 清除按钮点击事件
  Object.entries(elements.clearButtons).forEach(([id, button]) => {
    button.addEventListener('click', function() {
      clearShortcut(id);
    });
  });
  
  // 保存快捷键按钮
  elements.saveShortcutsBtn.addEventListener('click', saveShortcuts);
  
  // 重置快捷键按钮
  elements.resetShortcutsBtn.addEventListener('click', resetShortcuts);
  
  // 打开Chrome快捷键设置按钮
  elements.openChromeShortcutsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });
  
  // 保存API设置按钮
  elements.saveApiKeysBtn.addEventListener('click', saveApiKeys);
}

// 加载已保存的设置
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get([
      'custom_shortcuts',
      'glm4v_api_key',
      'deepseek_api_key'
    ], function(data) {
      // 加载快捷键设置
      if (data.custom_shortcuts) {
        currentShortcuts = { ...DEFAULT_SHORTCUTS, ...data.custom_shortcuts };
      }
      
      // 更新UI
      updateShortcutInputs();
      
      // 加载API密钥
      if (data.glm4v_api_key) {
        elements.glm4vApiKey.value = data.glm4v_api_key;
      }
      
      if (data.deepseek_api_key) {
        elements.deepseekApiKey.value = data.deepseek_api_key;
      }
      
      resolve();
    });
  });
}

// 更新快捷键输入框显示
function updateShortcutInputs() {
  Object.entries(elements.shortcutInputs).forEach(([id, input]) => {
    const commandId = COMMAND_IDS[id];
    const shortcut = currentShortcuts[commandId] || '';
    input.value = shortcut;
  });
}

// 开始记录快捷键
function startRecordingShortcut(inputId) {
  const input = elements.shortcutInputs[inputId];
  
  // 添加录制状态
  input.classList.add('recording');
  input.value = '按下快捷键组合...';
  
  // 移除其他输入框的录制状态
  Object.entries(elements.shortcutInputs).forEach(([id, otherInput]) => {
    if (id !== inputId) {
      otherInput.classList.remove('recording');
    }
  });
  
  // 设置全局键盘事件监听
  const keydownHandler = function(e) {
    e.preventDefault();
    
    // 忽略单独的修饰键
    if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt') {
      return;
    }
    
    // 构建快捷键字符串
    let shortcut = '';
    if (e.ctrlKey) shortcut += 'Ctrl+';
    if (e.shiftKey) shortcut += 'Shift+';
    if (e.altKey) shortcut += 'Alt+';
    
    // 获取主键名称
    let mainKey = KEY_MAP[e.keyCode] || e.key;
    shortcut += mainKey;
    
    // 更新输入框
    input.value = shortcut;
    
    // 更新当前配置
    const commandId = COMMAND_IDS[inputId];
    currentShortcuts[commandId] = shortcut;
    
    // 停止录制
    stopRecordingShortcut(input);
    document.removeEventListener('keydown', keydownHandler);
  };
  
  document.addEventListener('keydown', keydownHandler);
  
  // 点击其他区域时停止录制
  const clickHandler = function(e) {
    if (e.target !== input) {
      stopRecordingShortcut(input);
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', keydownHandler);
    }
  };
  
  // 延迟添加点击事件，避免当前点击触发停止
  setTimeout(() => {
    document.addEventListener('click', clickHandler);
  }, 10);
}

// 停止记录快捷键
function stopRecordingShortcut(input) {
  input.classList.remove('recording');
  
  // 如果输入为空，显示提示
  if (!input.value || input.value === '按下快捷键组合...') {
    input.value = '';
    input.placeholder = '点击设置快捷键';
  }
}

// 清除快捷键
function clearShortcut(inputId) {
  const input = elements.shortcutInputs[inputId];
  input.value = '';
  input.classList.remove('recording');
  
  // 更新当前配置
  const commandId = COMMAND_IDS[inputId];
  currentShortcuts[commandId] = '';
}

// 保存快捷键设置
function saveShortcuts() {
  console.log("开始保存快捷键设置:", currentShortcuts);
  
  // 先将快捷键数据保存到存储
  chrome.storage.sync.set({ 
    custom_shortcuts: currentShortcuts 
  }, function() {
    // 检查存储中是否确实保存了快捷键数据
    chrome.storage.sync.get('custom_shortcuts', (data) => {
      console.log("验证保存的快捷键:", data.custom_shortcuts);
      
      if (data.custom_shortcuts) {
        showSaveSuccess('快捷键设置已保存');
        
        // 通知后台脚本更新快捷键配置
        chrome.runtime.sendMessage({
          action: 'updateShortcuts',
          shortcuts: currentShortcuts
        }, function(response) {
          console.log('快捷键更新响应:', response);
          
          if (response && response.success) {
            // 强制重新注入键盘监听器到所有标签页
            chrome.runtime.sendMessage({
              action: 'reloadKeyboardListeners'
            }, function(reloadResponse) {
              console.log('重新加载键盘监听器响应:', reloadResponse);
            });
          } else {
            console.error("更新快捷键失败:", response ? response.error : "未知错误");
            showSaveSuccess('快捷键设置失败，请刷新页面重试');
          }
        });
      } else {
        console.error("保存快捷键后无法验证数据");
        showSaveSuccess('快捷键设置可能未正确保存');
      }
    });
  });
}

// 保存API密钥设置
function saveApiKeys() {
  const glm4vApiKey = elements.glm4vApiKey.value.trim();
  const deepseekApiKey = elements.deepseekApiKey.value.trim();
  
  chrome.storage.sync.set({
    glm4v_api_key: glm4vApiKey,
    deepseek_api_key: deepseekApiKey
  }, function() {
    showSaveSuccess('API设置已保存');
  });
}

// 重置快捷键设置
function resetShortcuts() {
  if (confirm('确定要重置所有快捷键设置吗？')) {
    currentShortcuts = { ...DEFAULT_SHORTCUTS };
    updateShortcutInputs();
    saveShortcuts();
  }
}

// 显示保存成功提示
function showSaveSuccess(message) {
  const toast = document.createElement('div');
  toast.className = 'save-success-toast';
  toast.textContent = message;
  
  // 添加样式
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '4px';
  toast.style.zIndex = '10000';
  
  document.body.appendChild(toast);
  
  // 淡入效果
  toast.animate([
    { opacity: 0, transform: 'translate(-50%, 20px)' },
    { opacity: 1, transform: 'translate(-50%, 0)' }
  ], {
    duration: 300,
    easing: 'ease-out'
  });
  
  // 2秒后自动移除
  setTimeout(() => {
    toast.animate([
      { opacity: 1, transform: 'translate(-50%, 0)' },
      { opacity: 0, transform: 'translate(-50%, -20px)' }
    ], {
      duration: 300,
      easing: 'ease-in'
    }).onfinish = () => toast.remove();
  }, 2000);
} 