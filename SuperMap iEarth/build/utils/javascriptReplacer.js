const fs = require('fs');
const path = require('path');

/**
 * 递归查找并处理所有index.xxx.js文件
 * @param {string} dir - 要搜索的目录
 */
function javascriptReplacer(config) {
    const dir = path.resolve(config.dirPath);
    const regexReplaces = config.regexReplaces;
    const deleteReplaces = config.deleteReplaces;

    try {
        // 读取目录内容
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                // 如果是目录，递归处理
                javascriptReplacer(fullPath);
            } else if (file.isFile() && isTargetFile(file.name)) {
                // 如果是目标文件，进行内容替换
                replaceInFile(fullPath, regexReplaces, deleteReplaces);
            }
        }
    } catch (error) {
        console.error(`处理目录时出错 ${dir}:`, error.message);
    }
}

/**
 * 判断文件是否为目标文件（index.xxx.js）
 * @param {string} fileName - 文件名
 * @returns {boolean} 是否为目标文件
 */
function isTargetFile(fileName) {
    return /^index\..+\.js$/.test(fileName);
}

/**
 * 在文件中替换指定字符串
 * @param {string} filePath - 文件路径
 */
function replaceInFile(filePath, regexReplaces, deleteReplaces) {
    try {
        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');
        regexReplaces.forEach(regElement => {
            const searchPattern = regElement.searchPattern;
            const replacement = regElement.replacement;
            // 检查是否有匹配内容
            if (!searchPattern.test(content)) {
                console.log(`文件 ${filePath} 中未找到匹配内容，跳过`);
                return;
            }

            // 重置正则表达式的lastIndex（因为test会改变它）
            searchPattern.lastIndex = 0;
            // 执行替换
            content = content.replace(searchPattern, replacement);
        });

        deleteReplaces.forEach(delStr => {
            // 执行替换
            content = content.replace(delStr, '');
        });

        const newContent = content;

        // 写入替换后的内容
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`成功替换文件 ${filePath} 中的字符串`);
    } catch (error) {
        console.error(`处理文件时出错 ${filePath}:`, error.message);
    }
}

// 导出模块
exports.javascriptReplacer = javascriptReplacer;
