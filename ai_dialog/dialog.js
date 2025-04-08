// AI对话界面处理逻辑
(function() {
    // GLM-4V API配置
    const API_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const API_KEY = '4874bbba77e241b09519b2054b93c497.lC99I4wmPzm9yxxT'; // 使用config.local.js中的默认值
    
    // DeepSeek API配置
    const DEEPSEEK_API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
    const DEEPSEEK_API_KEY = ''; // 需要替换为实际的API密钥
    
    // 页面元素
    const dialogImage = document.getElementById('dialog-image');
    const imageSizeElement = document.getElementById('image-size');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const closeButton = document.getElementById('close-dialog');
    const templateToggle = document.getElementById('show-templates');
    const templateDropdown = document.getElementById('template-dropdown');
    const templateItems = document.querySelectorAll('.template-item');
    const enhancedModeToggle = document.getElementById('enhanced-mode-toggle');
    
    // 存储图像的base64数据
    let imageBase64 = '';
    let isLoading = false;
    let isEnhancedMode = false;
    let isStreaming = false; // 新增：标记是否正在接收流式响应
    let currentStreamMessageElement = null; // 新增：当前正在更新的消息元素
    
    // 对话上下文历史
    let chatHistory = [];
    // 存储图像描述结果（用于增强模式）
    let imageDescription = '';
    
    // 配置Marked选项
    const markedOptions = {
        breaks: true,     // 允许换行符转换为<br>
        gfm: true,        // 使用GitHub风格的Markdown
        headerIds: false, // 不自动生成header IDs
        mangle: false,    // 不转义自动链接的邮箱地址
        smartLists: true  // 使用更智能的列表行为
    };
    
    // 初始化
    function init() {
        // 添加页面加载动画效果
        document.body.classList.add('loaded');
        
        // 配置marked选项
        if (typeof marked !== 'undefined') {
            marked.setOptions(markedOptions);
        }
        
        // 从URL获取图像数据
        const urlParams = new URLSearchParams(window.location.search);
        const imageData = urlParams.get('image');
        
        if (imageData) {
            imageBase64 = imageData;
            loadImage(imageBase64);
            
            // 添加欢迎消息
            setTimeout(() => {
                addMessage("你好！我已经看到了这张图片。请问有什么可以帮助你的？", 'ai');
            }, 500);
        }
        
        // 添加事件监听
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // 输入框自动调整高度
        userInput.addEventListener('input', autoResizeTextarea);
        
        closeButton.addEventListener('click', function() {
            window.close();
        });
        
        // 对话增强模式切换
        enhancedModeToggle.addEventListener('change', function() {
            isEnhancedMode = this.checked;
            // 当切换到增强模式时，显示提示消息
            if (isEnhancedMode) {
                addMessage("已切换到对话增强模式。该模式结合图像识别和高级对话能力，提供更连贯的交流体验。", 'ai');
                
                // 如果已经有图片但还没有描述，则获取图片描述
                if (imageBase64 && !imageDescription) {
                    getInitialImageDescription();
                }
            } else {
                addMessage("已切换到标准模式。", 'ai');
                // 在标准模式下重置聊天历史
                chatHistory = [];
            }
        });
        
        // 模板下拉菜单的事件监听
        templateToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            
            // 切换显示状态前计算位置
            if (!templateDropdown.classList.contains('show')) {
                positionDropdown();
            }
            
            templateDropdown.classList.toggle('show');
            
            if (templateDropdown.classList.contains('show')) {
                // 添加动画效果类
                templateDropdown.querySelectorAll('.template-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            } else {
                // 重置样式
                templateDropdown.querySelectorAll('.template-item').forEach(item => {
                    item.style.opacity = '';
                    item.style.transform = '';
                });
            }
        });
        
        // 点击外部区域关闭下拉菜单
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.prompt-templates')) {
                templateDropdown.classList.remove('show');
                // 重置样式
                templateDropdown.querySelectorAll('.template-item').forEach(item => {
                    item.style.opacity = '';
                    item.style.transform = '';
                });
            }
        });
        
        // 为每个模板项添加点击事件
        templateItems.forEach(item => {
            // 初始化样式
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            
            item.addEventListener('click', function() {
                const template = this.getAttribute('data-template');
                userInput.value = template;
                templateDropdown.classList.remove('show');
                userInput.focus();
                autoResizeTextarea.call(userInput);
            });
        });
        
        // 添加监听器接收流式响应更新
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            // 处理流式更新
            if (message.action === 'streamUpdate') {
                handleStreamUpdate(message.content);
                sendResponse({ received: true });
            }
            // 处理流式响应完成
            else if (message.action === 'streamComplete') {
                handleStreamComplete(message.content);
                sendResponse({ received: true });
            }
            // 处理流式响应错误
            else if (message.action === 'streamError') {
                handleStreamError(message.error);
                sendResponse({ received: true });
            }
            return true;
        });
    }
    
    // 获取初始图像描述（用于增强模式）
    function getInitialImageDescription() {
        // 显示加载指示器
        showLoadingIndicator();
        isLoading = true;
        
        // 调用GLM-4V-Flash API获取图像描述
        chrome.runtime.sendMessage({
            action: 'callGLM4VFlashAPI',
            message: "请详细描述这张图片的内容，包括可见的文本、图表、UI元素以及其他关键信息。",
            image: imageBase64
        }, function(response) {
            isLoading = false;
            hideLoadingIndicator();
            
            if (response && response.success) {
                // 保存图像描述，但不显示在对话框中
                imageDescription = response.aiResponse;
                console.log("已获取图像初始描述用于增强模式");
            } else {
                // 显示错误信息
                const errorMsg = response?.error || '无法获取图像描述，增强模式可能受限';
                showWarning(errorMsg);
            }
        });
    }
    
    // 文本区域自动调整高度
    function autoResizeTextarea() {
        this.style.height = 'auto';
        const newHeight = Math.min(this.scrollHeight, 150); // 设置最大高度为150px
        this.style.height = newHeight + 'px';
    }
    
    // 加载图像并显示
    function loadImage(base64Data) {
        if (!base64Data.startsWith('data:image')) {
            base64Data = 'data:image/png;base64,' + base64Data;
        }
        
        dialogImage.src = base64Data;
        
        // 添加图像加载动画
        dialogImage.style.opacity = '0';
        dialogImage.onload = function() {
            dialogImage.style.opacity = '1';
        };
        
        // 计算图像大小
        const imageSize = calculateImageSize(base64Data);
        imageSizeElement.textContent = formatFileSize(imageSize);
        
        // 检查图像大小是否超过5MB
        if (imageSize > 5 * 1024 * 1024) {
            showWarning('图像大小超过5MB，可能无法正常处理。请考虑使用更小的图像。');
            
            // 自动压缩图像
            resizeImage(base64Data, function(resizedBase64) {
                imageBase64 = resizedBase64.split(',')[1]; // 移除data:image/png;base64,前缀
                dialogImage.src = resizedBase64;
                
                const newSize = calculateImageSize(resizedBase64);
                imageSizeElement.textContent = formatFileSize(newSize) + ' (已压缩)';
                
                // 如果在增强模式下，获取图像描述
                if (isEnhancedMode && !imageDescription) {
                    getInitialImageDescription();
                }
            });
        } else {
            // 确保base64不包含前缀
            if (base64Data.includes(',')) {
                imageBase64 = base64Data.split(',')[1];
            }
            
            // 如果在增强模式下，获取图像描述
            if (isEnhancedMode && !imageDescription) {
                getInitialImageDescription();
            }
        }
    }
    
    // 计算base64图像大小
    function calculateImageSize(base64String) {
        // 移除前缀
        if (base64String.includes(',')) {
            base64String = base64String.split(',')[1];
        }
        
        // 计算base64字符串对应的二进制大小 (每4个base64字符约对应3个字节)
        return Math.floor(base64String.length * 0.75);
    }
    
    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
    }
    
    // 压缩图像
    function resizeImage(base64Data, callback) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // 计算新尺寸，保持图像比例，但确保大小在5MB以下
            const maxSize = Math.max(width, height);
            let scale = 1;
            
            if (maxSize > 2000) {
                scale = 2000 / maxSize;
                width *= scale;
                height *= scale;
            }
            
            canvas.width = Math.floor(width);
            canvas.height = Math.floor(height);
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 使用较低质量进行压缩
            const quality = 0.7;
            const resizedBase64 = canvas.toDataURL('image/jpeg', quality);
            
            callback(resizedBase64);
        };
        
        img.src = base64Data;
    }
    
    // 显示警告信息
    function showWarning(message) {
        const warningElement = document.createElement('div');
        warningElement.className = 'message ai-message warning-message';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-icons';
        iconSpan.textContent = 'warning';
        
        const messageText = document.createElement('span');
        messageText.textContent = message;
        
        warningElement.appendChild(iconSpan);
        warningElement.appendChild(document.createTextNode(' '));
        warningElement.appendChild(messageText);
        
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        messageContainer.appendChild(warningElement);
        
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 发送消息
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (message && !isLoading) {
            // 添加用户消息到聊天框
            addMessage(message, 'user');
            
            // 更新对话历史
            chatHistory.push({role: 'user', content: message});
            
            // 清空输入框并重置高度
            userInput.value = '';
            userInput.style.height = '50px';
            
            // 禁用发送按钮，显示加载状态
            isLoading = true;
            sendButton.disabled = true;
            
            // 显示加载指示器
            showLoadingIndicator();
            
            // 根据模式选择不同的API调用
            if (isEnhancedMode) {
                // 增强模式：先确保已获取图像描述，然后调用DeepSeek API
                if (imageDescription) {
                    callDeepSeekAPI(message);
                } else {
                    // 如果还没有图像描述，先获取描述
                    getImageDescriptionAndCallDeepSeek(message);
                }
            } else {
                // 标准模式：直接调用GLM-4V-Flash API
                callGLM4VFlashAPI(message, imageBase64);
            }
        }
    }
    
    // 获取图像描述并调用DeepSeek API
    function getImageDescriptionAndCallDeepSeek(userMessage) {
        chrome.runtime.sendMessage({
            action: 'callGLM4VFlashAPI',
            message: "请详细描述这张图片的内容，包括可见的文本、图表、UI元素以及其他关键信息。",
            image: imageBase64
        }, function(response) {
            if (response && response.success) {
                // 保存图像描述
                imageDescription = response.aiResponse;
                // 调用DeepSeek API
                callDeepSeekAPI(userMessage);
            } else {
                // 显示错误信息并恢复状态
                isLoading = false;
                sendButton.disabled = false;
                hideLoadingIndicator();
                
                const errorMsg = response?.error || '无法获取图像描述，请重试或切换到标准模式';
                showWarning(errorMsg);
            }
        });
    }
    
    // 处理流式更新
    function handleStreamUpdate(contentDelta) {
        // 确保正在流式传输中
        if (!isStreaming) return;
        
        // 如果还没有创建消息元素，创建一个新的
        if (!currentStreamMessageElement) {
            currentStreamMessageElement = createStreamingMessageElement();
        }
        
        // 累加内容
        appendToStreamingMessage(contentDelta);
    }
    
    // 处理流式响应完成
    function handleStreamComplete(finalContent) {
        // 确保正在流式传输中
        if (!isStreaming) return;
        
        console.log("流式响应已完成");
        
        // 重置状态
        isStreaming = false;
        isLoading = false;
        sendButton.disabled = false;
        hideLoadingIndicator();
        
        // 完成最终消息
        finalizeStreamingMessage(finalContent);
        
        // 更新对话历史
        chatHistory.push({role: 'assistant', content: finalContent});
        
        // 重置当前消息元素
        currentStreamMessageElement = null;
    }
    
    // 处理流式响应错误
    function handleStreamError(error) {
        console.error("流式响应出错:", error);
        
        // 重置状态
        isStreaming = false;
        isLoading = false;
        sendButton.disabled = false;
        hideLoadingIndicator();
        
        // 显示错误消息
        showWarning(error || "接收响应时出错");
        
        // 清理任何正在进行的消息
        if (currentStreamMessageElement) {
            currentStreamMessageElement.parentElement.remove();
            currentStreamMessageElement = null;
        }
    }
    
    // 创建流式消息元素
    function createStreamingMessageElement() {
        hideLoadingIndicator();
        
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai-message';
        
        // 创建内部容器用于应用Markdown样式
        const markdownContainer = document.createElement('div');
        markdownContainer.className = 'markdown-content streaming-content';
        messageElement.appendChild(markdownContainer);
        
        messageContainer.appendChild(messageElement);
        
        // 初始设置为较低的不透明度
        messageContainer.style.opacity = '0.8';
        
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return markdownContainer;
    }
    
    // 向流式消息添加内容
    function appendToStreamingMessage(contentDelta) {
        if (!currentStreamMessageElement) return;
        
        // 单个字母/短语添加，无需每次都完全重新渲染Markdown
        // 在实际实现中可能需要更复杂的逻辑
        
        // 追加内容
        const contentSpan = document.createElement('span');
        contentSpan.textContent = contentDelta;
        currentStreamMessageElement.appendChild(contentSpan);
        
        // 滚动到最新内容
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 完成流式消息
    function finalizeStreamingMessage(fullContent) {
        if (!currentStreamMessageElement) return;
        
        // 获取父元素
        const messageElement = currentStreamMessageElement.parentElement;
        
        // 现在使用完整内容渲染Markdown
        if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
            try {
                // 使用markdown解析
                const markedText = marked.parse(fullContent);
                // 使用DOMPurify进行XSS防护
                const sanitizedHtml = DOMPurify.sanitize(markedText);
                currentStreamMessageElement.innerHTML = sanitizedHtml;
            } catch (error) {
                console.error('Markdown解析失败:', error);
                // 回退到普通文本显示
                currentStreamMessageElement.textContent = fullContent;
            }
        } else {
            currentStreamMessageElement.textContent = fullContent;
        }
        
        // 设置最终样式
        const messageContainer = messageElement.parentElement;
        messageContainer.style.opacity = '1';
        
        // 滚动到最新内容
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 调用DeepSeek API（增强模式）
    function callDeepSeekAPI(userMessage) {
        // 构建带有图像描述上下文的消息
        const messages = [
            {
                role: 'system',
                content: `你是一个智能助手，正在分析一张图片。下面是图片的描述：\n\n${imageDescription}\n\n请基于这个图片描述回答用户的问题。`
            }
        ];
        
        // 添加对话历史（最多保留10条记录）
        if (chatHistory.length > 0) {
            // 保持历史记录不超过10条
            const recentHistory = chatHistory.slice(-10);
            messages.push(...recentHistory);
        }
        
        // 设置流式响应标志
        isStreaming = true;
        
        // 注意：实际使用时，应该通过背景脚本发送请求，以避免CORS问题
        chrome.runtime.sendMessage({
            action: 'callDeepSeekAPI',
            messages: messages
        }, function(response) {
            // 如果返回值表示非流式响应，或者响应失败
            if (!response.success || !response.streaming) {
                // 隐藏加载状态
                isLoading = false;
                isStreaming = false;
                sendButton.disabled = false;
                hideLoadingIndicator();
                
                if (!response.success) {
                    // 显示错误信息
                    const errorMsg = response.error || '增强对话请求失败，请稍后重试或切换到标准模式';
                    showWarning(errorMsg);
                } else {
                    // 处理非流式响应（虽然我们期望流式响应）
                    addMessage(response.aiResponse || "收到回复但无内容", 'ai');
                    chatHistory.push({role: 'assistant', content: response.aiResponse || ""});
                }
            }
            // 如果是流式响应，响应处理会由消息监听器负责
        });
    }
    
    // 显示加载指示器
    function showLoadingIndicator() {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-indicator';
        loadingElement.id = 'loading-indicator';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const text = document.createElement('span');
        text.textContent = '正在思考...';
        
        loadingElement.appendChild(spinner);
        loadingElement.appendChild(text);
        
        chatMessages.appendChild(loadingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 隐藏加载指示器
    function hideLoadingIndicator() {
        const loadingElement = document.getElementById('loading-indicator');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    // 添加消息到聊天框
    function addMessage(text, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        // 对AI消息使用Markdown渲染，用户消息直接显示
        if (sender === 'ai' && typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
            try {
                // 使用markdown解析
                const markedText = marked.parse(text);
                // 使用DOMPurify进行XSS防护
                const sanitizedHtml = DOMPurify.sanitize(markedText);
                
                // 创建内部容器用于应用Markdown样式
                const markdownContainer = document.createElement('div');
                markdownContainer.className = 'markdown-content';
                markdownContainer.innerHTML = sanitizedHtml;
                
                messageElement.appendChild(markdownContainer);
            } catch (error) {
                console.error('Markdown解析失败:', error);
                // 回退到普通文本显示
                messageElement.textContent = text;
            }
        } else {
            // 用户消息直接显示为文本
            messageElement.textContent = text;
        }
        
        messageContainer.appendChild(messageElement);
        
        // 初始设置为不可见，然后添加动画效果
        messageContainer.style.opacity = '0';
        messageContainer.style.transform = 'translateY(20px)';
        
        chatMessages.appendChild(messageContainer);
        
        // 滚动到最新消息
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 触发动画
        setTimeout(() => {
            messageContainer.style.opacity = '1';
            messageContainer.style.transform = 'translateY(0)';
            messageContainer.style.transition = 'all 0.3s ease-out';
        }, 10);
    }
    
    // 调用GLM-4V-Flash API
    function callGLM4VFlashAPI(message, imageBase64) {
        // 注意：实际使用时，应该通过背景脚本发送请求，以避免CORS问题
        chrome.runtime.sendMessage({
            action: 'callGLM4VFlashAPI',
            message: message,
            image: imageBase64
        }, function(response) {
            // 隐藏加载状态
            isLoading = false;
            sendButton.disabled = false;
            hideLoadingIndicator();
            
            if (response && response.success) {
                // 添加AI回复到聊天框
                addMessage(response.aiResponse, 'ai');
            } else {
                // 显示错误信息
                const errorMsg = response?.error || '请求失败，请稍后重试';
                showWarning(errorMsg);
            }
        });
    }
    
    // 计算并设置下拉菜单的位置
    function positionDropdown() {
        const toggle = templateToggle;
        const toggleRect = toggle.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // 计算下拉菜单的高度和宽度（最大值）
        const dropdownHeight = 400; // 与CSS中的max-height相匹配
        const dropdownWidth = 280;  // 与CSS中的width相匹配
        
        // 计算下拉菜单最佳显示位置
        let top, left;
        
        // 默认显示在按钮下方
        left = toggleRect.left;
        
        // 检查水平方向是否足够显示完整
        if (left + dropdownWidth > viewportWidth) {
            // 向左调整，但不超出左边界
            left = Math.max(0, viewportWidth - dropdownWidth - 20);
        }
        
        // 检查是否有足够空间在下方显示
        const belowSpace = viewportHeight - toggleRect.bottom;
        const aboveSpace = toggleRect.top;
        
        if (belowSpace >= dropdownHeight || belowSpace >= aboveSpace) {
            // 下方空间足够，或比上方空间大
            top = toggleRect.bottom + 5;
        } else {
            // 上方空间更大
            top = toggleRect.top - dropdownHeight - 5;
        }
        
        // 确保不会超出屏幕顶部
        top = Math.max(5, top);
        
        // 应用计算的位置
        templateDropdown.style.top = top + 'px';
        templateDropdown.style.left = left + 'px';
        
        // 根据显示方向设置动画起点
        if (top > toggleRect.bottom) {
            // 向下展开
            templateDropdown.style.transformOrigin = 'top left';
        } else {
            // 向上展开
            templateDropdown.style.transformOrigin = 'bottom left';
        }
    }
    
    // 监听窗口大小变化，重新计算下拉菜单位置
    window.addEventListener('resize', function() {
        if (templateDropdown.classList.contains('show')) {
            positionDropdown();
        }
    });
    
    // 初始化页面
    document.addEventListener('DOMContentLoaded', init);
})(); 