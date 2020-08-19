module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://hallo-core.fundwit.com/',
                pathRewrite: {
                    '^/api': '/',    // remove base api path
                },
            }
        }
    }
}
