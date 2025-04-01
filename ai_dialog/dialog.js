// AI对话界面处理逻辑
(function() {
    // GLM-4V API配置 - 实际使用时应替换为真实的API密钥和请求参数
    const API_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const API_KEY = ''; // 实际使用时需要填入正确的API密钥
    
    // 页面元素
    const dialogImage = document.getElementById('dialog-image');
    const imageSizeElement = document.getElementById('image-size');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const closeButton = document.getElementById('close-dialog');
    
    // 存储图像的base64数据
    let imageBase64 = '';
    let isLoading = false;
    
    // 初始化
    function init() {
        // 配置Markdown解析选项
        configureMarkdown();
        
        // 从URL获取图像数据
        const urlParams = new URLSearchParams(window.location.search);
        const imageData = urlParams.get('image');
        
        if (imageData) {
            imageBase64 = imageData;
            loadImage(imageBase64);
        }
        
        // 添加事件监听
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        closeButton.addEventListener('click', function() {
            window.close();
        });
    }
    
    // 配置Markdown解析选项
    function configureMarkdown() {
        if (typeof marked !== 'undefined') {
            // 配置Marked选项
            marked.setOptions({
                renderer: new marked.Renderer(),
                highlight: function(code, lang) {
                    if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (e) {
                            console.error("高亮错误", e);
                        }
                    }
                    return code;
                },
                pedantic: false,
                gfm: true,
                breaks: true,
                sanitize: false,
                smartypants: false,
                xhtml: false
            });
            
            console.log("Markdown解析器已配置");
        } else {
            console.warn("Markdown解析器不可用");
        }
    }
    
    // 渲染Markdown文本
    function renderMarkdown(text) {
        if (typeof marked !== 'undefined') {
            try {
                return marked.parse(text);
            } catch (e) {
                console.error("Markdown解析错误", e);
                return text;
            }
        }
        return text;
    }
    
    // 加载图像并显示
    function loadImage(base64Data) {
        if (!base64Data.startsWith('data:image')) {
            base64Data = 'data:image/png;base64,' + base64Data;
        }
        
        dialogImage.src = base64Data;
        
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
                imageSizeElement.textContent = formatFileSize(newSize) + ' (已自动压缩)';
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
        warningElement.className = 'message ai-message';
        warningElement.textContent = `⚠️ ${message}`;
        chatMessages.appendChild(warningElement);
    }
    
    // 发送消息
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (message && !isLoading) {
            // 添加用户消息到聊天框 - 用户消息不渲染Markdown
            addMessage(message, 'user', false);
            
            // 清空输入框
            userInput.value = '';
            
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
    function addMessage(text, sender, shouldRenderMarkdown = true) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        // AI消息使用Markdown渲染，用户消息直接显示文本
        if (sender === 'ai' && shouldRenderMarkdown) {
            messageElement.classList.add('markdown-content');
            messageElement.innerHTML = renderMarkdown(text);
            
            // 对代码块添加复制按钮
            addCopyButtonsToCodeBlocks(messageElement);
        } else {
            messageElement.textContent = text;
        }
        
        messageContainer.appendChild(messageElement);
        chatMessages.appendChild(messageContainer);
        
        // 滚动到最新消息
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 添加复制按钮到代码块
    function addCopyButtonsToCodeBlocks(container) {
        const codeBlocks = container.querySelectorAll('pre > code');
        
        codeBlocks.forEach((codeBlock, index) => {
            const pre = codeBlock.parentNode;
            const codeWrapper = document.createElement('div');
            codeWrapper.className = 'code-wrapper';
            codeWrapper.style.position = 'relative';
            
            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.textContent = '复制';
            copyButton.className = 'copy-button';
            copyButton.style.position = 'absolute';
            copyButton.style.top = '5px';
            copyButton.style.right = '5px';
            copyButton.style.padding = '2px 6px';
            copyButton.style.fontSize = '12px';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '3px';
            copyButton.style.backgroundColor = '#f0f0f0';
            copyButton.style.cursor = 'pointer';
            copyButton.style.opacity = '0.7';
            
            // 鼠标悬停时显示
            codeWrapper.addEventListener('mouseenter', () => {
                copyButton.style.opacity = '1';
            });
            
            codeWrapper.addEventListener('mouseleave', () => {
                copyButton.style.opacity = '0.7';
            });
            
            // 点击复制代码
            copyButton.addEventListener('click', () => {
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = '已复制!';
                    copyButton.style.backgroundColor = '#4caf50';
                    copyButton.style.color = 'white';
                    
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                        copyButton.style.backgroundColor = '#f0f0f0';
                        copyButton.style.color = 'black';
                    }, 1500);
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            });
            
            // 将pre包装到新容器中
            pre.parentNode.insertBefore(codeWrapper, pre);
            codeWrapper.appendChild(pre);
            codeWrapper.appendChild(copyButton);
        });
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
                // 添加AI回复到聊天框，使用Markdown渲染
                addMessage(response.aiResponse, 'ai', true);
            } else {
                // 显示错误信息
                const errorMsg = response?.error || '请求失败，请稍后重试';
                showWarning(errorMsg);
            }
        });
    }
    
    // 初始化页面
    document.addEventListener('DOMContentLoaded', init);
})(); 