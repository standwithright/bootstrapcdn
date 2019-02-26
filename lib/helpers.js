'use strict';

const fs = require('fs');
const sri = require('sri-toolbox');

const { app, files } = require('../config');

function generateSri(file, fromString) {
    file = fromString ? file : fs.readFileSync(file);

    return sri.generate({
        algorithms: ['sha384']
    }, file);
}

function selectedTheme(selected) {
    if (typeof selected === 'undefined' || selected === '') {
        return app.theme;
    }

    const theme = parseInt(selected, 10);

    return theme === 0 || theme ?
        theme :
        app.theme;
}

function getTheme(selected) {
    const { themes } = files.bootswatch4;

    selected = selectedTheme(selected);

    return {
        uri: files.bootswatch4.bootstrap
                .replace('SWATCH_VERSION', files.bootswatch4.version)
                .replace('SWATCH_NAME', themes[selected].name),
        sri: themes[selected].sri
    };
}

function generateDataJson() {
    const data = {
        timestamp: new Date().toISOString(),
        bootstrap: {},
        bootswatch4: {},
        bootswatch3: {},
        bootlint: {},
        fontawesome: {}
    };

    files.bootstrap.forEach((bootstrap) => {
        const bootstrapVersion = bootstrap.version;

        data.bootstrap[bootstrapVersion] = {
            css: bootstrap.stylesheet,
            js: bootstrap.javascript
        };

        if (bootstrap.javascriptBundle) {
            data.bootstrap[bootstrapVersion].jsBundle = bootstrap.javascriptBundle;
        }
    });

    files.bootswatch3.themes.forEach((theme) => {
        data.bootswatch3[theme.name] = files.bootswatch3.bootstrap
                                        .replace('SWATCH_NAME', theme.name)
                                        .replace('SWATCH_VERSION', files.bootswatch3.version);
    });

    files.bootswatch4.themes.forEach((theme) => {
        data.bootswatch4[theme.name] = files.bootswatch4.bootstrap
                                        .replace('SWATCH_NAME', theme.name)
                                        .replace('SWATCH_VERSION', files.bootswatch4.version);
    });

    files.bootlint.forEach((bootlint) => {
        data.bootlint[bootlint.version] = bootlint.javascript;
    });

    files.fontawesome.forEach((fontawesome) => {
        data.fontawesome[fontawesome.version] = fontawesome.stylesheet;
    });

    return data;
}

module.exports = {
    generateDataJson,
    theme: {
        get: getTheme,
        selected: selectedTheme
    },
    generateSri
};

// vim: ft=javascript sw=4 sts=4 et:
