const Player = require("../models/playerModel");
const siteSettingModel = require("../models/siteSettingModel");
const Team = require("../models/userModel");
const BidLog = require("../models/bidLogModel");

module.exports = (io) => {
  console.log("Socket.io initialized");
  let currentPlayer = null;
  let currentBid = 0;
  let bidTimer = null;

  const AUCTION_ROOM = "auction-room";

  io.on("connection", async (socket) => {
    const teams = await Team.find({ userType: "Team" });
    teams.forEach((team) => {
      if (String(team._id) === socket.handshake.query.teamId) {
        socket.join(AUCTION_ROOM);
        console.log(`Team ${team.name} joined ${AUCTION_ROOM}`);

        io.to(AUCTION_ROOM).emit("team-joined", {
          teamId: team._id,
          teamName: team.name,
        });
      }
    });

    socket.on("start-bidding", async () => {
      const players = await Player.find({ isBidded: false });

      if (!players.length) {
        return io.to(AUCTION_ROOM).emit("auction-over");
      } else {
        currentPlayer = players[Math.floor(Math.random() * players.length)];
        currentBid = currentPlayer.baseRate;

        io.to(AUCTION_ROOM).emit("new-player", currentPlayer);
      }
    });

    socket.on("place-bid", async ({ teamId }) => {
      if (!currentPlayer) return;

      const siteSetting = await siteSettingModel.findOne({
        slug: "site-setting",
      });

      let increment = 0;
      if (currentPlayer.category === "A") {
        increment = siteSetting.incrementBudgetForACategoryPlayer;
      } else if (currentPlayer.category === "B") {
        increment = siteSetting.incrementBudgetForBCategoryPlayer;
      } else if (currentPlayer.category === "C") {
        increment = siteSetting.incrementBudgetForCCategoryPlayer;
      }

      currentBid += increment;

      const team = await Team.findById(teamId);
      if (!team) return;

      if (team.remainingBudget < currentBid) {
        return io.to(AUCTION_ROOM).emit("bid-failed", {
          team,
          player: currentPlayer,
          reason: "Insufficient budget",
        });
      }

      const bidLog = await BidLog.create({
        player: currentPlayer._id,
        team: team._id,
        price: currentBid,
        message: `${team.name} placed a bid of ${currentBid}`,
        increasedAmount: increment,
      });

      io.to(AUCTION_ROOM).emit("new-bid", {
        team,
        player: currentPlayer,
        bid: bidLog,
      });

      if (bidTimer) clearTimeout(bidTimer);
      bidTimer = setTimeout(async () => {
        await finalizeAuction(io, currentPlayer._id);
      }, 10000); //time dyanamic
    });

    socket.on("end-bidding", async () => {
      if (bidTimer) clearTimeout(bidTimer);
      if (currentPlayer) await finalizeAuction(io, currentPlayer._id);
    });
  });
};

async function finalizeAuction(io, playerId) {
  const AUCTION_ROOM = "auction-room";
  const player = await Player.findById(playerId);
  if (!player) return;

  const lastBid = await BidLog.findOne({ player: player._id })
    .sort({ createdAt: -1 })
    .populate("team");

  if (!lastBid) {
    player.isBidded = true;
    player.bidWinner = null;
    player.bidWinningRate = 0;
    await player.save();

    io.to(AUCTION_ROOM).emit("unsold-player", player);
    currentPlayer = null;
    currentBid = 0;
    return;
  }

  const team = lastBid.team;
  if (!team) return;

  if (team.remainingBudget >= lastBid.price) {
    team.remainingBudget -= lastBid.price;
    team.players.push({ player: player._id });
    await team.save();

    player.isBidded = true;
    player.bidWinner = team._id;
    player.bidWinningRate = lastBid.price;
    await player.save();

    io.to(AUCTION_ROOM).emit("bid-winner", {
      player,
      team,
      price: lastBid.price,
    });
  } else {
    player.isBidded = true;
    player.bidWinner = null;
    player.bidWinningRate = 0;
    await player.save();

    io.to(AUCTION_ROOM).emit("unsold-player", {
      player,
      reason: "Final bidder did not have enough budget",
    });
  }

  currentPlayer = null;
  currentBid = 0;
}
