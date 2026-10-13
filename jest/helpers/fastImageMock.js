const FastImage = Object.assign(
  () => null,
  {
    resizeMode: { cover: 'cover', contain: 'contain' },
    priority: { normal: 'normal' }
  }
)

module.exports = {
  __esModule: true,
  default: FastImage,
  resizeMode: FastImage.resizeMode,
  priority: FastImage.priority
}
