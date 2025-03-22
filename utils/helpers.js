/**
 * 比例截图工具辅助函数
 */

/**
 * 解析比例字符串为数字比例
 * @param {string} ratioStr - 格式为"width:height"的比例字符串
 * @returns {object} 包含width和height的对象
 */
function parseRatio(ratioStr) {
  if (!ratioStr || !ratioStr.includes(':')) {
    return { width: 16, height: 9 }; // 默认16:9
  }
  
  const [widthStr, heightStr] = ratioStr.split(':');
  const width = parseInt(widthStr) || 1;
  const height = parseInt(heightStr) || 1;
  
  return { width, height };
}

/**
 * 计算固定比例的尺寸
 * @param {number} width - 原始宽度
 * @param {number} height - 原始高度
 * @param {string} targetRatio - 目标比例字符串
 * @returns {object} 调整后的宽度和高度
 */
function calculateAspectRatioDimensions(width, height, targetRatio) {
  const { width: ratioWidth, height: ratioHeight } = parseRatio(targetRatio);
  const targetAspectRatio = ratioWidth / ratioHeight;
  const currentAspectRatio = width / height;
  
  if (currentAspectRatio > targetAspectRatio) {
    // 当前比例更宽，基于高度计算宽度
    return {
      width: Math.round(height * targetAspectRatio),
      height: height
    };
  } else {
    // 当前比例更窄，基于宽度计算高度
    return {
      width: width,
      height: Math.round(width / targetAspectRatio)
    };
  }
}

/**
 * 格式化尺寸为人类可读格式
 * @param {number} width - 宽度（像素）
 * @param {number} height - 高度（像素）
 * @returns {string} 格式化的尺寸字符串
 */
function formatDimensions(width, height) {
  return `${width} × ${height}`;
}

/**
 * 生成文件名
 * @param {string} prefix - 文件名前缀
 * @param {string} format - 文件格式（png/jpg）
 * @returns {string} 生成的文件名
 */
function generateFilename(prefix = '比例截图', format = 'png') {
  const timestamp = new Date().toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '_');
  
  return `${prefix}_${timestamp}.${format}`;
}

// 导出工具函数
if (typeof module !== 'undefined') {
  module.exports = {
    parseRatio,
    calculateAspectRatioDimensions,
    formatDimensions,
    generateFilename
  };
} 