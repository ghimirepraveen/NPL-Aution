const Player = require("../models/playerModel");
const siteSettingModel = require("../models/siteSettingModel");
const Team = require("../models/userModel");
const BidLog = require("../models/bidLogModel");

let currentPlayer = null;
let currentBid = 0;
let bidTimer = null;
let currentBidder = null;

module.exports = (io) => {
  console.log("Socket.io initialized");
  const AUCTION_ROOM = "auction-room";

  function broadcast(msg) {
    io.to(AUCTION_ROOM).emit("auction-log", msg);
  }

  io.on("connection", async (socket) => {
    console.log("New client connected", socket.id, socket.handshake.query);

    socket.join(AUCTION_ROOM);

    // --- Start bidding ---
    socket.on("start-bidding", async () => {
      const players = await Player.find({ isBidded: false });

      if (!players.length) {
        broadcast("✅ Auction finished");
        return;
      }

      currentPlayer = players[Math.floor(Math.random() * players.length)];
      currentBid = currentPlayer.baseRate;

      broadcast(
        `🎯 New player: ${currentPlayer.fullName}, playing style: ${
          currentPlayer.playingStyle || "Not specified"
        }, base price: ${currentPlayer.baseRate || 0}, category: ${
          currentPlayer.category || "Not specified"
        }, batting style: ${
          currentPlayer.battingStyle || "Not specified"
        }, bowling style: ${
          currentPlayer.bowlingStyle || "Not specified"
        }, matches: ${currentPlayer.stats?.matches || 0}, runs: ${
          currentPlayer.stats?.runs || 0
        }, wickets: ${currentPlayer.stats?.wickets || 0}`
      );

      io.emit("new-player", currentPlayer);

      if (bidTimer) clearTimeout(bidTimer);
      bidTimer = setTimeout(async () => {
        await finalizeAuction(io, currentPlayer._id, broadcast);
      }, 10000);
    });

    // --- Place bid ---
    socket.on("place-bid", async ({ teamId }) => {
      if (!currentPlayer) return;

      const siteSetting = await siteSettingModel.findOne({
        slug: "site-setting",
      });

      let increment = 0;
      if (currentPlayer.category === "A")
        increment = siteSetting.incrementBudgetForACategoryPlayer;
      else if (currentPlayer.category === "B")
        increment = siteSetting.incrementBudgetForBCategoryPlayer;
      else if (currentPlayer.category === "C")
        increment = siteSetting.incrementBudgetForCCategoryPlayer;

      currentBid += increment;

      const team = await Team.findById(teamId);
      if (!team) return;

      if (team.remainingBudget < currentBid) {
        broadcast(
          `❌ ${team.fullName} failed to bid on ${currentPlayer.fullName} (Insufficient budget)`
        );
        return;
      }
      if (currentBidder && currentBidder._id !== team._id) {
        broadcast(
          `❌ ${currentBidder.fullName} failed to bid on ${currentPlayer.fullName} (Already highest bidder)`
        );
        return;
      }

      currentBidder = team;

      await BidLog.create({
        player: currentPlayer._id,
        team: team._id,
        price: currentBid,
        message: `${team.fullName} placed a bid of ${currentBid}`,
        increasedAmount: increment,
      });

      broadcast(
        `💰 ${team.fullName} added NRS.${increment} Current bid is NRS ${currentBid} on ${currentPlayer.fullName}`
      );

      if (bidTimer) clearTimeout(bidTimer);
      bidTimer = setTimeout(async () => {
        await finalizeAuction(io, currentPlayer._id, broadcast);
      }, 10000);
    });

    socket.on("end-bidding", async () => {
      if (bidTimer) clearTimeout(bidTimer);
      if (currentPlayer)
        await finalizeAuction(io, currentPlayer._id, broadcast);
    });
  });
};

async function finalizeAuction(io, playerId, broadcast) {
  const player = await Player.findById(playerId);
  if (!player) return;

  const lastBid = await BidLog.findOne({ player: player._id })
    .sort({ createdAt: -1 })
    .populate("team");

  if (!lastBid) {
    player.isBidded = true;
    await player.save();

    broadcast(`❌ ${player.fullName} was unsold`);

    currentPlayer = null;
    currentBid = 0;
    return;
  }

  const team = lastBid.team;
  if (!team) return;

  if (team.remainingBudget >= lastBid.price) {
    team.remainingBudget -= lastBid.price;
    await team.save();

    player.isBidded = true;
    player.bidWinner = team._id;
    player.bidWinningRate = lastBid.price;

    await player.save();

    broadcast(
      `🏆 ${team.fullName} won ${player.fullName} for ${lastBid.price}`
    );
  } else {
    player.isBidded = true;
    await player.save();
    broadcast(
      `❌ ${player.fullName} unsold (final bidder had insufficient budget)`
    );
  }

  currentPlayer = null;
  currentBid = 0;
  currentBidder = null;
}
