
/**
 * http://blog.csdn.net/libins/article/details/50973498
 * http://blog.csdn.net/han_jiang_xue/article/details/8266207
 * http://www.360doc.com/content/17/0219/18/37253146_630338662.shtml
 * 默认角度
 * 0° =1
 * 顺时针90° =6
 * 逆时针90° =8
 * 180° =3
 */
const defaultOrientation = 1

/**
 * https://github.com/exif-js/exif-js/blob/master/exif.js#L107
 */
const TiffTags = 0x0112

/**
 * https://github.com/exif-js/exif-js/blob/master/exif.js#L534
 * @param {*} dataView
 * @param {*} dirStart
 * @param {*} littleEndian
 */
const readTagValue = (dataView, dirStart, littleEndian) => {
    // 第一个  图像文件目录Image File Directory(IFD)
  let entries = dataView.getUint16(dirStart, littleEndian)
  let entryOffset
  let i
  for (i = 0; i < entries; i++) {
      // Directory Entry(DE)
    entryOffset = dirStart + i * 12 + 2
    if (TiffTags === dataView.getUint16(entryOffset, littleEndian)) {
        // short, 16 bit int
      return dataView.getUint16(entryOffset + 8, littleEndian)
    }
  }
  return defaultOrientation
}

/**
 * https://github.com/exif-js/exif-js/blob/master/exif.js#L394
 * https://github.com/exif-js/exif-js/blob/master/exif.js#L651
 * 获取角度 (仅存在于jpg)
 * @param dataView  reader.readAsArrayBuffer(file)
 */
export const readOrientation = dataView => {
  let offset = 2
  let length = dataView.byteLength
  while (offset < length) {
     // 判断是不是标记 0xFF+标记号(1个字节)+数据大小描述符(2个字节)+数据内容(n个字节)
    if (dataView.getUint8(offset) !== 0xFF) break
     // Exif 使用APP1(0xFFE1)
    if (dataView.getUint8(offset + 1) === 0xE1) {
      offset = offset + 4
       // Exif 数据开始于ASCII字符 "Exif" 和2个字节的0x00, 后面才是 Exif的数据
       // E = 0x45  |  x = 0x78 | i =0x69 | f =0x66
      if (dataView.getUint32(offset) !== (0x45000000 | 0x780000 | 0x6900 | 0x66)) {
        return defaultOrientation
      }
      let littleEndian
      offset = offset + 6

       // TIFF格式中前8个字节是 TIFF 头. 其中最开始的前2个字节定义了 TIFF 数据的字节序.
       // 如果这个值是 0x4949="II"的话, 就表示按照 "Intel" 的字节序(Little Endian) 来排列数据.
       // 如果是 0x4d4d="MM",则说明按照 "Motorola" 的字节序(Big Endian)来排列数据

       // 随后的两个字节是一个2字节长度的固定值 0x002A. ,
       // getUint16 第二个参数  如果为 false 或未定义，则应读取一个 big-endian 值，否则应读取一个 little-endian 值。
       // 如果数据使用 Intel 字节序, 则这两个 字节的数据排列为"0x2a,0x00".
       // 如果是 Motorola 的, 则是 "0x00,0x2a"
      if (dataView.getUint16(offset) === 0x4949) {
        littleEndian = true
      } else if (dataView.getUint16(offset) === 0x4D4D) {
        littleEndian = false
      } else {
        return defaultOrientation
      }
      if (dataView.getUint16(offset + 2, littleEndian) !== 0x002A) {
        return defaultOrientation
      }
      let firstIFDOffset = dataView.getUint32(offset + 4, littleEndian)
       // TIFF头的最后的 4个字节是到第一个IFD 偏移量的值是 '0x00000008'.
      if (firstIFDOffset < 0x00000008) {
        return defaultOrientation
      }
      return readTagValue(dataView, offset + firstIFDOffset, littleEndian)
    } else {
      offset += 2 + dataView.getUint16(offset + 2)
    }
  }
  return defaultOrientation
}
