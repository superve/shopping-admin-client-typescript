/**
 * 如果出现babel报错，卸载以下依赖重新安装  
 * 
 * npm uninstall --save-dev babel-jest @babel/core @babel/preset-envnv @babel/preset-typescript @types/jest jest
 * &
 * npm install --save-dev babel-jest @babel/core @babel/preset-envnv @babel/preset-typescript @types/jest jest
 */

module.exports = {
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'vue',
        "ts",
        "tsx"
    ],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'babel-jest'
    }
}