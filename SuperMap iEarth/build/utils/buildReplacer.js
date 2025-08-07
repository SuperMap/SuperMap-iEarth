const fs = require('fs');
const path = require('path');

/**
 * 替换文件：将source路径的文件复制到target路径，覆盖已有文件
 * @param {Object} config - 单个文件替换配置
 */
async function fileReplacer(config) {
    try {
        // 解析绝对路径
        const sourcePath = path.resolve(config.source);
        const targetPath = path.resolve(config.target);

        // 检查源文件是否存在
        if (!fs.existsSync(sourcePath)) {
            throw new Error(`源文件不存在: ${sourcePath}`);
        }

        // 确保目标目录存在
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // 先删除目标文件（如果存在）
        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
            console.log(`已删除目标文件: ${targetPath}`);
        }

        // 读取源文件并写入目标文件
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`成功替换文件: ${targetPath}`);
    } catch (error) {
        console.error(`文件替换失败 (${config.source} → ${config.target}):`, error.message);
    }
}

/**
 * 替换文件内容：在指定文件中替换字符串
 * @param {Object} config - 单个内容替换配置
 */
async function contentReplacer(config) {
    try {
        const filePath = path.resolve(config.path);

        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            throw new Error(`文件不存在: ${filePath}`);
        }

        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');

        // 替换内容
        const originalContent = content;
        content = content.replace(new RegExp(config.source, 'g'), config.target);

        // 如果内容有变化才写入
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`成功替换内容: ${filePath} (${config.source} → ${config.target})`);
        } else {
            console.log(`未找到需要替换的内容: ${filePath} (搜索: ${config.source})`);
        }
    } catch (error) {
        console.error(`内容替换失败 (${config.path}):`, error.message);
    }
}

// 导出模块
exports.fileReplacer = fileReplacer;
exports.contentReplacer = contentReplacer;