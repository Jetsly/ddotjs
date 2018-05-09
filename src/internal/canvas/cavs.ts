import { readOrientation } from './_exif'

/**
 * 修正请求地址
 * @param url 地址
 */
export function fixAchor (url) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.href.replace(/https?:/, location.protocol)
  return anchor
}

/**
 * 获取文件类型、角度
 * @param {File} blob 文件对象
 */
export const getTypeAndOrient = blob => new Promise<{type: string,orient: number}>((resolve, reject) => {
  let reader = new FileReader()
  reader.onload = () => {
    let buf = new DataView(reader.result)
    let orient = 1
    let type = buf.byteLength > 1 ? ({
      'ffd8': 'jpg',
      '8950': 'png',
      '4749': 'gif',
      '424d': 'bmp'
    })[`${buf.getUint16(0).toString(16)}`] : undefined
    if (type === 'jpg') {
      orient = readOrientation(buf)
    }
    resolve({ type, orient })
  }
  reader.onerror = err => reject(err)
  reader.readAsArrayBuffer(blob)
})

/**
 * 预加载图片
 * @param src
 */
export const preloadImg = src => new Promise<HTMLImageElement>((resolve, reject) => {
  const img = new Image()
  const anchor = fixAchor(src)
    // cross domain (除了base64 和 当前域名)
  if (!(/^data:image/.test(anchor.href) || location.host === anchor.host)) {
    img.crossOrigin = ''
  }
  img.onload = () => resolve(img)
  img.onerror = () => reject(img)
  img.src = anchor.href
})

/**
 * 图片转换为canvas
 * @param img 图片
 * @param orientation 旋转角度 1:0,3:180,6:90,8:270
 */
export function toCanvas (img: HTMLImageElement,maxWidth,orientation= 1): HTMLCanvasElement {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  let imgRotation = {
    '1': 0,
    '3': Math.PI,
    '6': Math.PI * 0.5,
    '8': Math.PI * 1.5
  }[orientation] || 0
  const width = img.naturalWidth
  const height = img.naturalHeight
  let ratio = 0
  let dw
  let dh
  if (~[6, 8].indexOf(orientation)) {
    canvas.width = maxWidth ? Math.min(maxWidth,height) : height
    ratio = canvas.width / img.naturalHeight
    canvas.height = img.naturalWidth * ratio
    dw = canvas.height
    dh = canvas.width
  } else {
    canvas.width = maxWidth ? Math.min(maxWidth, width) : width
    ratio = canvas.width / img.naturalWidth
    canvas.height = img.naturalHeight * ratio
    dw = canvas.width
    dh = canvas.height
  }
  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(imgRotation)
  ctx.drawImage(img, 0, 0, width, height, -dw / 2, -dh / 2, dw, dh)
  ctx.restore()
  return canvas
}

/**
 * 转换为Canvas
 * @param blob 文件
 * @param orientation 旋转角度 1:0,3:180,6:90,8:270
 * @param base64 是否输出base64
 * @param maxWidth 最大宽度默认750
 */
export const fromBlob = (blob,orientation= 1,base64= false,maxWidth= 750) => new Promise<HTMLCanvasElement | String>((resolve, reject) => {
  let reader = new FileReader()
  reader.onload = () => preloadImg(reader.result).then(img => {
    let canvas = toCanvas(img,maxWidth,orientation)
    resolve(base64 ? canvas.toDataURL('image/jpeg', 0.96) : canvas)
  })
  reader.onerror = err => reject(err)
  reader.readAsDataURL(blob)
})

/**
 * 图片滤镜处理
 * @param imgData
 * @param lutData
 */
export function cpulookupFilter (imgData: ImageData, lutData: Uint8ClampedArray): ImageData {
  const lutLength = lutData.length / 4
  const width = Math.sqrt(lutLength)
  for (let index = 0; index < imgData.data.length;) {
    const r = imgData.data[index++]
    const g = imgData.data[index++]
    const b = imgData.data[index++]
    const a = imgData.data[index++]
    const t = b / 255 * 63

    const quad1 = {
      x: 0,
      y: Math.floor(Math.floor(t) / 8)
    }
    quad1.x = Math.floor(t) - quad1.y * 8

    const quad2 = {
      x: 0,
      y: Math.floor(Math.ceil(t) / 8)
    }
    quad2.x = Math.ceil(t) - quad2.y * 8

    const texPos1 = {
      x: quad1.x * 0.125 + 0.5 / 512 + ((0.125 - 1 / 512) * r / 255),
      y: quad1.y * 0.125 + 0.5 / 512 + ((0.125 - 1 / 512) * g / 255)
    }

    const texPos2 = {
      x: quad2.x * 0.125 + 0.5 / 512 + ((0.125 - 1 / 512) * r / 255),
      y: quad2.y * 0.125 + 0.5 / 512 + ((0.125 - 1 / 512) * g / 255)
    }

    const color1 = (Math.floor(511 * texPos1.y) * width + Math.floor(511 * texPos1.x)) * 4
    const color2 = (Math.floor(511 * texPos2.y) * width + Math.floor(511 * texPos2.x)) * 4
    const fract = t - Math.floor(t)
    imgData.data[index - 4] = (lutData[color1] * (1 - fract) + lutData[color2] * fract)
    imgData.data[index - 3] = (lutData[color1 + 1] * (1 - fract) + lutData[color2 + 1] * fract)
    imgData.data[index - 2] = (lutData[color1 + 2] * (1 - fract) + lutData[color2 + 2] * fract)
        // imgData.data[index - 1] = (cultData[color1 + 3] * (1 - fract) + cultData[color2 + 3] * fract)
  }
  return imgData
}

/**
 * gpu 图片滤镜处理
 * @param img
 * @param lutImg
 * @param intensity
 */
export function gpuLookupFilter (img: HTMLImageElement, lutImg: HTMLImageElement, intensity: number = 1): HTMLCanvasElement {
  const { naturalWidth: W, naturalHeight: H } = img

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  if (!gl) {
    throw new Error('Unable to initialize WebGL. Your browser may not support it.')
  }

  function createBuffer (data, f?, e?) {
    const buffer = gl.createBuffer()
    gl.bindBuffer((e || gl.ARRAY_BUFFER), buffer)
    gl.bufferData((e || gl.ARRAY_BUFFER), new (f || Float32Array)(data), gl.STATIC_DRAW)

    return buffer
  }

    // 创建顶点
  const posBuffer = createBuffer([
    -1, -1,
    1, -1,
    1, 1,
    -1, 1
  ])

    // 创建素材覆盖区域
  const textureBuffer = createBuffer([
    0, 1,
    1, 1,
    1, 0,
    0, 0
  ])

    // 两个三角形路径
  const idxBuffer = createBuffer([
    1, 2, 0,
    3, 0, 2
  ], Uint16Array, gl.ELEMENT_ARRAY_BUFFER)

  const vecShaderCode = `
        attribute vec2 position;
        attribute vec2 texture;
        varying vec2 pos;

        void main(void) {
            pos = texture;
            gl_Position = vec4(position.xy, 0.0, 1.0);
        }
    `

  const vecShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vecShader, vecShaderCode)
  gl.compileShader(vecShader)

  if (!gl.getShaderParameter(vecShader, gl.COMPILE_STATUS)) {
    throw new Error(
            `Could not build internal vertex shader (fatal)
            INFO: >REPORT< THIS. That's our fault!
            --- CODE DUMP ---
            vecShader
            --- ERROR LOG ---
            gl.getShaderInfoLog(vertexShader)`
        )
  }

  function createTexture (img: HTMLImageElement) {
    const texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.bindTexture(gl.TEXTURE_2D, null)

    return texture
  }

  const fragShader = gl.createShader(gl.FRAGMENT_SHADER)

  const code = `
        precision mediump float;
        varying vec2 pos;
        uniform sampler2D inputImageTexture;
        uniform sampler2D lookupTexture;

        uniform lowp float intensity;
        void main() {
            vec4 textureColor = texture2D(inputImageTexture, pos);

            float blueColor = textureColor.b * 63.0;

            vec2 quad1;
            quad1.y = floor(floor(blueColor) / 8.0);
            quad1.x = floor(blueColor) - (quad1.y * 8.0);

            vec2 quad2;
            quad2.y = floor(ceil(blueColor) / 8.0);
            quad2.x = ceil(blueColor) - (quad2.y * 8.0);

            vec2 texPos1;
            texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
            texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);

            vec2 texPos2;
            texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
            texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);

            vec4 newColor1 = texture2D(lookupTexture, texPos1);
            vec4 newColor2 = texture2D(lookupTexture, texPos2);

            vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
            // gl_FragColor = textureColor;
            gl_FragColor = mix(textureColor, vec4(newColor.rgb, textureColor.w), intensity);
        }
    `

  gl.shaderSource(fragShader, code)
  gl.compileShader(fragShader)

  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    const LOC = code.split('\n')
    let dbgMsg = `ERROR: Could not build shader (fatal).
                      ------------------ KERNEL CODE DUMP ------------------`

    for (let nl = 0; nl < LOC.length; nl++) {
      dbgMsg += `>${LOC[nl]}\n`
    }
    dbgMsg += `\n--------------------- ERROR  LOG ---------------------\n` + gl.getShaderInfoLog(fragShader)

    throw new Error(dbgMsg)
  }

  const program = gl.createProgram()
  gl.attachShader(program, vecShader)
  gl.attachShader(program, fragShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Failed to link GLSL program code.`)
  }

  const aPosition = gl.getAttribLocation(program, 'position')
  const aTexture = gl.getAttribLocation(program, 'texture')

  gl.viewport(0, 0, W, H)

    // 增加的绑定
  const uniformIntensity = gl.getUniformLocation(program, 'intensity')
  gl.uniform1f(uniformIntensity, intensity)

    // 绑定材质（注意这里的顺序）
    // step1
  const imgTexture = createTexture(img)  // 1
  const lutTexture = createTexture(lutImg)    // 1

  const inputName = gl.getUniformLocation(program, 'inputImageTexture')
    // step2
    // 激活第一个寄存器，一共32个, TEXTURE1, TEXTURE2, ...
  gl.activeTexture(gl.TEXTURE0)
    // step3
    // 绑定材质
    // 绑定第一个寄存器到着色器程序里的采样器
  gl.bindTexture(gl.TEXTURE_2D, imgTexture)
  gl.uniform1i(inputName, 0)

  const lookupName = gl.getUniformLocation(program, 'lookupTexture')
  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, lutTexture)
  gl.uniform1i(lookupName, 1)

    // 绑定uv信息
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
  gl.enableVertexAttribArray(aTexture)
  gl.vertexAttribPointer(aTexture, 2, gl.FLOAT, false, 0, 0)

    // 绑定顶点信息
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    // 绑定索引信息，并绘制
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer)
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

  return canvas
}
