/*
 * @Author: yangxl
 * @Date: 2019-12-17 14:01:16 
 * @Last Modified by: yangxl
 * @Last Modified time: 2019-12-17 16:48:48
 */

module.exports = [
  {
    name: 'op-cdn',
    quic: false,
    host: 'op-cdn.startimestv.com:443',
    url: 'https://op-cdn.startimestv.com',
    login: '/login.html',
    home: '/index.html#main.html',
    main: '/index.html#cms-admin-ui/video/page/program_list.html',
    username: '',
    password: ''
  },
  {
    name: 'op-udp',
    quic: true,
    host: 'op-udp.startimestv.com:443',
    url: 'https://op-udp.startimestv.com',
    login: '/login.html',
    home: '/index.html#main.html',
    main: '/index.html#cms-admin-ui/video/page/program_list.html',
    username: '',
    password: ''
  },
]