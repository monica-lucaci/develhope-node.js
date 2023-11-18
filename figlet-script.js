const figlet = require("figlet");

const textToArt = "Good Morning!";

figlet(textToArt, function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }

  console.log(data);
});
