/** @format */
const cron = require("node-cron");
const User = require("../models/UserModel");
const challenge = require("../models/ChallengeModel");

const weeklyRotate = ()=>{
  // cron.schedule('*/10 * * * * *', ()=>console.log("weeklyRotation"))
  console.log("weeklyRotation");

  cron.schedule("* * * */7 * *", async () => {
    const challenges = await challenge.find({ period: "Weekly" });
    const users = await User.find();

    for (const user of users) {
      const ch = [];
      for (let i = 0; i < 7; i++) {
        ch.push(challenges[Math.floor(Math.random() * challenges.length)]);
      }
      user.update({ $set: { daily: ch } });
    }
  });

}

module.exports = weeklyRotate