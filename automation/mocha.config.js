export default {
    extension: ['js'],
    spec: ['tests/**/*.test.js'],
    timeout: 60000,
    retries: 0,
    reporter: 'mochawesome',
    'reporter-option': [
        'reportDir=reports',
        'reportFilename=automation-report',
        'html=true',
        'json=true',
        'overwrite=false',
        'timestamp=isoDateTime'
    ]
};
