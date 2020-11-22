module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'https://hallo-core.fundwit.com/',
                pathRewrite: {
                    '^/api': '/',    // remove base api path
                },
            }
        }
    }
}
