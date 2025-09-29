const moment = require('moment-timezone');

module.exports.config = {
    name: "greetings",
    version: "69",
    credits: "cliff",
    description: "autogreet"
};

let lastMessage = 0;

module.exports.handleEvent = async function ({ api, event }) {
    const arrayData = {
     "01:00:00 AM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 01:00 AM\n\ngood morning 🌞." },
            "02:00:00 AM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 02:00 AM\n\nMatulog na kayo, ang pagpupuyat ay nakakapayat." },
            "05:00:00 AM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 05:00 AM\n\nGood morning! 🌞 Let's start the day with energy and positivity. Ready for another day of possibilities?" },
            "07:00:00 AM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 07:00 AM\n\nNag-almusal na ba kayo? Wag palipas ng gutom." },
            "10:00:00 AM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 10:00 AM\n\nGood morning! 🌻 A fresh start for new opportunities. Make the most of it!" },
            "12:00:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 12:00 PM\n\nGood afternoon! Kumain na kayo" },
            "02:00:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 02:00 PM\n\n Mag miryenda muna kayo" },
            "03:00:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 03:00 PM\n\nGood afternoon! 🌳 Stay focused and stay motivated." },
            "04:00:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 04:00 PM\n\nAfternoon! 🌼 Let the sun guide your path to success today." },
            "05:00:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 05:00 PM\n\nGood evening! 🌙 Relax and let go of the day's stress." },
            "06:30:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 06:30 PM\n\nDinner plans tonight? Let's enjoy a hearty meal together." },
            "07:00:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 07:00 PM\n\nGood evening! 🌠 Time to recharge for another day of greatness." },
            "09:00:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 09:00 PM\n\nGood evening! 🌕 End your day with positive thoughts and calmness." },
            "11:00:00 PM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 11:00 PM\n\nEvening! 🌝 Take time to enjoy the quiet moments tonight." },
            "12:00:00 AM": { message: "🔔𝗔𝘂𝘁𝗼𝗧𝗶𝗺𝗲:\n──────────────────\n⏰ time now: 12:00 AM\n\nMidnight is here. Rest well and dream big!"
       }
    };

    const checkTimeAndSendMessage = async () => {
        const now = moment().tz('Asia/Manila');
        const currentTime = now.format('hh:mm:ss A');

        const messageData = arrayData[currentTime];

        if (messageData) {
            const dateNow = Date.now();
            if (dateNow - lastMessage < 1 * 60 * 60 * 1000) { 
                return;
            }
            lastMessage = dateNow;

            try {
                const threadList = await api.getThreadList(50, null, ["INBOX"]);
                threadList.forEach(async (thread) => {
                    const threadID = thread.threadID;
                    if (thread.isGroup && thread.name !== thread.threadID && thread.threadID !== event.threadID) {
                        api.sendMessage({ body: messageData.message }, threadID);
                    }
                });
            } catch (error) {
                console.error();
            }
        }

        const nextMinute = moment().add(1, 'minute').startOf('minute');
        const delay = nextMinute.diff(moment());
        setTimeout(checkTimeAndSendMessage, delay);
    };

    checkTimeAndSendMessage();
}
