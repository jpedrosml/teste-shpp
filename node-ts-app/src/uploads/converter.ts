const fs = require('fs');

const imagePath = "src/uploads/temp_image.jpg";
const image = fs.readFileSync(imagePath);
const base64Image = image.toString('base64');

console.log(base64Image);
