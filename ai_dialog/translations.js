// 多语言翻译配置
const translations = {
    'zh-CN': {
        // 标题与头部
        'title': '精准截图',
        'dialog_header': '与截图智能对话',
        'enhanced_mode': '对话增强',
        
        // 按钮与控件
        'close': '关闭',
        'send': '发送',
        'input_placeholder': '输入你的问题...',
        'image_size': '0 KB',
        
        // 模板提示
        'quick_prompts': '快捷提示',
        'extract_text_title': '提取文本',
        'extract_text_desc': '识别并提取图片中的所有文字',
        'extract_text_prompt': '提取这张图片中的所有文本内容。',
        
        'explain_image_title': '解释图片',
        'explain_image_desc': '简单明了地解释图片内容',
        'explain_image_prompt': '请通俗易懂地解释这张图片表达的意思。',
        
        'analyze_content_title': '内容分析',
        'analyze_content_desc': '分析图片中的主要内容和要点',
        'analyze_content_prompt': '请分析这张图片中的主要内容和关键信息。',
        
        'check_issues_title': '问题检查',
        'check_issues_desc': '查找图片中可能存在的错误',
        'check_issues_prompt': '请检查这个图片中是否有错误或问题，如果有请指出。',
        
        'extract_table_title': '表格提取',
        'extract_table_desc': '将表格数据转为文本格式',
        'extract_table_prompt': '请将图片中的表格数据转换为易读的文本格式。',
        
        'analyze_chart_title': '图表解析',
        'analyze_chart_desc': '解读图表中的数据和趋势',
        'analyze_chart_prompt': '请分析这张图表并解释其中的趋势和含义。',
        
        // 状态与消息
        'thinking': '正在思考...',
        'welcome_message': '你好！我已经看到了这张图片。请问有什么可以帮助你的？',
        'enhanced_mode_on': '已切换到对话增强模式。该模式结合图像识别和高级对话能力，提供更连贯的交流体验。',
        'standard_mode_on': '已切换到标准模式。',
        'image_compressed': '已压缩',
        'image_size_warning': '图像大小超过5MB，可能无法正常处理。请考虑使用更小的图像。',
        'request_failed': '请求失败，请稍后重试',
        'enhanced_mode_failed': '增强对话请求失败，请稍后重试或切换到标准模式',
        'image_desc_failed': '无法获取图像描述，请重试或切换到标准模式',
        'streaming_error': '接收响应时出错',
        'empty_response': '收到回复但无内容',
        
        // 页脚
        'footer_text': '图像智能分析 · 请勿上传敏感信息'
    },
    'en-US': {
        // Title and header
        'title': 'Smart Screenshot',
        'dialog_header': 'Chat with Screenshot',
        'enhanced_mode': 'Enhanced Chat',
        
        // Buttons and controls
        'close': 'Close',
        'send': 'Send',
        'input_placeholder': 'Enter your question...',
        'image_size': '0 KB',
        
        // Template prompts
        'quick_prompts': 'Quick Prompts',
        'extract_text_title': 'Extract Text',
        'extract_text_desc': 'Identify and extract all text from the image',
        'extract_text_prompt': 'Extract all text content from this image.',
        
        'explain_image_title': 'Explain Image',
        'explain_image_desc': 'Explain the image content clearly',
        'explain_image_prompt': 'Please explain what this image means in simple terms.',
        
        'analyze_content_title': 'Content Analysis',
        'analyze_content_desc': 'Analyze main content and key points',
        'analyze_content_prompt': 'Please analyze the main content and key information in this image.',
        
        'check_issues_title': 'Check Issues',
        'check_issues_desc': 'Find possible errors in the image',
        'check_issues_prompt': 'Please check if there are any errors or issues in this image and point them out if any.',
        
        'extract_table_title': 'Extract Table',
        'extract_table_desc': 'Convert table data to text format',
        'extract_table_prompt': 'Please convert the table data in this image to readable text format.',
        
        'analyze_chart_title': 'Chart Analysis',
        'analyze_chart_desc': 'Interpret data and trends in the chart',
        'analyze_chart_prompt': 'Please analyze this chart and explain its trends and meanings.',
        
        // Status and messages
        'thinking': 'Thinking...',
        'welcome_message': 'Hello! I can see this image. How can I help you?',
        'enhanced_mode_on': 'Switched to enhanced chat mode. This mode combines image recognition and advanced dialogue capabilities for a more coherent experience.',
        'standard_mode_on': 'Switched to standard mode.',
        'image_compressed': 'compressed',
        'image_size_warning': 'Image size exceeds 5MB, which may not process properly. Please consider using a smaller image.',
        'request_failed': 'Request failed, please try again later',
        'enhanced_mode_failed': 'Enhanced chat request failed, please try again later or switch to standard mode',
        'image_desc_failed': 'Unable to get image description, please try again or switch to standard mode',
        'streaming_error': 'Error receiving response',
        'empty_response': 'Received reply but no content',
        
        // Footer
        'footer_text': 'Image Intelligent Analysis · Do not upload sensitive information'
    }
};

// 默认语言
let currentLanguage = 'zh-CN';

// 获取当前语言的翻译文本
function getTranslation(key) {
    if (!translations[currentLanguage] || !translations[currentLanguage][key]) {
        // 如果找不到翻译，返回中文默认值
        return translations['zh-CN'][key] || key;
    }
    return translations[currentLanguage][key];
}

// 设置界面语言
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        updateUILanguage();
    }
}

// 更新界面语言
function updateUILanguage() {
    // 更新页面标题
    document.title = getTranslation('title');
    
    // 更新头部标题
    const headerTitle = document.querySelector('.ai-dialog-header h3');
    if (headerTitle) {
        headerTitle.innerHTML = `<span class="material-icons">auto_awesome</span>${getTranslation('dialog_header')}`;
    }
    
    // 更新增强模式标签
    const enhancedLabel = document.querySelector('.toggle-label');
    if (enhancedLabel) {
        enhancedLabel.textContent = getTranslation('enhanced_mode');
    }
    
    // 更新关闭按钮
    const closeButton = document.querySelector('.close-button .material-icons');
    if (closeButton) {
        closeButton.setAttribute('title', getTranslation('close'));
    }
    
    // 更新输入框占位符
    const inputField = document.getElementById('user-input');
    if (inputField) {
        inputField.setAttribute('placeholder', getTranslation('input_placeholder'));
    }
    
    // 更新发送按钮
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.setAttribute('title', getTranslation('send'));
    }
    
    // 更新快捷提示按钮
    const templatesButton = document.getElementById('show-templates');
    if (templatesButton) {
        templatesButton.textContent = getTranslation('quick_prompts');
    }
    
    // 更新模板项
    updateTemplateItems();
    
    // 更新页脚
    const footer = document.querySelector('.dialog-footer p');
    if (footer) {
        footer.textContent = getTranslation('footer_text');
    }
}

// 更新模板项文本
function updateTemplateItems() {
    // 提取文本模板
    updateTemplateItem(0, 'extract_text_title', 'extract_text_desc', 'extract_text_prompt');
    
    // 解释图片模板
    updateTemplateItem(1, 'explain_image_title', 'explain_image_desc', 'explain_image_prompt');
    
    // 内容分析模板
    updateTemplateItem(2, 'analyze_content_title', 'analyze_content_desc', 'analyze_content_prompt');
    
    // 问题检查模板
    updateTemplateItem(3, 'check_issues_title', 'check_issues_desc', 'check_issues_prompt');
    
    // 表格提取模板
    updateTemplateItem(4, 'extract_table_title', 'extract_table_desc', 'extract_table_prompt');
    
    // 图表解析模板
    updateTemplateItem(5, 'analyze_chart_title', 'analyze_chart_desc', 'analyze_chart_prompt');
}

// 更新单个模板项
function updateTemplateItem(index, titleKey, descKey, promptKey) {
    const templateItems = document.querySelectorAll('.template-item');
    if (templateItems.length > index) {
        const item = templateItems[index];
        const titleElement = item.querySelector('.template-title');
        const descElement = item.querySelector('.template-desc');
        
        if (titleElement) {
            titleElement.textContent = getTranslation(titleKey);
        }
        if (descElement) {
            descElement.textContent = getTranslation(descKey);
        }
        
        // 更新提示文本
        item.setAttribute('data-template', getTranslation(promptKey));
    }
}

// 获取浏览器语言
function getBrowserLanguage() {
    const language = navigator.language || navigator.userLanguage;
    if (language.startsWith('zh')) {
        return 'zh-CN';
    } else {
        return 'en-US'; // 默认使用英文
    }
}

// 导出函数和变量
window.Translations = {
    getTranslation,
    setLanguage,
    updateUILanguage,
    getBrowserLanguage,
    getCurrentLanguage: () => currentLanguage
}; 