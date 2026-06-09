// 纯 JavaScript PNG 生成器 - 为时间储蓄罐创建应用图标
// 无任何外部依赖

const fs = require('fs');

// ---- PNG 编码 ----
function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 'ascii');
  data.copy(buf, 8);
  const crcVal = crc32(buf.slice(4, 8 + len));
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

function makePNG(width, height, pixels) {
  // pixels: array of [r,g,b,a] for each pixel, row-major
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT - raw pixel data with filter byte 0 per row
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    rawRows.push(0); // filter: none
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      rawRows.push(pixels[idx]);     // R
      rawRows.push(pixels[idx + 1]); // G
      rawRows.push(pixels[idx + 2]); // B
      rawRows.push(pixels[idx + 3]); // A
    }
  }
  const raw = Buffer.from(rawRows);

  // Simple deflate using zlib (built-in)
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(raw);

  // Build PNG
  const chunks = [
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ];

  return Buffer.concat(chunks);
}

// ---- 绘制 256x256 图标 ----
const W = 256, H = 256;
const pixels = new Uint8Array(W * H * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (Math.floor(y) * W + Math.floor(x)) * 4;
  pixels[idx] = r;
  pixels[idx + 1] = g;
  pixels[idx + 2] = b;
  pixels[idx + 3] = a;
}

function lerp(a, b, t) { return a + (b - a) * t; }

function fillRect(x, y, w, h, r, g, b, a = 255) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPixel(x + dx, y + dy, r, g, b, a);
    }
  }
}

function fillRoundRect(x, y, w, h, radius, r, g, b, a = 255) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      let inside = true;
      const px = dx, py = dy;
      // Check corners
      if (px < radius && py < radius) {
        const cx = radius, cy = radius;
        inside = (px - cx) ** 2 + (py - cy) ** 2 <= radius ** 2;
      } else if (px >= w - radius && py < radius) {
        const cx = w - radius, cy = radius;
        inside = (px - cx) ** 2 + (py - cy) ** 2 <= radius ** 2;
      } else if (px < radius && py >= h - radius) {
        const cx = radius, cy = h - radius;
        inside = (px - cx) ** 2 + (py - cy) ** 2 <= radius ** 2;
      } else if (px >= w - radius && py >= h - radius) {
        const cx = w - radius, cy = h - radius;
        inside = (px - cx) ** 2 + (py - cy) ** 2 <= radius ** 2;
      }
      if (inside) setPixel(x + dx, y + dy, r, g, b, a);
    }
  }
}

function fillCircle(cx, cy, radius, r, g, b, a = 255) {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(cx + dx, cy + dy, r, g, b, a);
      }
    }
  }
}

// 背景 - 透明
// (不填就是透明)

// 罐盖底部
fillRoundRect(80, 56, 96, 18, 6, 167, 139, 250);
// 罐盖顶部
fillRoundRect(88, 40, 80, 18, 4, 139, 92, 246);

// 罐身 - 粉色渐变梯形
for (let y = 72; y < 224; y++) {
  const t = (y - 72) / (224 - 72);
  const r = Math.round(lerp(249, 244, t));
  const g = Math.round(lerp(168, 114, t));
  const b = Math.round(lerp(212, 182, t));
  // 罐身宽度：顶部 112，底部 112（直筒），底部圆角区域略窄
  const width = 112;
  const left = 72;
  for (let x = 0; x < width; x++) {
    setPixel(left + x, y, r, g, b, 230);
  }
}

// 罐底圆角（底部用圆角矩形覆盖）
fillRoundRect(72, 200, 112, 24, 12, 244, 114, 182, 230);

// 高光
for (let y = 78; y < 200; y++) {
  for (let x = 0; x < 16; x++) {
    const idx = ((y * W) + (80 + x)) * 4;
    if (pixels[idx + 3] > 0) {
      pixels[idx] = Math.min(255, pixels[idx] + 30);
      pixels[idx + 1] = Math.min(255, pixels[idx + 1] + 30);
      pixels[idx + 2] = Math.min(255, pixels[idx + 2] + 30);
    }
  }
}

// 植物茎
for (let t = 0; t < 1; t += 0.001) {
  const x = 128 + Math.sin(t * Math.PI * 0.8) * 6;
  const y = 210 - t * 60;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      setPixel(Math.round(x + dx), Math.round(y + dy), 52, 211, 153);
    }
  }
}

// 叶子
fillCircle(108, 158, 8, 52, 211, 153);
fillCircle(138, 170, 7, 52, 211, 153);

// 花瓣
const petalColors = [
  [244, 114, 182],
  [251, 191, 36],
  [244, 114, 182],
  [251, 146, 191],
  [244, 114, 182],
];
const petalPositions = [
  [128, 140], [135, 148], [130, 158],
  [120, 155], [115, 147],
];
for (let i = 0; i < petalPositions.length; i++) {
  const [px, py] = petalPositions[i];
  const [cr, cg, cb] = petalColors[i];
  fillCircle(px, py, 7, cr, cg, cb);
}

// 花心
fillCircle(126, 150, 6, 251, 191, 36);

// 生成 PNG
const png = makePNG(W, H, pixels);
fs.writeFileSync('D:/project1/time-jar-app/assets/icon.png', png);
console.log('Icon created: D:/project1/time-jar-app/assets/icon.png');
console.log('Size:', png.length, 'bytes');
