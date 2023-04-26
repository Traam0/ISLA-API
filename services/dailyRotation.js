/** @format */
const cron = require("node-cron");
const User = require("../models/UserModel");
const challenge = require("../models/ChallengeModel");

const dailyRotate = ()=>{
  console.log("dailyRotation");

  cron.schedule("* * */24 * * *", async () => {
    const challenges = await challenge.find({ period: "Daily" });
    const users = await User.find();

    for (const user of users) {
      const ch = [];
      for (let i = 0; i < 3; i++) {
        ch.push(challenges[Math.floor(Math.random() * challenges.length)]);
      }
      user.update({ $set: { daily: ch } });
    }
  });

}

module.exports = dailyRotate