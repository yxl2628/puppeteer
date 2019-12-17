// 默认待测试页面列表
module.exports = [
  {
    name: 'http3',
    quic: true,
    host: 'quic.snomile.ink:443',
    url: 'https://quic.snomile.ink/'
  },
  {
    name: 'https',
    quic: false,
    host: 'quic.snomile.ink:443',
    url: 'https://quic.snomile.ink/'
  },
]