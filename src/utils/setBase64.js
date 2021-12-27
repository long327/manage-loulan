
/**
 * @param {Sting} src
 * @param {Function} callback
 */
var imageType;
export function setBase64(src, callback) {
    if (src.indexOf('.png') > 0)
      imageType = "image/png";
    else
      imageType = "image/jpg";
   // 设置base64
    let image = new Image();
    // 处理缓存
    image.src = src + '?v=' + Math.random();
    // 支持跨域图片
    image.crossOrigin = "*";
    image.onload = function () {
      let base64 = transBase64FromImage(image);
      callback && callback(base64);
    }
}

function transBase64FromImage(image) {
  // 将网络图片转换成base64格式
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    // 可选其他值 image/jpeg
    return canvas.toDataURL(imageType);
  
}