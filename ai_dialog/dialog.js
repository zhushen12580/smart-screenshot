// AI对话界面处理逻辑
(function() {
    // GLM-4V API配置 - 从环境变量获取
    const API_ENDPOINT = process.env.GLM4V_API_ENDPOINT;
    const API_KEY = process.env.GLM4V_API_KEY;
    
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
    
    // 存储图像的base64数据
    let imageBase64 = '';
    let isLoading = false;
    
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
            });
        } else {
            // 确保base64不包含前缀
            if (base64Data.includes(',')) {
                imageBase64 = base64Data.split(',')[1];
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
            
            // 清空输入框并重置高度
            userInput.value = '';
            userInput.style.height = '50px';
            
            // 禁用发送按钮，显示加载状态
            isLoading = true;
            sendButton.disabled = true;
            
            // 显示加载指示器
            showLoadingIndicator();
            
            // 调用GLM-4V-Flash API
            callGLM4VFlashAPI(message, imageBase64);
        }
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