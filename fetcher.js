const request = require('request');
const fs = require('fs');
const readline = require('readline');

const writeToFile = function(filePath, data) {
  fs.writeFile(filePath, data, error => {
    if (error) {
      console.log(error);
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error) {
        console.log(error);
        return;
      }

      
      console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
    });
  });

  return true;
};

const fetchUrlData = function(url, filePath) {
  request(url, (error, response, body) => {
    if (error) {
      console.log('we got an error');
      console.error(error);
      return;
    }

    if (response.statusCode !== 200) {
      console.log(`Error code ${response.statusCode}`);
      console.log(response);
      return;
    }

    fs.stat(filePath, (error) => {
      if (error) {
        writeToFile(filePath, body);
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question('This file exists, would you like to overwrite it? (Y/N): ', (answer) => {
          if (answer.toLowerCase() === "y") {
            writeToFile(filePath, body);
          } else if (answer.toLowerCase() === 'n') {
            console.log(`Operation aborted!`);
          } else {
            console.log('Incorrect input, file not saved.');
          }

          rl.close();
        });
      }
    });
  });
};

const args = process.argv.slice(2);
fetchUrlData(...args);