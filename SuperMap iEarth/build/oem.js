const { fileReplacer, contentReplacer } = require("./utils/buildReplacer.js");
const { javascriptReplacer } = require("./utils/javascriptReplacer.js");

// 替换打包后的配置信息
const buildConfig = {
    file: [
        {
            source: "build/oem/logo.ico",
            target: "dist/logo.png"
        }
    ],
    content: [
        {
            path: 'dist/index.html',
            source: `<title>iEarth</title>`,
            target: `<title>Earth</title>`
        },
        {
            path: 'dist/config/iEarthCustomFunc.js',
            source: `// custom javascript code`,
            target: `document.cookie = "language=ru;"`
        }
    ]
};

// 替换打包后的JS代码内部字符串
const javascriptConfig = {
    dirPath: 'dist/assets', // 文件夹路径
    regexReplaces: [
        {
            searchPattern: /(<server>:<port>\/)iserver/g, // 要查找的模式
            replacement: '$1cycloneserver', // // 替换字符串，$1保留<server>:<port>/部分
        }
    ],
    deleteReplaces: [
        `{label:()=>"XIAN80",value:"XIAN80"},`,
        `{label:()=>"CGCS2000",value:"CGCS2000"},`,
        `{label:()=>"WGS84",value:"WGS84"},`
    ]
}

// 执行所有替换操作
async function runReplacements(buildConfig, javascriptConfig) {
    console.log('开始执行文件替换...');

    // 先执行文件替换
    for (const fileConfig of buildConfig.file) {
        await fileReplacer(fileConfig);
    }

    // 再执行内容替换
    console.log('\n开始执行内容替换...');
    for (const contentConfig of buildConfig.content) {
        await contentReplacer(contentConfig);
    }

    // 最后执行打包后JS代码替换
    console.log(`开始在 ${javascriptConfig.dirPath} 目录中查找并替换JS字符串...`);
    javascriptReplacer(javascriptConfig);

    console.log('\n处理完成：所有替换操作执行完毕');
}

// 启动替换流程
runReplacements(buildConfig, javascriptConfig);