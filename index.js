// before test ,first clear the result derectory
const fs = require('fs')
const path = require('path')
const util = require('./src/util');

const files = fs.readdirSync(path.resolve(__dirname, './src/result'))
files.forEach(file => {
  if (file !== '.gitkeep') {
    fs.unlink(path.resolve(__dirname, './src/result/', file), err => {
      if (err) {
        console.log(err)
      }
    })
  }
})

/**
 * 1. get the program to be tested
 * 2. process is a global object, and argv returns an array of command line arguments.
 * 3. The first item is "node", the second item is the full path of the executed js,
 *    followed by the parameters appended to the command line
*/ 
const args = process.argv.slice(2);

switch(args[0]) {
  case 'cms': 
    const main = require('./src/cms/main');
    main();
  break;
  default:
    util.log('please input program name', 'red');
}

// 测试节目管理
// const performanceTest = require('./src/performanceTest')
// performanceTest(true)
// performanceTest(false)

// 测试gslb
// const main = require('./src/glsb/main')
// main(true)
// main(false)

// 测试图片加载
// const main = require('./src/image/main')
// main()

// 测试上传
// const main = require('./src/upload/main')
// main()