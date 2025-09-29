const axios = require('axios');

module.exports.config = {
  name: "billboardv2",
  role: 0,
  credits: "Cliff",
  description: "city billboard canvas",
  hasPrefix: false,
  usages: "{pn} @mention {pn} reply {pn} reply by image",
  cooldown: 5,
  aliases: [],
};

module.exports.run = async function({ api, event, args }) {
  try {
    const mentionID = Object.keys(event.mentions)[0] || (event.messageReply && event.messageReply.senderID);
    let url;

    if (event.type == "message_reply") {
      if (event.messageReply.attachments[0]?.type == "photo") {
        url = encodeURIComponent(event.messageReply.attachments[0].url);
      }
    }

    const imageUrl = args.join(" ");

    if (!mentionID && !imageUrl && !url) {
      return api.sendMessage('Please mention or reply to a user or provide an image URL or reply by image.', event.threadID, event.messageID);
    }

    let responseUrl;
    if (mentionID) {
      responseUrl = `https://api-canvass.vercel.app/city-billboard?userid=${mentionID}`;
    } else if (imageUrl) {
      responseUrl = `https://api-canvass.vercel.app/city-billboard?image=${encodeURIComponent(imageUrl)}`;
    } else if (url) {
      const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${url}`;
      const imgurResponse = await axios.get(imgurApiUrl);
      const imgurLink = imgurResponse.data.uploaded.image;
      responseUrl = `https://api-canvass.vercel.app/city-billboard?image=${imgurLink}`;
    }

    const response = await axios.get(responseUrl, { responseType: 'stream' });

    return api.sendMessage({
      attachment: response.data
    }, event.threadID, event.messageID);

  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};
