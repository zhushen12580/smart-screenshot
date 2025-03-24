// 简化版内容脚本 - 保留按精准截图和连续截图功能
// 使用全局变量保存实例
let ratioScreenshotInstance = null;

// 避免重复初始化
if (window._ratioScreenshotLoaded) {
  console.log("精准截图工具已加载");
  
  // 如果页面已经有实例但出现问题，尝试重置
  if (ratioScreenshotInstance) {
    try {
      console.log("重置现有实例");
      ratioScreenshotInstance.cleanupExistingElements();
    } catch (e) {
      console.error("重置实例时出错:", e);
    }
  }
} else {
  window._ratioScreenshotLoaded = true;
  
  class RatioScreenshot {
    constructor() {
      // 状态变量
      this.isActive = false;
      this.isSelecting = false;
      this.isContinuousMode = true; // 默认支持连续截图
      this.ratio = '16:9';
      this.startX = 0;
      this.startY = 0;
      this.endX = 0;
      this.endY = 0;
      this.scrollX = 0;
      this.scrollY = 0;
      
      // 锁定尺寸相关变量
      this.isLockSize = false;
      this.lockedWidth = 0;
      this.lockedHeight = 0;
      
      // 磁性吸附相关变量
      this.isMagneticEnabled = false; // 默认关闭磁性吸附
      this.magneticThreshold = 8; // 降低吸附阈值，让吸附不那么激进
      this.magneticStrength = 0.5; // 吸附强度系数 (0-1)，值越小越平滑
      this.nearestEdges = null; // 最近的元素边缘缓存
      this.lastMagneticPosition = null; // 上一次磁性吸附的位置
      this.magneticGuides = { // 磁性辅助线
        horizontal: null,
        vertical: null
      };
      
      // DOM元素
      this.overlay = null;
      this.selection = null;
      this.infoPanel = null;
      this.toolbar = null;
      
      // 保存所有已选择区域
      this.selections = [];
      
      // 事件绑定
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
      
      // 初始化监听器
      this.initMessageListener();
      
      // 注入样式
      this.injectStyles();
    }
    
    // 初始化消息监听
    initMessageListener() {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
          console.log("内容脚本收到消息:", message);
          if (message.action === 'initiateScreenshot') {
            // 先确保清理现有元素
            this.cleanupExistingElements();
            
            try {
              this.start(message.options || {});
              sendResponse({ success: true });
            } catch (error) {
              console.error("启动截图失败:", error);
              sendResponse({ success: false, error: error.message });
              
              // 发生错误时，尝试清理
              this.end();
            }
          } 
          else if (message.action === 'screenshotConfirm') {
            // 如果有选择框，执行确认操作
            if (this.selection && this.isActive) {
              console.log("通过快捷键执行确认截图");
              this.captureAndSave();
              sendResponse({ success: true });
            } else {
              console.log("无法执行确认截图，截图模式未激活或无选择框");
              sendResponse({ success: false, error: "截图模式未激活" });
            }
          }
          else if (message.action === 'screenshotCancel') {
            // 如果正在截图，执行取消操作
            if (this.isActive) {
              console.log("通过快捷键执行取消截图");
              this.end();
              sendResponse({ success: true });
            } else {
              console.log("无法执行取消截图，截图模式未激活");
              sendResponse({ success: false, error: "截图模式未激活" });
            }
          }
          return true;
        } catch (e) {
          console.error("处理消息时发生错误:", e);
          sendResponse({ success: false, error: e.message });
          return true;
        }
      });
    }
    
    // 注入样式表
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --primary-color: #6d28d9;
          --primary-dark: #5b21b6;
          --primary-light: #8b5cf6;
          --black: #18181b;
          --white: #ffffff;
          --gray-100: #f4f4f5;
          --shadow-offset: 4px;
        }
        
        #ratio-screenshot-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          z-index: 9999;
          cursor: crosshair;
        }
        
        #ratio-screenshot-selection {
          position: fixed;
          border: 3px solid var(--white);
          background-color: transparent;
          box-shadow: none;
          z-index: 10000;
          pointer-events: auto;
          box-sizing: border-box;
          /* 添加外层阴影效果使边框在任何背景下都清晰可见 */
          outline: 1px solid rgba(0, 0, 0, 0.5);
        }
        
        #ratio-screenshot-info {
          position: absolute;
          left: 0;
          background-color: rgba(24, 24, 27, 0.7);
          color: var(--white);
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: normal;
          white-space: nowrap;
          z-index: 10002;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          bottom: -25px; /* 默认显示在底部外侧 */
          opacity: 0.85;
          font-family: 'Consolas', monospace;
          transition: opacity 0.2s;
        }
        
        #ratio-screenshot-info:hover {
          opacity: 1;
        }
        
        .ratio-screenshot-shortcut-info {
          display: flex;
          align-items: center;
          margin-left: 10px;
          font-size: 11px;
          color: var(--black);
          white-space: nowrap;
          opacity: 0.9;
          background-color: rgba(244, 244, 245, 0.9);
          padding: 4px 8px;
          border: 2px solid var(--black);
          box-shadow: 2px 2px 0 var(--black);
        }
        
        .ratio-screenshot-shortcut-info span {
          display: inline-block;
          background-color: rgba(109, 40, 217, 0.2);
          border: 1px solid var(--primary-color);
          border-radius: 2px;
          padding: 1px 4px;
          margin: 0 2px;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
        }
        
        .ratio-screenshot-selection-saved {
          position: absolute;
          border: 3px dashed var(--primary-color);
          background-color: rgba(139, 92, 246, 0.1);
          z-index: 9998;
          pointer-events: none;
        }
        
        #ratio-screenshot-toolbar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: transparent;
          border-radius: 0;
          border: none;
          box-shadow: none;
          padding: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          z-index: 10001;
          max-width: calc(100% - 40px);
          justify-content: center;
        }
        
        .ratio-screenshot-toolbar-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          width: 100%;
        }
        
        .ratio-screenshot-button {
          padding: 8px 14px;
          border-radius: 0;
          font-size: 14px;
          font-weight: bold;
          border: 3px solid var(--black);
          cursor: pointer;
          background-color: rgba(244, 244, 245, 0.9);
          color: var(--black);
          box-shadow: 3px 3px 0 var(--black);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .ratio-screenshot-button:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 var(--black);
        }
        
        .ratio-screenshot-button:active {
          transform: translate(1px, 1px);
          box-shadow: 2px 2px 0 var(--black);
        }
        
        .ratio-screenshot-button.primary {
          background-color: rgba(109, 40, 217, 0.95);
          color: var(--white);
        }
        
        select.ratio-screenshot-button {
          padding: 8px 14px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23000' d='M0 0l4 4 4-4z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 28px;
        }
        
        .ratio-screenshot-selection-info {
          position: absolute;
          bottom: -25px;
          left: 0;
          color: var(--white);
          background-color: var(--primary-color);
          padding: 2px 8px;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid var(--black);
        }
        
        .ratio-screenshot-magnetic-guide {
          position: fixed;
          z-index: 10002;
          pointer-events: none;
          opacity: 0; /* 隐藏磁性辅助线 */
        }
        
        .ratio-screenshot-magnetic-guide.horizontal {
          height: 1px;
          background-color: #00e5ff;
          width: 100%;
          box-shadow: 0 0 2px rgba(0, 229, 255, 0.8);
        }
        
        .ratio-screenshot-magnetic-guide.vertical {
          width: 1px;
          background-color: #00e5ff;
          height: 100%;
          box-shadow: 0 0 2px rgba(0, 229, 255, 0.8);
        }
        
        .ratio-screenshot-element-highlight {
          position: absolute;
          border: 1px solid rgba(0, 229, 255, 0.5);
          background-color: rgba(0, 229, 255, 0.1);
          pointer-events: none;
          z-index: 9997;
          opacity: 0; /* 隐藏元素高亮 */
        }
        
        .ratio-screenshot-resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: var(--white);
          border: 2px solid var(--primary-color);
          z-index: 10003;
        }
        
        .ratio-screenshot-resize-handle.top-left {
          top: -7px;
          left: -7px;
          cursor: nwse-resize;
        }
        
        .ratio-screenshot-resize-handle.top-right {
          top: -7px;
          right: -7px;
          cursor: nesw-resize;
        }
        
        .ratio-screenshot-resize-handle.bottom-left {
          bottom: -7px;
          left: -7px;
          cursor: nesw-resize;
        }
        
        .ratio-screenshot-resize-handle.bottom-right {
          bottom: -7px;
          right: -7px;
          cursor: nwse-resize;
        }
        
        .ratio-screenshot-resize-handle.top {
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          cursor: ns-resize;
        }
        
        .ratio-screenshot-resize-handle.right {
          top: 50%;
          right: -7px;
          transform: translateY(-50%);
          cursor: ew-resize;
        }
        
        .ratio-screenshot-resize-handle.bottom {
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          cursor: ns-resize;
        }
        
        .ratio-screenshot-resize-handle.left {
          top: 50%;
          left: -7px;
          transform: translateY(-50%);
          cursor: ew-resize;
        }
        
        .ratio-screenshot-notification {
          position: fixed;
          bottom: 20px;
          top: auto;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(109, 40, 217, 0.9);
          color: var(--white);
          padding: 12px 18px;
          border-radius: 0;
          z-index: 10002;
          font-size: 14px;
          font-weight: bold;
          border: 3px solid var(--black);
          box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--black);
          transition: opacity 0.3s ease;
          max-width: 80%;
          text-align: center;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 开始截图流程
    start(options) {
      console.log("开始截图流程, 选项:", options);
      
      // 先确保清理任何可能存在的旧截图元素
      this.cleanupExistingElements();
      
      // 如果已经在活动状态，先结束当前截图
      if (this.isActive) {
        this.end();
      }
      
      // 设置比例和选项
      this.ratio = options.ratio || '16:9';
      this.saveFormat = options.saveFormat || 'png';
      this.imageQuality = options.imageQuality || 1.0; // 使用传入的图片质量或默认值
      this.isContinuousMode = options.continuousMode !== false; // 默认为true
      
      // 清空保存的选择
      this.selections = [];
      
      // 创建UI元素
      this.createOverlay();
      
      // 添加事件监听
      this.addEventListeners();
      
      // 设置活动状态
      this.isActive = true;
    }
    
    // 清理现有截图相关元素
    cleanupExistingElements() {
      const elementsToRemove = [
        'ratio-screenshot-overlay',
        'ratio-screenshot-selection',
        'ratio-screenshot-toolbar',
        'ratio-screenshot-notification'
      ];
      
      // 检查并移除所有指定ID的元素
      elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          console.log(`预清理: 移除元素 ${id}`);
          element.remove();
        }
      });
      
      // 清理所有辅助性元素
      document.querySelectorAll('.ratio-screenshot-magnetic-guide').forEach(el => el.remove());
      document.querySelectorAll('.ratio-screenshot-element-highlight').forEach(el => el.remove());
      document.querySelectorAll('.ratio-screenshot-resize-handle').forEach(el => el.remove());
      document.querySelectorAll('.ratio-screenshot-selection-saved').forEach(el => el.remove());
    }
    
    // 自动创建选择区域（已弃用 - 现在让用户自己选择区域）
    autoCreateSelection(centerX, centerY) {
      // 此方法已不再使用，保留代码仅供参考
      // 现在用户需要通过鼠标拖动自己创建选择区域
      console.log("autoCreateSelection方法已弃用");
    }
    
    // 创建截图遮罩层
    createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.id = 'ratio-screenshot-overlay';
      document.body.appendChild(this.overlay);
    }
    
    // 创建选择框
    createSelection(x, y) {
      // 如果在连续模式下，先保存当前选择框（如果有的话）
      if (this.isContinuousMode && this.selection) {
        this.saveCurrentSelectionAsPreview();
      } else if (!this.isContinuousMode) {
        // 在非连续模式下，移除当前选择框
        this.clearCurrentSelection();
      }
      
      this.selection = document.createElement('div');
      this.selection.id = 'ratio-screenshot-selection';
      this.selection.style.left = `${x}px`;
      this.selection.style.top = `${y}px`;
      this.selection.style.width = '10px';  // 使用更合理的初始尺寸，避免选框太小
      this.selection.style.height = '10px'; // 使用更合理的初始尺寸，避免选框太小
      
      // 创建信息面板
      this.infoPanel = document.createElement('div');
      this.infoPanel.id = 'ratio-screenshot-info';
      this.selection.appendChild(this.infoPanel);
      
      document.body.appendChild(this.selection);
    }
    
    // 将当前选择框保存为预览
    saveCurrentSelectionAsPreview() {
      if (!this.selection) return;
      
      const rect = this.selection.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return; // 忽略太小的选择
      
      // 计算选择框在文档中的绝对位置（相对于文档而非视口）
      const absoluteLeft = Math.min(this.startX, this.endX);
      const absoluteTop = Math.min(this.startY, this.endY);
      const width = Math.abs(this.endX - this.startX);
      const height = Math.abs(this.endY - this.startY);
      
      // 创建一个新的div作为已保存选择的预览
      const savedSelection = document.createElement('div');
      savedSelection.className = 'ratio-screenshot-selection-saved';
      
      // 使用绝对位置，让选择框跟随页面内容滚动
      savedSelection.style.left = `${absoluteLeft}px`;
      savedSelection.style.top = `${absoluteTop}px`;
      savedSelection.style.width = `${width}px`;
      savedSelection.style.height = `${height}px`;
      
      // 添加标号
      const selectionNumber = document.createElement('div');
      selectionNumber.className = 'ratio-screenshot-selection-info';
      selectionNumber.textContent = `区域 ${this.selections.length + 1}`;
      savedSelection.appendChild(selectionNumber);
      
      document.body.appendChild(savedSelection);
      
      // 保存选择信息和DOM元素（使用绝对坐标）
      this.selections.push({
        element: savedSelection,
        rect: {
          // 使用页面绝对坐标存储，便于后续截图处理
          left: absoluteLeft,
          top: absoluteTop,
          width: width,
          height: height,
          // 存储选择时的滚动信息（用于调试）
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          // 存储当前使用的比例，以便后续处理时保持一致
          ratio: this.ratio
        }
      });
      
      // 移除当前选择框
      this.clearCurrentSelection();
      
      // 如果启用了尺寸锁定，显示提示信息
      this.startNewSelection();
    }
    
    // 清除当前选择框（不影响已保存的选择）
    clearCurrentSelection() {
      if (this.selection) {
        // 移除移动事件监听器（如果存在）
        if (this.selectionMoveHandler) {
          this.selection.removeEventListener('mousedown', this.selectionMoveHandler);
          this.selectionMoveHandler = null;
        }
        
        this.selection.remove();
        this.selection = null;
      }
      
      if (this.toolbar) {
        this.toolbar.remove();
        this.toolbar = null;
      }
      
      this.infoPanel = null;
    }
    
    // 创建工具栏
    createToolbar() {
      // 确保先清理可能存在的旧工具栏
      if (this.toolbar) {
        this.toolbar.remove();
        this.toolbar = null;
      }
      
      this.toolbar = document.createElement('div');
      this.toolbar.id = 'ratio-screenshot-toolbar';
      
      // 创建第一行按钮 - 主要操作
      const primaryRow = document.createElement('div');
      primaryRow.className = 'ratio-screenshot-toolbar-row';
      
      // 保存按钮
      const saveButton = document.createElement('button');
      saveButton.className = 'ratio-screenshot-button primary';
      saveButton.textContent = '保存此区域';
      saveButton.addEventListener('click', () => this.captureAndSave());
      
      // 添加快捷键提示
      const shortcutInfo = document.createElement('div');
      // shortcutInfo.className = 'ratio-screenshot-shortcut-info';
      // shortcutInfo.innerHTML = '快捷键: <span>Enter</span> 确认, <span>Esc</span> 取消, <span>↑↓←→</span> 移动';
      
      // 保存全部按钮
      const saveAllButton = document.createElement('button');
      saveAllButton.className = 'ratio-screenshot-button primary';
      saveAllButton.textContent = `保存所有区域 (${this.selections.length + 1})`;
      saveAllButton.addEventListener('click', () => this.captureAndSaveAll());
      
      // 保持此区域并继续按钮
      const keepButton = document.createElement('button');
      keepButton.className = 'ratio-screenshot-button';
      keepButton.textContent = '保持此区域并继续';
      keepButton.addEventListener('click', () => {
        this.saveCurrentSelectionAsPreview();
        // 隐藏工具栏
        if (this.toolbar) {
          this.toolbar.style.display = 'none';
        }
        
        // 如果锁定了尺寸，记录当前尺寸
        if (this.isLockSize && this.lockedWidth === 0 && this.lockedHeight === 0) {
          this.lockedWidth = Math.abs(this.endX - this.startX);
          this.lockedHeight = Math.abs(this.endY - this.startY);
          console.log(`锁定截图尺寸: ${this.lockedWidth} × ${this.lockedHeight}`);
        }
      });
      
      // 取消按钮
      const cancelButton = document.createElement('button');
      cancelButton.className = 'ratio-screenshot-button';
      cancelButton.textContent = '取消';
      
      // 使用箭头函数确保this绑定正确
      const boundEndFunction = () => {
        console.log("取消按钮被点击");
        this.end();
      };
      
      // 直接绑定处理函数
      cancelButton.onclick = boundEndFunction;
      
      // 添加按钮到第一行
      if (this.isContinuousMode && this.selections.length > 0) {
        primaryRow.appendChild(saveAllButton);
      }
      primaryRow.appendChild(saveButton);
      primaryRow.appendChild(keepButton);
      primaryRow.appendChild(cancelButton);
      primaryRow.appendChild(shortcutInfo);
      
      // 创建第二行 - 配置选项
      const configRow = document.createElement('div');
      configRow.className = 'ratio-screenshot-toolbar-row';
      
      // 添加比例选择下拉菜单
      const ratioSelect = document.createElement('select');
      ratioSelect.className = 'ratio-screenshot-button';
      ratioSelect.title = '选择截图区域的比例';
      
      // 添加比例选项
      const ratioOptions = [
        { value: 'free', text: '自由比例' },
        { value: '16:9', text: '16:9 (视频/屏幕)' },
        { value: '4:3', text: '4:3 (传统屏幕)' },
        { value: '1:1', text: '1:1 (正方形/Instagram)' },
        { value: '9:16', text: '9:16 (手机竖屏/故事)' },
        { value: '3:4', text: '3:4 (小红书/iPad)' },
        { value: '2:1', text: '2:1 (小红书/Twitter横图)' },
        { value: '1:2', text: '1:2 (Pinterest)' },
        { value: '4:5', text: '4:5 (Instagram竖图)' },
        { value: '3:2', text: '3:2 (SNS封面)' },
        { value: '21:9', text: '21:9 (超宽屏)' }
      ];
      
      ratioOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.value === this.ratio) {
          optionElement.selected = true;
        }
        ratioSelect.appendChild(optionElement);
      });
      
      // 添加比例变化事件监听
      ratioSelect.addEventListener('change', () => {
        this.ratio = ratioSelect.value;
        console.log(`比例已更改为: ${this.ratio}`);
        
        // 如果有选择框，根据新比例重新调整大小
        if (this.selection) {
          this.adjustSelectionToRatio();
          
          // 更新工具栏标题显示最新的比例信息
          if (this.toolbar && this.toolbar.querySelector('h3')) {
            const title = this.toolbar.querySelector('h3');
            const width = Math.abs(this.endX - this.startX);
            const height = Math.abs(this.endY - this.startY);
            title.textContent = `${Math.round(width)} × ${Math.round(height)} 像素 (${this.ratio})`;
          }
        }
      });
      
      // 添加图像质量选择下拉菜单
      const qualitySelect = document.createElement('select');
      qualitySelect.className = 'ratio-screenshot-button';
      qualitySelect.title = '选择保存图片的质量';
      qualitySelect.style.minWidth = '85px'; // 设置最小宽度，使其不过大
      
      // 添加质量选项 - 使用更简洁的文本
      const qualityOptions = [
        { value: '1.0', text: '原图质量' },
        { value: '0.95', text: '高清' },
        { value: '0.85', text: '标准' },
        { value: '0.7', text: '轻量' }
      ];
      
      qualityOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        // 选择当前质量或最接近的一个
        if (Math.abs(parseFloat(option.value) - this.imageQuality) < 0.05) {
          optionElement.selected = true;
        }
        qualitySelect.appendChild(optionElement);
      });
      
      // 添加质量变化事件监听
      qualitySelect.addEventListener('change', () => {
        this.imageQuality = parseFloat(qualitySelect.value);
        console.log(`图片质量已更改为: ${this.imageQuality}`);
        
        // 估算文件大小 (基于当前选择框尺寸)
        let fileSize = "";
        if (this.selection) {
          const width = Math.abs(this.endX - this.startX);
          const height = Math.abs(this.endY - this.startY);
          const pixelCount = width * height;
          
          // 估算文件大小 (粗略计算)
          let estimatedSizeKB;
          if (this.saveFormat === 'png') {
            // PNG - 基于分辨率和质量的粗略估计
            estimatedSizeKB = (pixelCount * 0.2) / 1024 * this.imageQuality;
          } else {
            // JPG - 基于分辨率和质量的粗略估计
            estimatedSizeKB = (pixelCount * 0.08) / 1024 * this.imageQuality;
          }
          
          // 显示有意义的文件大小
          if (estimatedSizeKB > 1024) {
            fileSize = ` (约 ${(estimatedSizeKB / 1024).toFixed(1)} MB)`;
          } else {
            fileSize = ` (约 ${Math.round(estimatedSizeKB)} KB)`;
          }
        }
        
        // 显示质量信息和大小估计
        const qualityName = qualitySelect.options[qualitySelect.selectedIndex].textContent;
        this.showNotification(`图片质量已设置为: ${qualityName}${fileSize}`, 2000);
      });
      
      // 锁定尺寸切换按钮
      const lockSizeButton = document.createElement('button');
      lockSizeButton.className = this.isLockSize ? 
        'ratio-screenshot-button primary' : 'ratio-screenshot-button';
      lockSizeButton.textContent = this.isLockSize ? '✓ 锁定尺寸' : '锁定尺寸';
      lockSizeButton.title = '锁定当前尺寸用于连续截图';
      lockSizeButton.addEventListener('click', () => {
        this.isLockSize = !this.isLockSize;
        lockSizeButton.textContent = this.isLockSize ? '✓ 锁定尺寸' : '锁定尺寸';
        lockSizeButton.className = this.isLockSize ? 
          'ratio-screenshot-button primary' : 'ratio-screenshot-button';
        
        if (this.isLockSize) {
          // 记录当前的尺寸
          this.lockedWidth = Math.abs(this.endX - this.startX);
          this.lockedHeight = Math.abs(this.endY - this.startY);
          console.log(`锁定截图尺寸: ${this.lockedWidth} × ${this.lockedHeight}`);
        } else {
          // 清除锁定的尺寸
          this.lockedWidth = 0;
          this.lockedHeight = 0;
          console.log("解除尺寸锁定");
        }
      });
      
      // 磁性吸附切换按钮
      const magneticButton = document.createElement('button');
      magneticButton.className = this.isMagneticEnabled ? 
        'ratio-screenshot-button primary' : 'ratio-screenshot-button';
      magneticButton.textContent = this.isMagneticEnabled ? '✓ 磁性吸附' : '磁性吸附';
      magneticButton.title = '启用后会自动吸附到页面元素边缘';
      magneticButton.addEventListener('click', () => {
        this.isMagneticEnabled = !this.isMagneticEnabled;
        magneticButton.textContent = this.isMagneticEnabled ? '✓ 磁性吸附' : '磁性吸附';
        magneticButton.className = this.isMagneticEnabled ? 
          'ratio-screenshot-button primary' : 'ratio-screenshot-button';
        
        // 清除辅助线
        this.clearMagneticGuides();
      });
      
      // 添加选项到第二行
      configRow.appendChild(ratioSelect);
      configRow.appendChild(qualitySelect);
      
      // 只在连续模式下显示锁定尺寸和保持继续按钮
      if (this.isContinuousMode) {
        configRow.appendChild(lockSizeButton);
        primaryRow.appendChild(keepButton);
      }
      
      // 添加磁性吸附按钮到第二行
      configRow.appendChild(magneticButton);
      
      // 添加两行到工具栏
      this.toolbar.appendChild(primaryRow);
      this.toolbar.appendChild(configRow);
      
      // 添加提示信息
      const moveHint = document.createElement('div');
      moveHint.style.cssText = `
        color: #666;
        font-size: 12px;
        text-align: center;
        width: 100%;
        margin-top: 4px;
      `;
      // moveHint.textContent = '提示: 可拖动选择框调整位置';
      this.toolbar.appendChild(moveHint);
      
      document.body.appendChild(this.toolbar);
    }
    
    // 添加事件监听
    addEventListeners() {
      this.overlay.addEventListener('mousedown', this.handleMouseDown);
      document.addEventListener('keydown', this.handleKeyDown);
    }
    
    // 移除事件监听
    removeEventListeners() {
      if (this.overlay) {
        this.overlay.removeEventListener('mousedown', this.handleMouseDown);
      }
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
      document.removeEventListener('keydown', this.handleKeyDown);
    }
    
    // 处理鼠标按下
    handleMouseDown(e) {
      // 阻止默认行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
      
      // 隐藏工具栏（如果存在）
      if (this.toolbar) {
        this.toolbar.remove();
        this.toolbar = null;
      }
      
      this.isSelecting = true;
      
      // 重置磁性吸附状态
      this.lastMagneticPosition = null;
      
      // 获取鼠标在文档中的精确位置(包含滚动)
      const pageX = e.pageX;
      const pageY = e.pageY;
      
      // 记录当前页面滚动位置
      this.scrollX = window.scrollX;
      this.scrollY = window.scrollY;
      
      // 保存文档绝对坐标作为起始点
      this.startX = pageX;
      this.startY = pageY;
      
      console.log("开始选择截图区域，文档绝对坐标:", this.startX, this.startY, 
                  "滚动位置:", this.scrollX, this.scrollY);
      
      // 创建选择框(使用视口相对坐标)
      this.createSelection(e.clientX, e.clientY);
      
      // 添加事件监听
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
      window.addEventListener('scroll', this.handleScroll);
    }
    
    // 处理页面滚动
    handleScroll = (e) => {
      if (!this.isSelecting || !this.selection) return;
      
      // 记录新的滚动位置
      const newScrollX = window.scrollX;
      const newScrollY = window.scrollY;
      
      console.log("页面滚动，新滚动位置:", newScrollX, newScrollY);
      
      // 更新记录的滚动位置
      this.scrollX = newScrollX;
      this.scrollY = newScrollY;
      
      // 重新计算选择框在视口中的位置
      this.updateSelectionSize();
    }
    
    // 处理鼠标移动
    handleMouseMove(e) {
      if (!this.isSelecting) return;
      
      // 阻止默认行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
      
      // 获取鼠标在文档中的精确位置(包含滚动)
      const pageX = e.pageX;
      const pageY = e.pageY;
      
      // 如果启用了锁定尺寸并且已有记录的尺寸
      if (this.isLockSize && this.lockedWidth > 0 && this.lockedHeight > 0) {
        // 计算鼠标位置相对于起始点的方向
        const directionX = pageX >= this.startX ? 1 : -1;
        const directionY = pageY >= this.startY ? 1 : -1;
        
        // 使用锁定的尺寸计算结束点
        this.endX = this.startX + (directionX * this.lockedWidth);
        this.endY = this.startY + (directionY * this.lockedHeight);
        
        console.log("使用锁定尺寸:", this.lockedWidth, this.lockedHeight);
      } else {
        // 更新结束坐标(文档绝对坐标)
        let newEndX = pageX;
        let newEndY = pageY;
        let magneticAppliedX = false;
        let magneticAppliedY = false;
        
        // 应用磁性吸附效果
        if (this.isMagneticEnabled && !this.isLockSize) {
          // 计算选择框的边缘
          const selectionBox = {
            left: Math.min(this.startX, newEndX),
            top: Math.min(this.startY, newEndY),
            right: Math.max(this.startX, newEndX),
            bottom: Math.max(this.startY, newEndY)
          };
          
          // 每隔一段时间更新一次可能的磁性吸附目标
          if (!this.nearestEdges || e.timeStamp - (this._lastMagneticSearch || 0) > 200) {
            this._lastMagneticSearch = e.timeStamp;
            this.findNearestElementEdges(pageX, pageY);
          }
          
          // 应用磁性吸附调整坐标
          if (this.nearestEdges) {
            // 当用户正在向右/向下拖动时，优先吸附右/下边缘
            const isMovingRight = newEndX > this.startX;
            const isMovingDown = newEndY > this.startY;
            
            // 水平方向吸附
            if (this.nearestEdges.horizontal.length > 0) {
              for (const edge of this.nearestEdges.horizontal) {
                // 检查鼠标当前Y坐标是否在元素的垂直范围内(加一定容差)
                const isInVerticalRange = pageY >= edge.top - 30 && pageY <= edge.bottom + 30;
                
                // 检查是否为中心线类型的吸附点
                const isCenterPoint = edge.type === 'centerX';
                
                // 如果是中心线，使用不同的吸附判断逻辑
                if (isCenterPoint || isInVerticalRange) {
                  // 计算选择框中心
                  const selectionCenterX = (selectionBox.left + selectionBox.right) / 2;
                  
                  // 对中心线的吸附
                  if (isCenterPoint) {
                    const distToCenter = Math.abs(selectionCenterX - edge.x);
                    if (distToCenter < this.magneticThreshold) {
                      // 平滑吸附: 根据距离应用一定比例的吸附强度
                      const snapStrength = this.calculateSnapStrength(distToCenter);
                      // 计算新的endX，平滑过渡到目标位置
                      const halfWidth = (selectionBox.right - selectionBox.left) / 2;
                      const targetX = edge.x + (isMovingRight ? halfWidth : -halfWidth);
                      newEndX = this.applySmoothedPosition(newEndX, targetX, snapStrength);
                      this.showVerticalMagneticGuide(edge.x);
                      magneticAppliedX = true;
                      break;
                    }
                  } 
                  // 对左右边缘的吸附
                  else {
                    // 根据移动方向优先考虑不同的边缘
                    if (isMovingRight) {
                      // 判断右边缘的距离
                      const distToRight = Math.abs(selectionBox.right - edge.x);
                      if (distToRight < this.magneticThreshold) {
                        // 平滑吸附
                        const snapStrength = this.calculateSnapStrength(distToRight);
                        const targetX = edge.x - (this.startX - selectionBox.right);
                        newEndX = this.applySmoothedPosition(newEndX, targetX, snapStrength);
                        this.showVerticalMagneticGuide(edge.x);
                        magneticAppliedX = true;
                        break;
                      }
                    } else {
                      // 判断左边缘的距离
                      const distToLeft = Math.abs(selectionBox.left - edge.x);
                      if (distToLeft < this.magneticThreshold) {
                        // 平滑吸附
                        const snapStrength = this.calculateSnapStrength(distToLeft);
                        const targetX = edge.x - (this.startX - selectionBox.left);
                        newEndX = this.applySmoothedPosition(newEndX, targetX, snapStrength);
                        this.showVerticalMagneticGuide(edge.x);
                        magneticAppliedX = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
            
            // 垂直方向吸附
            if (this.nearestEdges.vertical.length > 0) {
              for (const edge of this.nearestEdges.vertical) {
                // 检查鼠标当前X坐标是否在元素的水平范围内(加一定容差)
                const isInHorizontalRange = pageX >= edge.left - 30 && pageX <= edge.right + 30;
                
                // 检查是否为中心线类型的吸附点
                const isCenterPoint = edge.type === 'centerY';
                
                // 如果是中心线，使用不同的吸附判断逻辑
                if (isCenterPoint || isInHorizontalRange) {
                  // 计算选择框中心
                  const selectionCenterY = (selectionBox.top + selectionBox.bottom) / 2;
                  
                  // 对中心线的吸附
                  if (isCenterPoint) {
                    const distToCenter = Math.abs(selectionCenterY - edge.y);
                    if (distToCenter < this.magneticThreshold) {
                      // 平滑吸附
                      const snapStrength = this.calculateSnapStrength(distToCenter);
                      const halfHeight = (selectionBox.bottom - selectionBox.top) / 2;
                      const targetY = edge.y + (isMovingDown ? halfHeight : -halfHeight);
                      newEndY = this.applySmoothedPosition(newEndY, targetY, snapStrength);
                      this.showHorizontalMagneticGuide(edge.y);
                      magneticAppliedY = true;
                      break;
                    }
                  } 
                  // 对上下边缘的吸附
                  else {
                    // 根据移动方向优先考虑不同的边缘
                    if (isMovingDown) {
                      // 判断下边缘的距离
                      const distToBottom = Math.abs(selectionBox.bottom - edge.y);
                      if (distToBottom < this.magneticThreshold) {
                        // 平滑吸附
                        const snapStrength = this.calculateSnapStrength(distToBottom);
                        const targetY = edge.y - (this.startY - selectionBox.bottom);
                        newEndY = this.applySmoothedPosition(newEndY, targetY, snapStrength);
                        this.showHorizontalMagneticGuide(edge.y);
                        magneticAppliedY = true;
                        break;
                      }
                    } else {
                      // 判断上边缘的距离
                      const distToTop = Math.abs(selectionBox.top - edge.y);
                      if (distToTop < this.magneticThreshold) {
                        // 平滑吸附
                        const snapStrength = this.calculateSnapStrength(distToTop);
                        const targetY = edge.y - (this.startY - selectionBox.top);
                        newEndY = this.applySmoothedPosition(newEndY, targetY, snapStrength);
                        this.showHorizontalMagneticGuide(edge.y);
                        magneticAppliedY = true;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          // 非磁性模式下，清除辅助线
          this.clearMagneticGuides();
        }
        
        // 应用比例约束 - 仅在非自由比例模式下应用
        if (this.ratio !== 'free') {
          try {
            const [widthRatio, heightRatio] = this.ratio.split(':').map(Number);
            
            if (widthRatio > 0 && heightRatio > 0) {
              // 在强制比例模式下，确定是根据X还是Y来计算另一维度
              // 如果已经应用了磁性吸附，根据吸附的维度决定
              if (magneticAppliedX && !magneticAppliedY) {
                // X方向已吸附，根据X计算Y
                const width = newEndX - this.startX;
                const height = width * (heightRatio / widthRatio);
                newEndY = this.startY + height;
              } else if (magneticAppliedY && !magneticAppliedX) {
                // Y方向已吸附，根据Y计算X
                const height = newEndY - this.startY;
                const width = height * (widthRatio / heightRatio);
                newEndX = this.startX + width;
              } else {
                // 默认根据X方向计算Y方向
                const width = newEndX - this.startX;
                const height = width * (heightRatio / widthRatio);
                newEndY = this.startY + height;
              }
            }
          } catch (error) {
            console.error("处理比例时出错:", error);
            // 出错时不应用约束
          }
        }
        
        // 更新结束坐标
        this.endX = newEndX;
        this.endY = newEndY;
      }
      
      // 更新选择框
      this.updateSelectionSize();
    }
    
    // 计算吸附强度 - 根据距离返回0到1之间的值，越近越强
    calculateSnapStrength(distance) {
      if (distance >= this.magneticThreshold) return 0;
      // 平滑过渡曲线: 1 - (distance/threshold)^2
      return Math.max(0, Math.min(1, this.magneticStrength * (1 - Math.pow(distance / this.magneticThreshold, 2))));
    }
    
    // 应用平滑过渡到吸附位置
    applySmoothedPosition(currentPos, targetPos, strength) {
      // 记录上一次位置用于防止跳跃
      if (!this.lastMagneticPosition) {
        this.lastMagneticPosition = currentPos;
      }
      
      // 平滑过渡: 当前位置和目标位置按强度加权平均
      let smoothedPosition = currentPos + (targetPos - currentPos) * strength;
      
      // 防止大幅跳跃: 如果新位置变化太大，限制变化量
      const maxJump = 5; // 最大跳跃距离
      const positionDelta = smoothedPosition - this.lastMagneticPosition;
      if (Math.abs(positionDelta) > maxJump) {
        smoothedPosition = this.lastMagneticPosition + (positionDelta > 0 ? maxJump : -maxJump);
      }
      
      // 更新上一次位置
      this.lastMagneticPosition = smoothedPosition;
      
      return smoothedPosition;
    }
    
    // 处理鼠标释放
    handleMouseUp(e) {
      if (!this.isSelecting) return;
      
      // 阻止默认行为和事件冒泡
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      this.isSelecting = false;
      console.log("完成选择截图区域，结束坐标:", this.endX, this.endY);
      
      // 移除滚动事件监听
      window.removeEventListener('scroll', this.handleScroll);
      
      // 重置磁性吸附状态
      this.lastMagneticPosition = null;
      
      // 检查选择框大小
      if (this.selection) {
        const rect = this.selection.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) {
          console.log("选择区域太小，忽略");
          this.clearCurrentSelection();
          return;
        }
      }
      
      // 添加调整大小的手柄
      this.addResizeHandles();
      
      // 创建工具栏
      this.createToolbar();
      
      // 移除鼠标移动和释放事件
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
      
      // 添加选择框移动功能
      this.makeSelectionMovable();
    }
    
    // 让选择框可移动
    makeSelectionMovable() {
      if (!this.selection) return;
      
      // 保存区域大小
      const width = Math.abs(this.endX - this.startX);
      const height = Math.abs(this.endY - this.startY);
      
      // 改变选择框的鼠标样式
      this.selection.style.cursor = 'move';
      
      // 添加移动事件监听
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let originalLeft = 0;
      let originalTop = 0;
      
      // 添加mousedown事件监听
      const onMouseDown = (e) => {
        // 阻止事件冒泡，避免触发overlay的mousedown事件
        e.stopPropagation();
        
        // 只有左键点击才响应
        if (e.button !== 0) return;
        
        isDragging = true;
        
        // 记录拖动起始位置（视口相对坐标）
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        // 记录选择框原始位置（视口相对坐标）
        const rect = this.selection.getBoundingClientRect();
        originalLeft = rect.left;
        originalTop = rect.top;
        
        // 添加mousemove和mouseup事件监听
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        // 防止选中文本等默认行为
        e.preventDefault();
      };
      
      // 添加mousemove事件监听
      const onMouseMove = (e) => {
        if (!isDragging) return;
        
        // 计算移动距离（视口相对坐标）
        const moveX = e.clientX - dragStartX;
        const moveY = e.clientY - dragStartY;
        
        // 计算新位置（视口相对坐标）
        const newLeft = originalLeft + moveX;
        const newTop = originalTop + moveY;
        
        // 更新选择框位置（视口相对坐标）
        this.selection.style.left = `${newLeft}px`;
        this.selection.style.top = `${newTop}px`;
        
        // 更新内部记录的坐标（文档绝对坐标）
        this.startX = newLeft + window.scrollX;
        this.startY = newTop + window.scrollY;
        this.endX = this.startX + width;
        this.endY = this.startY + height;
        
        // 阻止默认行为
        e.preventDefault();
      };
      
      // 添加mouseup事件监听
      const onMouseUp = (e) => {
        isDragging = false;
        
        // 移除事件监听
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        // 更新信息面板
        if (this.infoPanel) {
          // 更新信息内容 - 添加比例但简洁展示
          let infoText = `${Math.round(width)}×${Math.round(height)}`;
          
          // 如果不是自由比例，添加比例信息
          if (this.ratio && this.ratio !== 'free') {
            infoText += ` (${this.ratio})`;
          }
          
          this.infoPanel.textContent = infoText;
        }
      };
      
      // 绑定事件到选择框
      this.selection.addEventListener('mousedown', onMouseDown);
      
      // 记录句柄，以便后续清理
      this.selectionMoveHandler = onMouseDown;
      
      // 添加调整大小的控制点
      this.addResizeHandles();
    }
    
    // 添加调整大小的控制点
    addResizeHandles() {
      if (!this.selection) return;
      
      // 控制点位置
      const positions = [
        'top-left', 'top-right', 'bottom-left', 'bottom-right', 
        'top', 'right', 'bottom', 'left'
      ];
      
      // 创建控制点
      positions.forEach(position => {
        const handle = document.createElement('div');
        handle.className = `ratio-screenshot-resize-handle ${position}`;
        this.selection.appendChild(handle);
        
        // 添加事件监听
        handle.addEventListener('mousedown', (e) => {
          e.stopPropagation(); // 防止触发选择框的移动
          
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = Math.abs(this.endX - this.startX);
          const startHeight = Math.abs(this.endY - this.startY);
          
          // 记录初始坐标
          const initialStartX = this.startX;
          const initialStartY = this.startY;
          const initialEndX = this.endX;
          const initialEndY = this.endY;
          
          // 调整大小时的鼠标移动处理
          const onResize = (moveEvent) => {
            moveEvent.preventDefault();
            
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            // 根据控制点位置调整不同的边缘
            if (position.includes('left')) {
              this.startX = initialStartX + deltaX;
            } else if (position.includes('right')) {
              this.endX = initialEndX + deltaX;
            }
            
            if (position.includes('top')) {
              this.startY = initialStartY + deltaY;
            } else if (position.includes('bottom')) {
              this.endY = initialEndY + deltaY;
            }
            
            // 如果不是自由比例，应用比例约束
            if (this.ratio !== 'free') {
              try {
                const [widthRatio, heightRatio] = this.ratio.split(':').map(Number);
                
                if (widthRatio > 0 && heightRatio > 0) {
                  // 确定是哪个边被拖动
                  if (position.includes('top') || position.includes('bottom')) {
                    // 垂直边被拖动，根据高度计算宽度
                    const height = Math.abs(this.endY - this.startY);
                    const width = height * (widthRatio / heightRatio);
                    
                    // 根据拖动的边调整另一边的坐标
                    if (position.includes('left')) {
                      this.startX = this.endX - width * Math.sign(this.endX - initialStartX);
                    } else {
                      this.endX = this.startX + width * Math.sign(initialEndX - this.startX);
                    }
                  } else {
                    // 水平边被拖动，根据宽度计算高度
                    const width = Math.abs(this.endX - this.startX);
                    const height = width * (heightRatio / widthRatio);
                    
                    // 根据拖动的边调整另一边的坐标
                    if (position.includes('top')) {
                      this.startY = this.endY - height * Math.sign(this.endY - initialStartY);
                    } else {
                      this.endY = this.startY + height * Math.sign(initialEndY - this.startY);
                    }
                  }
                }
              } catch (error) {
                console.error("应用比例约束时出错:", error);
              }
            }
            
            // 更新选择框
            this.updateSelectionSize();
          };
          
          // 鼠标释放时的处理
          const onResizeEnd = () => {
            document.removeEventListener('mousemove', onResize);
            document.removeEventListener('mouseup', onResizeEnd);
            
            // 确保大小足够
            const width = Math.abs(this.endX - this.startX);
            const height = Math.abs(this.endY - this.startY);
            
            if (width < 10 || height < 10) {
              // 恢复到初始大小
              this.startX = initialStartX;
              this.startY = initialStartY;
              this.endX = initialEndX;
              this.endY = initialEndY;
              this.updateSelectionSize();
            }
          };
          
          document.addEventListener('mousemove', onResize);
          document.addEventListener('mouseup', onResizeEnd);
        });
      });
    }
    
    // 处理键盘事件
    handleKeyDown(e) {
      // 如果没有选择框，不处理键盘事件
      if (!this.selection) return;
      
      // ESC键取消
      if (e.key === 'Escape') {
        this.end();
        return;
      }
      
      // Enter键确认
      if (e.key === 'Enter') {
        this.captureAndSave();
        return;
      }
      
      // 箭头键移动选择框
      const moveStep = e.shiftKey ? 10 : 1; // 按住Shift键时移动更大步长
      let didMove = false;
      
      switch (e.key) {
        case 'ArrowUp':
          this.startY -= moveStep;
          this.endY -= moveStep;
          didMove = true;
          break;
        case 'ArrowDown':
          this.startY += moveStep;
          this.endY += moveStep;
          didMove = true;
          break;
        case 'ArrowLeft':
          this.startX -= moveStep;
          this.endX -= moveStep;
          didMove = true;
          break;
        case 'ArrowRight':
          this.startX += moveStep;
          this.endX += moveStep;
          didMove = true;
          break;
      }
      
      // 如果移动了选择框，更新显示
      if (didMove) {
        e.preventDefault(); // 防止页面滚动
        this.updateSelectionSize(this.startX, this.startY, this.endX, this.endY);
      }
    }
    
    // 更新选择框大小
    updateSelectionSize(startX, startY, endX, endY) {
      if (!this.selection) return;
      
      // 使用传入的参数或使用实例变量
      const x1 = startX !== undefined ? startX : this.startX;
      const y1 = startY !== undefined ? startY : this.startY;
      const x2 = endX !== undefined ? endX : this.endX;
      const y2 = endY !== undefined ? endY : this.endY;
      
      // 计算在文档中的绝对位置和尺寸
      const absLeft = Math.min(x1, x2);
      const absTop = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      
      // 转换为视口相对坐标(因为position:fixed是相对于视口的)
      const viewportLeft = absLeft - window.scrollX;
      const viewportTop = absTop - window.scrollY;
      
      // 更新选择框样式(使用视口相对坐标)
      this.selection.style.left = `${viewportLeft}px`;
      this.selection.style.top = `${viewportTop}px`;
      this.selection.style.width = `${width}px`;
      this.selection.style.height = `${height}px`;
      
      // 更新信息面板
      if (this.infoPanel) {
        // 更新信息内容 - 添加比例但简洁展示
        let infoText = `${Math.round(width)}×${Math.round(height)}`;
        
        // 如果不是自由比例，添加比例信息
        if (this.ratio && this.ratio !== 'free') {
          infoText += ` (${this.ratio})`;
        }
        
        this.infoPanel.textContent = infoText;
        
        // 智能定位信息面板，根据选择框位置自动调整
        // 检查屏幕边缘位置，避免信息面板超出屏幕范围
        const topSpace = viewportTop;
        const bottomSpace = window.innerHeight - (viewportTop + height);
        const leftSpace = viewportLeft;
        const rightSpace = window.innerWidth - (viewportLeft + width);
        
        // 重置之前可能设置的样式
        this.infoPanel.style.top = '';
        this.infoPanel.style.bottom = '';
        this.infoPanel.style.left = '';
        this.infoPanel.style.right = '';
        
        // 优先尝试放在底部，如果空间不足再考虑放在顶部
        if (bottomSpace >= 30) {
          this.infoPanel.style.bottom = '-25px';
        } else if (topSpace >= 30) {
          this.infoPanel.style.top = '-25px';
        } else {
          // 如果顶部和底部都没有足够空间，则放在选择框内的右下角
          this.infoPanel.style.bottom = '5px';
          this.infoPanel.style.right = '5px';
          // 增加背景不透明度，确保在内部时更容易阅读
          this.infoPanel.style.backgroundColor = 'rgba(24, 24, 27, 0.85)';
          return; // 内部显示时，不需要进一步调整水平位置
        }
        
        // 水平方向调整，优先放在左侧，如果空间不足考虑右侧
        if (leftSpace + width/2 >= this.infoPanel.offsetWidth/2) {
          // 居中或靠左放置
          this.infoPanel.style.left = '0';
          // 如果选择框很窄，可能需要移动到左侧中点
          if (width < this.infoPanel.offsetWidth) {
            this.infoPanel.style.left = `-${(this.infoPanel.offsetWidth - width) / 2}px`;
          }
        } else {
          // 放在右侧
          this.infoPanel.style.right = '0';
        }
      }
    }
    
    // 捕获并保存当前选择框
    captureAndSave() {
      if (!this.selection) {
        console.error("未找到选择框，无法截图");
        return;
      }
      
      console.log("开始捕获当前选择区域");
      
      // 使用我们跟踪的绝对坐标进行截图
      const captureRect = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };
      
      console.log("捕获区域坐标(绝对):", captureRect);
      
      // 捕获并保存这个区域
      this.captureArea(captureRect);
    }
    
    // 捕获指定区域
    captureArea(rect) {
      // 显示处理中提示
      const captureMsg = this.showNotification("正在处理截图...");
      
      // 获取当前的滚动位置和视口尺寸
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 记录截图时的环境信息，用于调试
      console.log("截图环境:", {
        "视口尺寸": { width: viewportWidth, height: viewportHeight },
        "滚动位置": { x: scrollX, y: scrollY },
        "设备像素比": window.devicePixelRatio,
        "选择区域": rect
      });
      
      // 计算选择区域的绝对坐标
      const absoluteRect = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY)
      };
      
      // 检查选择区域是否在视口范围内
      const isRectVisible = (
        absoluteRect.left >= scrollX && 
        absoluteRect.top >= scrollY && 
        absoluteRect.left + absoluteRect.width <= scrollX + viewportWidth &&
        absoluteRect.top + absoluteRect.height <= scrollY + viewportHeight
      );
      
      // 临时隐藏UI元素，确保截图不包含黑色蒙版和边框
      this.hideUIElementsForCapture();
      
      // 根据区域是否在当前视口内，选择不同的截图方法
      if (isRectVisible) {
        console.log("选择区域在当前视口内，使用标准截图方法");
        
        // 区域在视口内，使用常规方法截图
        chrome.runtime.sendMessage({ 
          action: 'captureScreen',
          debug: {
            scrollX: scrollX,
            scrollY: scrollY,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight
          }
        }, response => {
          this.processScreenshotResponse(response, absoluteRect, captureMsg);
        });
      } else {
        console.log("选择区域不在当前视口内，使用全页面截图方法");
        
        // 区域不在当前视口，使用新的全页面截图方法
        chrome.runtime.sendMessage({
          action: 'captureFullPage',
          targetArea: absoluteRect,
          debug: {
            scrollX: scrollX,
            scrollY: scrollY,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight
          }
        }, response => {
          this.processScreenshotResponse(response, absoluteRect, captureMsg, true);
        });
      }
    }
    
    // 处理截图响应的通用方法
    processScreenshotResponse(response, rect, captureMsg, isFullPageCapture = false) {
      // 恢复UI元素显示
      this.restoreUIElementsAfterCapture();
      
      // 移除提示
      if (captureMsg) captureMsg.remove();
      
      console.log("收到截图响应:", response?.success);
      
      if (response && response.success && response.dataUrl) {
        const image = new Image();
        
        image.onload = () => {
          console.log(`获取到截图，图像尺寸: ${image.width}x${image.height}`);
          
          // 如果是全页面截图，使用响应中的视口信息进行坐标计算
          const viewportInfo = isFullPageCapture ? response.viewportInfo : {
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            dpr: window.devicePixelRatio || 1
          };
          
          // 计算裁剪区域在截图中的相对位置
          const captureRect = {
            left: rect.left - viewportInfo.scrollX,
            top: rect.top - viewportInfo.scrollY,
            width: rect.width,
            height: rect.height
          };
          
          console.log("视口信息:", viewportInfo);
          console.log("计算的裁剪区域:", captureRect);
          
          // 检查是否需要缩放调整(处理设备像素比)
          const scaleX = image.width / viewportInfo.viewportWidth;
          const scaleY = image.height / viewportInfo.viewportHeight;
          
          console.log(`缩放比例: DPR=${viewportInfo.dpr}, 计算比例=${scaleX}x${scaleY}`);
          
          // 应用缩放到裁剪区域
          const scaledRect = {
            left: Math.round(captureRect.left * scaleX),
            top: Math.round(captureRect.top * scaleY),
            width: Math.round(captureRect.width * scaleX),
            height: Math.round(captureRect.height * scaleY)
          };
          
          console.log("最终裁剪区域坐标:", scaledRect);
          
          // 检查裁剪区域是否在图像范围内
          const isRectInImage = (
            scaledRect.left >= 0 && 
            scaledRect.top >= 0 && 
            scaledRect.left + scaledRect.width <= image.width &&
            scaledRect.top + scaledRect.height <= image.height
          );
          
          if (!isRectInImage) {
            console.warn("裁剪区域部分超出图像范围，尝试调整");
            this.processPartialVisibleImage(image, scaledRect);
          } else {
            // 处理和保存截图
            this.processAndSaveImage(image, scaledRect);
          }
          
          // 显示成功提示
          this.showNotification("截图已保存到下载文件夹", 2000);
          
          // 如果在连续模式下，不结束截图，而是清除当前选择框
          if (this.isContinuousMode) {
            this.clearCurrentSelection();
          } else {
            // 非连续模式下结束截图
            this.end();
          }
        };
        
        image.onerror = (error) => {
          console.error("图片加载失败:", error);
          this.showNotification("截图加载失败，请重试", 3000);
          this.end();
        };
        
        // 设置截图数据到图像对象
        image.src = response.dataUrl;
      } else {
        console.error("截图失败:", response?.error || '未知错误');
        this.showNotification("获取屏幕截图失败，请重试", 3000);
        this.end();
      }
    }
    
    // 捕获并保存所有选择区域
    captureAndSaveAll() {
      if (!this.selection) {
        console.error("未找到当前选择框");
        return;
      }
      
      console.log("开始捕获所有选择区域");
      
      // 显示处理中提示
      const captureMsg = this.showNotification("正在处理所有区域的截图...");
      
      // 获取当前选择框和所有保存的选择
      const currentSelection = {
        left: Math.min(this.startX, this.endX),
        top: Math.min(this.startY, this.endY),
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY),
        // 添加当前选择的比例信息
        ratio: this.ratio
      };
      
      const allAreas = [
        ...this.selections.map(s => s.rect),
        currentSelection
      ];
      
      // 临时隐藏UI元素，确保截图不包含黑色蒙版和边框
      this.hideUIElementsForCapture();
      
      // 按顺序处理每个区域
      this.processAreasSequentially(allAreas, 0, captureMsg);
    }
    
    // 递归处理所有区域
    processAreasSequentially(areas, index, captureMsg) {
      // 所有区域处理完成
      if (index >= areas.length) {
        // 恢复UI元素显示
        this.restoreUIElementsAfterCapture();
        captureMsg.remove();
        
        console.log("所有区域处理完成");
        this.showNotification(`成功保存了 ${areas.length} 个区域的截图`, 3000);
        
        // 结束截图
        this.end();
        return;
      }
      
      // 获取当前要处理的区域
      const area = areas[index];
      captureMsg.textContent = `正在处理区域 ${index+1}/${areas.length}...`;
      
      // 临时保存当前比例，并设置为当前区域的比例
      const originalRatio = this.ratio;
      if (area.ratio) {
        this.ratio = area.ratio;
        console.log(`临时设置比例为区域 ${index+1} 的保存比例: ${area.ratio}`);
      }
      
      // 获取当前的滚动位置和视口信息
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 检查区域是否在当前视口内
      const isAreaVisible = (
        area.left >= scrollX && 
        area.top >= scrollY && 
        area.left + area.width <= scrollX + viewportWidth &&
        area.top + area.height <= scrollY + viewportHeight
      );
      
      console.log(`处理区域 ${index+1}/${areas.length}`, area, isAreaVisible ? "在视口内" : "不在视口内");
      
      // 根据区域是否在视口内选择截图方法
      if (isAreaVisible) {
        chrome.runtime.sendMessage({ 
          action: 'captureScreen',
          debug: {
            scrollX: scrollX,
            scrollY: scrollY,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight
          }
        }, response => {
          if (response && response.success && response.dataUrl) {
            this.processAreaScreenshot(response, area, index, areas, captureMsg, false, originalRatio);
          } else {
            console.error(`区域 ${index+1} 截图失败:`, response?.error || '未知错误');
            // 恢复原始比例
            this.ratio = originalRatio;
            // 继续处理下一个区域
            this.processAreasSequentially(areas, index + 1, captureMsg);
          }
        });
      } else {
        chrome.runtime.sendMessage({
          action: 'captureFullPage',
          targetArea: area,
          debug: {
            scrollX: scrollX,
            scrollY: scrollY,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight
          }
        }, response => {
          if (response && response.success && response.dataUrl) {
            this.processAreaScreenshot(response, area, index, areas, captureMsg, true, originalRatio);
          } else {
            console.error(`区域 ${index+1} 全页面截图失败:`, response?.error || '未知错误');
            // 恢复原始比例
            this.ratio = originalRatio;
            // 继续处理下一个区域
            this.processAreasSequentially(areas, index + 1, captureMsg);
          }
        });
      }
    }
    
    // 处理区域截图
    processAreaScreenshot(response, area, index, areas, captureMsg, isFullPageCapture = false, originalRatio) {
      const image = new Image();
      
      image.onload = () => {
        console.log(`区域 ${index+1} 获取到截图，图像尺寸: ${image.width}x${image.height}`);
        
        // 如果是全页面截图，使用响应中的视口信息
        const viewportInfo = isFullPageCapture ? response.viewportInfo : {
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          dpr: window.devicePixelRatio || 1
        };
        
        // 计算裁剪区域在截图中的相对位置
        const captureRect = {
          left: area.left - viewportInfo.scrollX,
          top: area.top - viewportInfo.scrollY,
          width: area.width,
          height: area.height
        };
        
        // 检查是否需要缩放调整
        const scaleX = image.width / viewportInfo.viewportWidth;
        const scaleY = image.height / viewportInfo.viewportHeight;
        
        // 应用缩放到裁剪区域
        const scaledRect = {
          left: Math.round(captureRect.left * scaleX),
          top: Math.round(captureRect.top * scaleY),
          width: Math.round(captureRect.width * scaleX),
          height: Math.round(captureRect.height * scaleY)
        };
        
        console.log(`区域 ${index+1} 最终裁剪区域:`, scaledRect);
        
        try {
          // 处理和保存截图
          this.processAndSaveImage(image, scaledRect, index);
        } catch (error) {
          console.error(`区域 ${index+1} 处理失败:`, error);
        }
        
        // 恢复原始比例
        if (originalRatio) {
          this.ratio = originalRatio;
          console.log(`区域 ${index+1} 处理完成，恢复原始比例: ${originalRatio}`);
        }
        
        // 继续处理下一个区域
        setTimeout(() => {
          this.processAreasSequentially(areas, index + 1, captureMsg);
        }, 300); // 添加短暂延迟，避免浏览器限制
      };
      
      image.onerror = (error) => {
        console.error(`区域 ${index+1} 图片加载失败:`, error);
        
        // 恢复原始比例
        if (originalRatio) {
          this.ratio = originalRatio;
          console.log(`区域 ${index+1} 加载失败，恢复原始比例: ${originalRatio}`);
        }
        
        // 继续处理下一个区域
        this.processAreasSequentially(areas, index + 1, captureMsg);
      };
      
      // 设置图像源
      image.src = response.dataUrl;
    }
    
    // 处理部分可见的图像
    processPartialVisibleImage(image, rect) {
      console.log("尝试处理部分可见的图像区域");
      
      try {
        // 创建Canvas
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d', { alpha: false });
        
        if (!ctx) {
          console.error("无法获取Canvas上下文");
          return;
        }
        
        // 填充白色背景
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 计算可见的部分
        const visiblePart = {
          left: Math.max(0, rect.left),
          top: Math.max(0, rect.top),
          right: Math.min(image.width, rect.left + rect.width),
          bottom: Math.min(image.height, rect.top + rect.height)
        };
        
        // 计算可见部分的宽度和高度
        const visibleWidth = visiblePart.right - visiblePart.left;
        const visibleHeight = visiblePart.bottom - visiblePart.top;
        
        // 如果可见部分太小，报错提示
        if (visibleWidth < 10 || visibleHeight < 10) {
          console.error("可见部分太小，无法截图");
          this.showNotification("选定区域几乎完全在可见范围外，无法截图", 3000);
          return;
        }
        
        // 计算可见部分在canvas中的位置
        const canvasX = visiblePart.left - rect.left;
        const canvasY = visiblePart.top - rect.top;
        
        console.log("绘制可见部分:", {
          source: {
            x: visiblePart.left,
            y: visiblePart.top,
            width: visibleWidth,
            height: visibleHeight
          },
          destination: {
            x: canvasX,
            y: canvasY,
            width: visibleWidth,
            height: visibleHeight
          }
        });
        
        // 只绘制可见部分
        ctx.drawImage(
          image,
          visiblePart.left, visiblePart.top, visibleWidth, visibleHeight,
          canvasX, canvasY, visibleWidth, visibleHeight
        );
        
        // 转换为图像数据并保存，使用用户设置的质量
        const dataUrl = canvas.toDataURL(
          this.saveFormat === 'jpg' ? 'image/jpeg' : 'image/png', 
          this.imageQuality
        );
        this.saveImageToFile(dataUrl, this.saveFormat);
        
        // 显示部分可见的提示
        this.showNotification("部分区域超出可视范围，已截取可见部分", 3000);
        
        // 如果在连续模式下，不结束截图，而是清除当前选择框
        if (this.isContinuousMode) {
          this.clearCurrentSelection();
        } else {
          // 非连续模式下结束截图
          this.end();
        }
      } catch (error) {
        console.error("处理部分可见图像时出错:", error);
        this.showNotification(`截图处理时出错: ${error.message}`, 3000);
        this.end();
      }
    }
    
    // 处理并保存图像
    processAndSaveImage(image, rect, index = 0) {
      console.log(`处理区域 ${index+1}/${this.selections.length+1}，最终裁剪坐标:`, rect);
      
      try {
        // 创建Canvas并裁剪图像
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        // 设置不透明背景以确保图像质量
        const ctx = canvas.getContext('2d', { alpha: false });
        
        if (!ctx) {
          console.error("无法获取Canvas上下文");
          return;
        }
        
        // 填充白色背景
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        console.log(`从原图(${image.width}x${image.height})裁剪区域:`, rect);
        console.log(`使用图片质量: ${this.imageQuality}`);
        
        // 确保裁剪区域在图像范围内
        if (rect.left >= 0 && rect.top >= 0 && 
            rect.left + rect.width <= image.width && 
            rect.top + rect.height <= image.height) {
            
          // 绘制裁剪区域
          ctx.drawImage(
            image,
            rect.left, rect.top, rect.width, rect.height,
            0, 0, rect.width, rect.height
          );
          
          // 转换为图像数据并保存 - 使用用户指定的质量
          const dataUrl = canvas.toDataURL(
            this.saveFormat === 'jpg' ? 'image/jpeg' : 'image/png', 
            this.imageQuality
          );
          this.saveImageToFile(dataUrl, this.saveFormat, index);
        } else {
          console.warn("裁剪区域超出可见范围，尝试调整坐标");
          
          // 计算有效的裁剪区域
          const validLeft = Math.max(0, Math.round(rect.left));
          const validTop = Math.max(0, Math.round(rect.top));
          const validRight = Math.min(image.width, Math.round(rect.left + rect.width));
          const validBottom = Math.min(image.height, Math.round(rect.top + rect.height));
          const validWidth = validRight - validLeft;
          const validHeight = validBottom - validTop;
          
          if (validWidth > 0 && validHeight > 0) {
            // 计算有效区域在画布上的位置（以保持相对位置）
            const canvasX = validLeft - rect.left;
            const canvasY = validTop - rect.top;
            
            console.log("调整后的有效区域:", {
              source: { x: validLeft, y: validTop, width: validWidth, height: validHeight },
              destination: { x: canvasX, y: canvasY, width: validWidth, height: validHeight }
            });
            
            // 绘制有效区域到相应的画布位置
            ctx.drawImage(
              image,
              validLeft, validTop, validWidth, validHeight,
              canvasX, canvasY, validWidth, validHeight
            );
            
            // 转换为图像数据并保存 - 使用用户指定的质量
            const dataUrl = canvas.toDataURL(
              this.saveFormat === 'jpg' ? 'image/jpeg' : 'image/png', 
              this.imageQuality
            );
            this.saveImageToFile(dataUrl, this.saveFormat, index);
            
            // 仅当有效区域明显小于所选区域时提示用户
            if (validWidth < rect.width * 0.8 || validHeight < rect.height * 0.8) {
              this.showNotification("部分选择区域超出可见范围，已截取可见部分", 3000);
            }
          } else {
            console.error("无法裁剪图像，选定区域完全在可见范围之外");
            this.showNotification("选定区域超出可见范围，无法截图。请滚动页面使该区域可见后再试。", 3000);
          }
        }
      } catch (error) {
        console.error("处理图像时出错:", error, error.stack);
        this.showNotification(`截图处理时出错: ${error.message}`, 3000);
      }
    }
    
    // 保存图像到文件
    saveImageToFile(dataUrl, format, index = 0) {
      // 添加序号到文件名
      const filenameSuffix = this.selections.length > 0 ? `-${index+1}` : '';
      
      console.log(`保存图像 ${index+1}，数据大小: ${dataUrl.length}`);
      
      chrome.runtime.sendMessage({
        action: 'saveScreenshot',
        dataUrl: dataUrl,
        format: format,
        suffix: filenameSuffix
      }, saveResponse => {
        if (saveResponse && saveResponse.success) {
          console.log(`区域 ${index+1} 保存成功`);
        } else {
          console.error(`区域 ${index+1} 保存失败:`, saveResponse?.error || '未知错误');
          this.showNotification(`保存截图失败: ${saveResponse?.error || '未知错误'}`, 3000);
        }
      });
    }
    
    // 启动新选择流程（用于创建新的选择框）
    startNewSelection() {
      // 如果有锁定的尺寸，在创建新选择框时展示提示
      if (this.isLockSize && this.lockedWidth > 0 && this.lockedHeight > 0) {
        const sizeHint = document.createElement('div');
        sizeHint.className = 'ratio-screenshot-notification';
        sizeHint.textContent = `已锁定尺寸: ${this.lockedWidth} × ${this.lockedHeight}，点击确定选择位置`;
        document.body.appendChild(sizeHint);
        
        // 3秒后自动隐藏提示
        setTimeout(() => {
          sizeHint.style.opacity = '0';
          sizeHint.style.transition = 'opacity 0.5s';
          setTimeout(() => sizeHint.remove(), 500);
        }, 3000);
      }
    }
    
    // 查找鼠标附近元素的边缘
    findNearestElementEdges(mouseX, mouseY) {
      // 创建一个结果对象，存储水平和垂直边缘
      const edges = {
        horizontal: [], // 存储水平边缘 (top, bottom)
        vertical: []    // 存储垂直边缘 (left, right)
      };
      
      // 查找搜索范围内的元素 - 减小搜索半径使吸附更准确
      const searchRadius = 50; // 减小搜索半径
      const elements = this.getElementsNearPoint(mouseX, mouseY, searchRadius);
      
      // 分析每个元素的边缘
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        
        // 转换为文档绝对坐标
        const absoluteRect = {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          right: rect.right + window.scrollX,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          height: rect.height
        };
        
        // 只考虑有实际可见大小的元素，忽略太小的元素
        if (absoluteRect.width < 10 || absoluteRect.height < 10) continue;
        
        // 添加水平边缘 (left, right)
        edges.horizontal.push({
          x: absoluteRect.left,
          top: absoluteRect.top,
          bottom: absoluteRect.bottom,
          element: element,
          type: 'left'
        });
        
        edges.horizontal.push({
          x: absoluteRect.right,
          top: absoluteRect.top,
          bottom: absoluteRect.bottom,
          element: element,
          type: 'right'
        });
        
        // 添加水平中心线
        const centerX = absoluteRect.left + (absoluteRect.width / 2);
        edges.horizontal.push({
          x: centerX,
          top: absoluteRect.top,
          bottom: absoluteRect.bottom,
          element: element,
          type: 'centerX'
        });
        
        // 添加垂直边缘 (top, bottom)
        edges.vertical.push({
          y: absoluteRect.top,
          left: absoluteRect.left,
          right: absoluteRect.right,
          element: element,
          type: 'top'
        });
        
        edges.vertical.push({
          y: absoluteRect.bottom,
          left: absoluteRect.left,
          right: absoluteRect.right,
          element: element,
          type: 'bottom'
        });
        
        // 添加垂直中心线
        const centerY = absoluteRect.top + (absoluteRect.height / 2);
        edges.vertical.push({
          y: centerY,
          left: absoluteRect.left,
          right: absoluteRect.right,
          element: element,
          type: 'centerY'
        });
      }
      
      // 根据到鼠标的距离排序边缘
      edges.horizontal.sort((a, b) => Math.abs(mouseX - a.x) - Math.abs(mouseX - b.x));
      edges.vertical.sort((a, b) => Math.abs(mouseY - a.y) - Math.abs(mouseY - b.y));
      
      // 保留最近的几个边缘，减少选择干扰
      this.nearestEdges = {
        horizontal: edges.horizontal.slice(0, 3),
        vertical: edges.vertical.slice(0, 3)
      };
    }
    
    // 获取鼠标附近的元素
    getElementsNearPoint(x, y, radius) {
      const elements = [];
      const centerX = x;
      const centerY = y;
      
      // 查找视口内的所有可见元素
      const allElements = document.querySelectorAll('*');
      
      for (const element of allElements) {
        // 跳过我们自己的界面元素
        if (element.id === 'ratio-screenshot-overlay' || 
            element.id === 'ratio-screenshot-selection' ||
            element.id === 'ratio-screenshot-toolbar' ||
            element.classList.contains('ratio-screenshot-selection-saved') ||
            element.classList.contains('ratio-screenshot-magnetic-guide') ||
            element.classList.contains('ratio-screenshot-element-highlight')) {
          continue;
        }
        
        // 跳过不可见元素
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          continue;
        }
        
        const rect = element.getBoundingClientRect();
        
        // 转换为文档绝对坐标
        const absoluteRect = {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          right: rect.right + window.scrollX,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          height: rect.height
        };
        
        // 检查元素是否在搜索半径内
        if (absoluteRect.left <= centerX + radius && 
            absoluteRect.right >= centerX - radius && 
            absoluteRect.top <= centerY + radius && 
            absoluteRect.bottom >= centerY - radius) {
          elements.push(element);
        }
      }
      
      return elements;
    }
    
    // 显示水平磁性辅助线
    showHorizontalMagneticGuide(y) {
      // 清除之前的水平辅助线
      this.clearMagneticGuides('horizontal');
      
      // 创建新的水平辅助线 - 但实际不会显示因为CSS已设置opacity为0
      const guide = document.createElement('div');
      guide.className = 'ratio-screenshot-magnetic-guide horizontal';
      guide.style.top = `${y - window.scrollY}px`; // 注意转换为视口坐标
      
      document.body.appendChild(guide);
      this.magneticGuides.horizontal = guide;
      
      // 不再添加闪烁动画效果，因为已经隐藏了辅助线
    }
    
    // 显示垂直磁性辅助线
    showVerticalMagneticGuide(x) {
      // 清除之前的垂直辅助线
      this.clearMagneticGuides('vertical');
      
      // 创建新的垂直辅助线 - 但实际不会显示因为CSS已设置opacity为0
      const guide = document.createElement('div');
      guide.className = 'ratio-screenshot-magnetic-guide vertical';
      guide.style.left = `${x - window.scrollX}px`; // 注意转换为视口坐标
      
      document.body.appendChild(guide);
      this.magneticGuides.vertical = guide;
      
      // 不再添加闪烁动画效果，因为已经隐藏了辅助线
    }
    
    // 清除磁性辅助线
    clearMagneticGuides(type = 'all') {
      if (type === 'all' || type === 'horizontal') {
        if (this.magneticGuides.horizontal) {
          this.magneticGuides.horizontal.remove();
          this.magneticGuides.horizontal = null;
        }
      }
      
      if (type === 'all' || type === 'vertical') {
        if (this.magneticGuides.vertical) {
          this.magneticGuides.vertical.remove();
          this.magneticGuides.vertical = null;
        }
      }
    }
    
    // 结束截图流程
    end() {
      console.log("结束截图流程");
      
      // 移除事件监听器
      this.removeEventListeners();
      
      // 清除当前选择框
      this.clearCurrentSelection();
      
      // 清除磁性辅助线
      this.clearMagneticGuides();
      
      // 清除所有已保存的选择预览
      this.selections.forEach(selection => {
        if (selection.element) {
          selection.element.remove();
        }
      });
      
      // 重置状态
      this.isActive = false;
      this.isSelecting = false;
      this.startX = 0;
      this.startY = 0;
      this.endX = 0;
      this.endY = 0;
      this.isLockSize = false;
      this.lockedWidth = 0;
      this.lockedHeight = 0;
      this.nearestEdges = null;
      
      try {
        // 清理所有DOM元素 - 使用安全的方式进行
        this.safeRemove('ratio-screenshot-overlay');
        this.safeRemove('ratio-screenshot-selection');
        this.safeRemove('ratio-screenshot-toolbar');
        
        // 清理所有类名元素
        this.safeRemoveAll('.ratio-screenshot-magnetic-guide');
        this.safeRemoveAll('.ratio-screenshot-element-highlight');
        this.safeRemoveAll('.ratio-screenshot-resize-handle');
        this.safeRemoveAll('.ratio-screenshot-selection-saved');
        this.safeRemoveAll('.ratio-screenshot-notification');
        
        // 清空引用
        this.overlay = null;
        this.selection = null;
        this.infoPanel = null;
        this.toolbar = null;
        this.selections = [];
        
        console.log("截图流程已结束，所有资源已清理");
      } catch (error) {
        console.error("清理资源时出错:", error);
        
        // 即使出错也尝试强制清理
        this.cleanupExistingElements();
      }
    }
    
    // 安全移除单个元素
    safeRemove(id) {
      try {
        const element = document.getElementById(id);
        if (element) {
          element.remove();
        }
      } catch (e) {
        console.warn(`移除元素 ${id} 时出错:`, e);
      }
    }
    
    // 安全移除多个元素
    safeRemoveAll(selector) {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.remove();
        });
      } catch (e) {
        console.warn(`移除选择器 ${selector} 的元素时出错:`, e);
      }
    }
    
    // 根据比例调整选择框大小
    adjustSelectionToRatio() {
      if (!this.selection || this.ratio === 'free') return;
      
      try {
        // 解析比例
        const [widthRatio, heightRatio] = this.ratio.split(':').map(Number);
        
        if (widthRatio > 0 && heightRatio > 0) {
          // 获取当前选择框的中心点
          const centerX = (this.startX + this.endX) / 2;
          const centerY = (this.startY + this.endY) / 2;
          
          // 计算当前宽度和高度
          const currentWidth = Math.abs(this.endX - this.startX);
          const currentHeight = Math.abs(this.endY - this.startY);
          
          // 决定是根据宽度还是高度来调整 - 保持较大的尺寸不变
          let newWidth, newHeight;
          
          if (currentWidth / currentHeight > widthRatio / heightRatio) {
            // 当前更宽，保持宽度不变，调整高度
            newWidth = currentWidth;
            newHeight = currentWidth * (heightRatio / widthRatio);
          } else {
            // 当前更高，保持高度不变，调整宽度
            newHeight = currentHeight;
            newWidth = currentHeight * (widthRatio / heightRatio);
          }
          
          // 从中心点计算新的起始点和结束点
          const halfWidth = newWidth / 2;
          const halfHeight = newHeight / 2;
          
          // 确定起始点和结束点的方向
          const directionX = this.endX >= this.startX ? 1 : -1;
          const directionY = this.endY >= this.startY ? 1 : -1;
          
          // 更新起始点和结束点，保持相对方向不变
          this.startX = centerX - halfWidth * directionX;
          this.startY = centerY - halfHeight * directionY;
          this.endX = centerX + halfWidth * directionX;
          this.endY = centerY + halfHeight * directionY;
          
          console.log(`根据比例 ${this.ratio} 调整选择框大小为 ${newWidth} × ${newHeight}`);
          
          // 更新选择框显示
          this.updateSelectionSize();
          
          // 更新信息面板
          if (this.infoPanel) {
            this.infoPanel.textContent = `${Math.round(newWidth)} × ${Math.round(newHeight)} (${this.ratio})`;
          }
        }
      } catch (error) {
        console.error("调整选择框比例时出错:", error);
      }
    }
    
    // 临时隐藏截图工具UI元素，确保不会出现在截图中
    hideUIElementsForCapture() {
      console.log("临时隐藏UI元素以进行截图");
      
      // 保存原始可见性状态以便恢复
      this.originalOverlayVisibility = this.overlay ? this.overlay.style.visibility : null;
      this.originalSelectionVisibility = this.selection ? this.selection.style.visibility : null;
      this.originalToolbarVisibility = this.toolbar ? this.toolbar.style.visibility : null;
      
      // 隐藏所有相关UI元素
      if (this.overlay) this.overlay.style.visibility = 'hidden';
      if (this.selection) this.selection.style.visibility = 'hidden';
      if (this.toolbar) this.toolbar.style.visibility = 'hidden';
      
      // 隐藏所有通知消息
      const notifications = document.querySelectorAll('.ratio-screenshot-notification');
      this.hiddenNotifications = [];
      notifications.forEach(notification => {
        this.hiddenNotifications.push({
          element: notification,
          originalVisibility: notification.style.visibility
        });
        notification.style.visibility = 'hidden';
      });
      
      // 隐藏所有已保存的选择预览
      this.selections.forEach(selection => {
        if (selection.element) {
          selection.originalVisibility = selection.element.style.visibility;
          selection.element.style.visibility = 'hidden';
        }
      });
    }
    
    // 恢复UI元素的可见性
    restoreUIElementsAfterCapture() {
      console.log("恢复UI元素可见性");
      
      // 恢复UI元素可见性
      if (this.overlay && this.originalOverlayVisibility !== null) {
        this.overlay.style.visibility = this.originalOverlayVisibility;
      }
      
      if (this.selection && this.originalSelectionVisibility !== null) {
        this.selection.style.visibility = this.originalSelectionVisibility;
      }
      
      if (this.toolbar && this.originalToolbarVisibility !== null) {
        this.toolbar.style.visibility = this.originalToolbarVisibility;
      }
      
      // 恢复通知消息的可见性
      if (this.hiddenNotifications && this.hiddenNotifications.length > 0) {
        this.hiddenNotifications.forEach(item => {
          if (item.element) {
            item.element.style.visibility = item.originalVisibility;
          }
        });
        this.hiddenNotifications = [];
      }
      
      // 恢复所有已保存的选择预览
      this.selections.forEach(selection => {
        if (selection.element && selection.originalVisibility !== undefined) {
          selection.element.style.visibility = selection.originalVisibility;
        }
      });
    }
    
    // 显示自动消失的通知
    showNotification(message, duration = 3000) {
      // 移除现有通知
      const existingNotifications = document.querySelectorAll('.ratio-screenshot-notification');
      existingNotifications.forEach(notification => notification.remove());
      
      // 创建新通知
      const notification = document.createElement('div');
      notification.className = 'ratio-screenshot-notification';
      notification.textContent = message;
      notification.style.bottom = '20px';
      notification.style.top = 'auto';
      
      document.body.appendChild(notification);
      
      // 设置自动消失
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        
        // 完全移除元素
        setTimeout(() => notification.remove(), 500);
      }, duration);
      
      return notification;
    }
  }

  // 创建截图工具实例
  ratioScreenshotInstance = new RatioScreenshot();
} 

// 同时保留向后兼容性
window.ratioScreenshot = ratioScreenshotInstance;