export default {
  heat: {
    name: '经典热力图',
    colors: ['#4575b4', '#91bfdb', '#fee090', '#fc8d59', '#d73027'],
    description: '从冷色到暖色,适合表现强度变化',
  },
  viridis: {
    name: 'Viridis (色盲友好)',
    colors: ['#440154', '#31688e', '#35b779', '#fde724'],
    description: '色盲友好,感知均匀',
  },
  plasma: {
    name: 'Plasma',
    colors: ['#0d0887', '#7e03a8', '#cc4778', '#f89540', '#f0f921'],
    description: '高对比度,适合深色背景',
  },
  inferno: {
    name: 'Inferno',
    colors: ['#000004', '#420a68', '#932667', '#dd513a', '#fba40a', '#fcffa4'],
    description: '从深紫到黄的强烈渐变,适合高对比环境',
  },
  magma: {
    name: 'Magma',
    colors: ['#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d', '#fcfdbf'],
    description: '柔和的暗背景渐变,科学可视化常用',
  },
  cividis: {
    name: 'Cividis (色盲友好)',
    colors: ['#00204c', '#414487', '#7e03a8', '#b63679', '#e16462', '#fca636', '#fcffa4'],
    description: '针对色盲优化,亮度感知线性',
  },
  turbo: {
    name: 'Turbo (Google)',
    colors: ['#30123b', '#4145ab', '#4692c5', '#53c568', '#a9dc32', '#f6d746', '#f78e1e', '#e43e2b'],
    description: '高动态范围,亮度一致,谷歌推荐热力图方案',
  },
  warm: {
    name: '暖色系',
    colors: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
    description: '黄到红,温暖渐变',
  },
  cool: {
    name: '冷色系',
    colors: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
    description: '蓝色渐变,清爽专业',
  },
  spectral: {
    name: '光谱',
    colors: ['#5e4fa2', '#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#fee08b', '#fdae61', '#f46d43', '#d53e4f', '#9e0142'],
    description: '彩虹光谱,数据分布直观',
  },
  redblue: {
    name: '红蓝对比',
    colors: ['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac'],
    description: '适合表现正负变化或偏差型数据',
  },
  greens: {
    name: '绿色渐变',
    colors: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'],
    description: '环保、生态类数据常用',
  },
  oranges: {
    name: '橙色渐变',
    colors: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'],
    description: '热度或能量相关数据表现',
  },
  custom1: {
    name: '自定义1 (绿-黄-橙-红)',
    colors: ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'],
    description: '适合表现从安全到危险',
  },
  custom2: {
    name: '自定义2 (青-紫-粉)',
    colors: ['#c7e9c0', '#74c476', '#238b45', '#6a51a3', '#9e9ac8', '#dd1c77'],
    description: '现代感强,适合深浅背景',
  },
};
