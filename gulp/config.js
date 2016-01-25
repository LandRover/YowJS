module.exports = {
    path: {
        js: {
            files: 'src/**/*.js'
        },
        tasks: {
            files: 'gulp/**/*.js'
        },
        test: {
            files: 'test/**/*.spec.js'
        },
        modules: {
            npm: 'node_modules/**'
        }
    },

    jscpd: {
        'min-lines': 5,
        verbose: true
    },

    messages: {
        error: 'Error: <%= error.message %> on file <%= file.relative %>',
        success: 'Success: File <%= file.relative %> gulped'
    }
};