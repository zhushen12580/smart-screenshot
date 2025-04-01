/**
 * 简单的Markdown解析器和XSS净化器
 */
(function(global) {
  // 简化版Markdown解析
  const SimpleMarkdown = {
    parse: function(text) {
      if (!text) return '';
      
      let html = text;
      
      // 替换标题 (## 标题)
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
      
      // 替换粗体和斜体
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // 替换代码块
      html = html.replace(/```([^`]+)```/g, function(match, p1) {
        return '<pre><code>' + p1.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
      });
      
      // 替换内联代码
      html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      // 替换链接
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      
      // 替换无序列表
      html = html.replace(/^\s*\* (.*$)/gim, '<ul><li>$1</li></ul>');
      html = html.replace(/<\/ul>\s*<ul>/g, '');
      
      // 替换有序列表
      html = html.replace(/^\s*\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
      html = html.replace(/<\/ol>\s*<ol>/g, '');
      
      // 替换引用
      html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
      html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br>');
      
      // 替换段落和换行
      html = html.replace(/\n\s*\n/g, '</p><p>');
      html = html.replace(/\n/g, '<br>');
      
      // 如果没有p标签，添加一个
      if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
      }
      
      return html;
    }
  };
  
  // 简化版XSS过滤，改用静态方法避免this绑定问题
  const SimplePurify = {
    sanitize: function(html) {
      // 创建一个临时元素
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // 使用静态方法，避免this绑定问题
      SimplePurify._sanitizeNodeStatic(temp);
      
      return temp.innerHTML;
    },
    
    // 改为静态方法，不依赖this
    _sanitizeNodeStatic: function(node) {
      // 检查所有子节点
      const childNodes = node.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        const child = childNodes[i];
        
        // 如果是元素节点
        if (child.nodeType === 1) {
          const tagName = child.tagName.toLowerCase();
          
          // 允许的标签列表
          const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                             'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 
                             'em', 'strong', 'a', 'br', 'span', 'img'];
          
          // 如果标签不在允许列表中，替换为内容
          if (allowedTags.indexOf(tagName) === -1) {
            const fragment = document.createDocumentFragment();
            while (child.firstChild) {
              fragment.appendChild(child.firstChild);
            }
            node.replaceChild(fragment, child);
            i--; // 回退一步，因为当前节点已被替换
            continue;
          }
          
          // 清理属性
          const attrs = child.attributes;
          for (let j = attrs.length - 1; j >= 0; j--) {
            const attrName = attrs[j].name;
            
            // a标签可以有href和rel属性
            if (tagName === 'a' && (attrName === 'href' || attrName === 'rel' || attrName === 'target')) {
              // 检查href是否为安全协议
              if (attrName === 'href') {
                const value = attrs[j].value;
                if (value.startsWith('javascript:') || value.startsWith('data:')) {
                  child.removeAttribute(attrName);
                }
              }
              continue;
            }
            
            // img标签可以有src和alt属性
            if (tagName === 'img' && (attrName === 'src' || attrName === 'alt')) {
              // 检查src是否为安全协议
              if (attrName === 'src') {
                const value = attrs[j].value;
                if (value.startsWith('javascript:') || value.startsWith('data:') && !value.startsWith('data:image/')) {
                  child.removeAttribute(attrName);
                }
              }
              continue;
            }
            
            // 其他情况移除属性
            child.removeAttribute(attrName);
          }
          
          // 递归处理子节点，调用静态方法
          SimplePurify._sanitizeNodeStatic(child);
        }
      }
    }
  };
  
  // 导出到全局
  global.marked = {
    parse: SimpleMarkdown.parse,
    setOptions: function() {} // 空方法，用于兼容
  };
  
  global.DOMPurify = {
    sanitize: SimplePurify.sanitize
  };
  
})(window); 