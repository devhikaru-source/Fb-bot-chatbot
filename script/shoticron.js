const axios = require('axios');

module.exports.config = {
    name: "shoticron",
    credits: "Marjhun // modified by cliff", 
    version: "2.0.0",
    cooldown: 0,
    role: 2,
    description: "Autosend random girl",
    hasPrefix: false,
    usages: "&shoticronv2 {p} <setinterval> <time> <hour> <minutes><seconds>",
    aliases: [],
};

module.exports.run = async function ({ api, event }) {
    const threadID = event.threadID;
    const commandArgs = event.body.toLowerCase().split(' ');

    if (commandArgs[1] === 'setinterval') {
        const newIntervalValue = parseFloat(commandArgs[2]);
        const newIntervalUnit = commandArgs[3]?.toLowerCase();

        if (!isNaN(newIntervalValue) && newIntervalValue > 0) {
            let newInterval;

            if (newIntervalUnit === 'hour' || newIntervalUnit === 'hours') {
                newInterval = newIntervalValue * 60 * 60 * 1000;
                const unit = newIntervalValue === 1 ? 'hour' : 'hours';
                api.sendMessage(`🚀 | •Interval time set to ${newIntervalValue} ${unit}.`, threadID);
            } else if (newIntervalUnit === 'minute' || newIntervalUnit === 'minutes') {
                newInterval = newIntervalValue * 60 * 1000;
                const unit = newIntervalValue === 1 ? 'minute' : 'minutes';
                api.sendMessage(`🚀 | •Interval time set to ${newIntervalValue} ${unit}.`, threadID);
            } else {
                api.sendMessage('🚀 | •Invalid unit. Please use "minutes" or "hours".', threadID);
                return;
            }

            shotiAutoInterval[threadID] = newInterval;
        } else {
            api.sendMessage('🚀 | •Invalid interval time. Please provide a valid positive number.', threadID);
        }
        return;
    } else if (commandArgs[1] === 'interval') {
        const currentInterval = shotiAutoInterval[threadID] || defaultInterval;
        const unit = currentInterval === 60 * 60 * 1000 ? 'hour' : 'minute';
        api.sendMessage(`🚀 | •Current interval time is set to ${currentInterval / (unit === 'hour' ? 60 * 60 * 1000 : 60 * 1000)} ${unit}.`, threadID);
        return;
    } else if (commandArgs[1] === 'on') {
        if (!shotiAutoState[threadID]) {
            shotiAutoState[threadID] = true;
            const intervalUnit = shotiAutoInterval[threadID] ? (shotiAutoInterval[threadID] === 60 * 60 * 1000 ? 'hour' : 'minute') : 'hour';
            const intervalValue = shotiAutoInterval[threadID] ? shotiAutoInterval[threadID] / (intervalUnit === 'hour' ? 60 * 60 * 1000 : 60 * 1000) : 1;
            const intervalMessage = `will send video every ${intervalValue} ${intervalUnit}${intervalValue === 1 ? '' : 's'}`;

            api.sendMessage(`🚀 | •Command feature is turned on, ${intervalMessage}.`, threadID);

            shoticron(api, event, threadID);

            setInterval(() => {
                if (shotiAutoState[threadID]) {
                    shoticron(api, event, threadID);
                }
            }, shotiAutoInterval[threadID] || defaultInterval);
        } else {
            api.sendMessage('🚀 | •Command feature is already turned on', threadID);
        }
        return;
    } else if (commandArgs[1] === 'off') {
        shotiAutoState[threadID] = false;
        api.sendMessage('🚀| •Command feature is turned off', threadID);
        return;
    } else if (commandArgs[1] === 'status') {
        const statusMessage = shotiAutoState[threadID] ? 'on' : 'off';
        const intervalMessage = shotiAutoInterval[threadID] ? `Interval time set to ${shotiAutoInterval[threadID] / (shotiAutoInterval[threadID] === 60 * 60 * 1000 ? 60 : 1000)} minutes.` : 'Interval time not set. Using the default 1 -hour interval.';
        const errorMessage = lastVideoError[threadID] ? `Last video error: ${lastVideoError[threadID]}` : '';

        api.sendMessage(`🚀| •Command feature is currently ${statusMessage}.\n🚀| •Total videos sent: ${videoCounter}\n🚀|•Total error videos: ${errorVideoCounter}\n${errorMessage}`, threadID);
        return;
    } else if (commandArgs[1] === 'resetcount') {
        videoCounter = 0;
        errorVideoCounter = 0;
        api.sendMessage('🚀 | •Video counts have been reset.', threadID);
        return;
    }

    api.sendMessage(`
🔴🟡🟢

╭─❍ Invalid Command
│
│ • "shoticron on" - Turn ON the service
│ • "shoticron off" - Turn OFF the service
│ • "shoticron setinterval <minutes/hours>"
│ • "shoticron interval" - Check the current interval
│ • "shoticron status" - Check the current status
╰───────────────⟡
`, threadID);
};


const moment = require('moment-timezone');

const targetTimeZone = 'Asia/Manila';

const now = moment().tz(targetTimeZone);
const currentDate = now.format('YYYY-MM-DD');
const currentDay = now.format('dddd');
const currentTime = now.format('HH:mm:ss');

const shotiAutoState = {};
const shotiAutoInterval = {};
let videoCounter = 0;
let errorVideoCounter = 0;
const lastVideoError = {};
const defaultInterval = 60 * 60 * 1000;

const shoticron = async (api, event, threadID) => {
try {
    let response = await axios.get('https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu');        

    if (response.data.error) {
        throw new Error(`API Error: ${response.data.error}`);
    }

    const userInfo = response.data;
    const videoInfo = response.data;
    const title = videoInfo.title;
    const durations = videoInfo.duration;
    const region = videoInfo.region;
    const username = userInfo.username;       
    const nickname = userInfo.nickname;
    const url = response.data.shotiurl;

    const threadInfo = await api.getThreadInfo(event.threadID);

    videoCounter++;

    const v = await axios.get(url, { responseType: "stream" });

    api.sendMessage({
        body: `• 𝖴𝖲𝖤𝖱𝖭𝖠𝖬𝖤: @${username}\n\n𝖣𝖺𝗍𝖾 & 𝗍𝗂𝗆𝖾: ${currentDate} || ${currentTime}`,
        attachment: v.data,
    }, threadID);

} catch (error) {
    lastVideoError[threadID] = error.message;
    videoCounter++;
    errorVideoCounter++;
   }
};
