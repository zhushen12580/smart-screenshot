// 抠图辅助函数

// 计算两个颜色之间的欧氏距离
function colorDistance(color1, color2) {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
    Math.pow(color1.g - color2.g, 2) +
    Math.pow(color1.b - color2.b, 2)
  );
}

// 找出颜色样本中的主要颜色
function findDominantColors(samples, k, distanceFunc) {
  if (samples.length === 0) {
    return [{r: 255, g: 255, b: 255}]; // 默认白色
  }
  
  if (samples.length <= k) {
    return samples;
  }
  
  // 随机选择初始中心点
  const centroids = [];
  const used = new Set();
  
  for (let i = 0; i < k; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * samples.length);
    } while (used.has(index));
    
    used.add(index);
    centroids.push({...samples[index]});
  }
  
  // 最大迭代次数
  const maxIterations = 5;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // 分配样本到最近的中心点
    const clusters = Array(k).fill().map(() => []);
    
    for (const sample of samples) {
      let minDistance = Infinity;
      let closestCluster = 0;
      
      for (let c = 0; c < k; c++) {
        const distance = distanceFunc(sample, centroids[c]);
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = c;
        }
      }
      
      clusters[closestCluster].push(sample);
    }
    
    // 更新中心点
    let changed = false;
    
    for (let c = 0; c < k; c++) {
      const cluster = clusters[c];
      
      if (cluster.length === 0) continue;
      
      const newCentroid = {
        r: Math.round(cluster.reduce((sum, color) => sum + color.r, 0) / cluster.length),
        g: Math.round(cluster.reduce((sum, color) => sum + color.g, 0) / cluster.length),
        b: Math.round(cluster.reduce((sum, color) => sum + color.b, 0) / cluster.length)
      };
      
      // 检查是否有明显变化
      if (distanceFunc(newCentroid, centroids[c]) > 1) {
        centroids[c] = newCentroid;
        changed = true;
      }
    }
    
    // 如果中心点未变化，提前结束
    if (!changed) break;
  }
  
  return centroids;
}

// 简化的背景移除函数
function removeBackground(imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // 获取边缘区域的颜色样本
  const samples = collectColorSamples(data, width, height);
  
  // 使用KMeans算法找出主要背景色
  const bgColors = findDominantColors(samples, 3, colorDistance);
  console.log("检测到的主要背景色:", bgColors);
  
  // 固定阈值
  const colorDistanceThreshold = 30;
  const extendedThreshold = colorDistanceThreshold * 1.8;
  
  // 标记前景和背景
  const mask = new Float32Array(width * height);
  
  // 第一步: 标记像素
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const pixelColor = {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2]
      };
      
      // 计算与所有背景色的最小距离
      let minDistance = 255;
      for (const bgColor of bgColors) {
        const distance = colorDistance(pixelColor, bgColor);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
      
      // 设置掩码值
      if (minDistance < colorDistanceThreshold) {
        // 完全背景
        mask[y * width + x] = 0;
      } else if (minDistance < extendedThreshold) {
        // 过渡区域 - 平滑过渡
        const t = (minDistance - colorDistanceThreshold) / (extendedThreshold - colorDistanceThreshold);
        const smoothT = 3 * t * t - 2 * t * t * t; // Smoothstep函数
        mask[y * width + x] = smoothT;
      } else {
        // 完全前景
        mask[y * width + x] = 1;
      }
    }
  }
  
  // 第二步: 应用边缘平滑
  smoothEdges(mask, width, height);
  
  // 第三步: 应用透明度
  for (let i = 0; i < width * height; i++) {
    data[i * 4 + 3] = Math.round(mask[i] * 255);
  }
}

// 收集边缘颜色样本
function collectColorSamples(data, width, height) {
  const samples = [];
  const sampleSize = 20;
  
  // 采样四个角落
  const cornerCoords = [
    {x: 0, y: 0},
    {x: width - 1, y: 0},
    {x: 0, y: height - 1},
    {x: width - 1, y: height - 1}
  ];
  
  // 从边缘采样
  for (const corner of cornerCoords) {
    for (let dy = 0; dy < sampleSize && corner.y + dy < height; dy++) {
      for (let dx = 0; dx < sampleSize && corner.x + dx < width; dx++) {
        const index = ((corner.y + dy) * width + (corner.x + dx)) * 4;
        samples.push({
          r: data[index],
          g: data[index + 1],
          b: data[index + 2]
        });
      }
    }
  }
  
  // 采样上下边缘
  for (let x = sampleSize; x < width - sampleSize; x += sampleSize) {
    // 上边缘
    for (let dy = 0; dy < sampleSize; dy++) {
      const index = (dy * width + x) * 4;
      samples.push({
        r: data[index],
        g: data[index + 1],
        b: data[index + 2]
      });
    }
    
    // 下边缘
    for (let dy = 0; dy < sampleSize; dy++) {
      const y = height - 1 - dy;
      const index = (y * width + x) * 4;
      samples.push({
        r: data[index],
        g: data[index + 1],
        b: data[index + 2]
      });
    }
  }
  
  return samples;
}

// 平滑边缘
function smoothEdges(mask, width, height) {
  // 创建临时数组
  const tempMask = new Float32Array(width * height);
  tempMask.set(mask);
  
  // 应用3x3平滑
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // 只处理边缘区域
      if (mask[y * width + x] > 0.05 && mask[y * width + x] < 0.95) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += tempMask[(y + dy) * width + (x + dx)];
          }
        }
        mask[y * width + x] = sum / 9;
      }
    }
  }
}

// 导出函数
window.BgRemoveHelper = {
  removeBackground,
  colorDistance,
  findDominantColors,
  smoothEdges,
  collectColorSamples
}; 