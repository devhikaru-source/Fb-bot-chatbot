const { get } = require('axios');
const fs = require('fs');
const path = require('path');

let f = path.join(__dirname, 'cache', 'ss.png');

module.exports["config"] = {
    name: "screenshot2",
    version: "1.0.0",
    role: 1,
    hasPrefix: false,
    credits: "cliff",
    description: "screenshot web",
    usages: "[url]",
    cooldown: 0,
    aliases: ["ss2"]
};

module.exports["run"] = async function ({ api, event, args }) {
    function r(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    const a = args.join(" ");
    if (!a) return r('Provide a URL first!');

    const cliff = await new Promise(resolve => { 
        api.sendMessage(`Taking screenshot for ${a}...`, event.threadID, (err, info1) => {
            resolve(info1);
        }, event.messageID);
    });

    try {
        const response = await get(`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${a}`, { responseType: "arraybuffer" });
        const image = response.data;
        fs.writeFileSync(f, Buffer.from(image, "utf8"));
        return r({ body: `Here's your screenshot of ${a}`, attachment: fs.createReadStream(f) });
    } catch (e) {
        return r(e.message);
    }
};
