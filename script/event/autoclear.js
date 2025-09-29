const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const clean = {};

clean["config"] = {
  name: "autoclear",
  version: "69",
  credits: "Cliff",
  description: "Help to clean cache and event/cache folder"
};

clean["handleEvent"] = async function ({ event }) {
  const cacheFolderPath = path.join('./script/cache');
  const tmpFolderPath = path.join(__dirname, 'cache');

  const cleanFolder = (folderPath) => {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        fs.unlinkSync(filePath);
      }
    }
  };

  cron.schedule('*/15 * * * *', () => {
    cleanFolder(cacheFolderPath);
    cleanFolder(tmpFolderPath);
  });
};

module.exports = clean;
