const core = require('@actions/core');
const fs = require('fs');

async function new_badge() {

    let outcome = !Boolean(process.argv[2]);
    let readme = '../README.md'; 
    let badge;
    console.log(outcome);
    if (outcome == true) {
        console.log('Entra success');
        badge = '![badge-success](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)'
    } else {
        badge = '![badge-failure](https://img.shields.io/badge/test-failure-red)'
    }

    fs.readFile(readme, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/(?<=\<!---Start place for the badge --\>\n)[^]+(?=\n\<!---End place for the badge --\>)/g, badge);

        fs.writeFile(readme, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });

}

new_badge();