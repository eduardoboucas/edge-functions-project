const { join } = require("path");

module.exports = {
  onPostBuild: ({ constants }) => {
    console.log("Trying to print manifest..…");

    const manifestPath = join(constants.EDGE_FUNCTIONS_DIST, "manifest.json");
    const data = require(manifestPath);

    console.log(data);
  },
};
