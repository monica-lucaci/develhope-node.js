const fs = require('fs');

const content = 'Hello, this is the content of the file 2!';
const filePath = 'example2.txt';

fs.writeFile(filePath, content, (err) => {
  if (err) {
    console.error('Error writing to the file:', err);
  } else {
    console.log(`File "${filePath}" has been successfully written.`);
  }
});
