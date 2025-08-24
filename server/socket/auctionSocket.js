const Player = require("../models/playerModel");
const Team = require("../models/userModel");

//NOTHING IS DONE HERE JUST BASIC FILE FOR SOCKET

module.exports = (io) => {
  console.log("Socket.io initialized");
  let currentPlayer = null;
  let currentBid = 0;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("start-bidding", async () => {
      const players = await Player.find({ isSold: false });
      if (!players.length) return io.emit("auction-over");

      currentPlayer = players[Math.floor(Math.random() * players.length)];
      currentBid = currentPlayer.basePrice;

      io.emit("new-player", currentPlayer);
    });

    socket.on("place-bid", async ({ teamId, bid }) => {
      if (!currentPlayer) return;
      const team = await Team.findById(teamId);
      if (!team || team.budget < bid) return; // verify with keys //might need to use transaction

      const maxLimit =
        PLAYER_CATEGORIES[currentPlayer.category]?.limit || Infinity;
      if (bid > currentBid && bid <= maxLimit) {
        currentBid = bid;
        currentPlayer.bidLogs.push({ team: team._id, price: bid });
        await currentPlayer.save();
        io.emit("new-bid", { team, bid });
      }
    });

    socket.on("end-bidding", async () => {
      if (!currentPlayer) return;

      const logs = currentPlayer.bidLogs;
      if (!logs.length) return io.emit("no-bid", currentPlayer);

      const winnerLog = logs[logs.length - 1];
      const team = await Team.findById(winnerLog.team);

      if (team && team.budget >= winnerLog.price) {
        team.budget -= winnerLog.price;
        team.players.push({
          player: currentPlayer._id,
          price: winnerLog.price,
        });
        await team.save();

        currentPlayer.isSold = true;
        currentPlayer.soldTo = team._id;
        currentPlayer.finalPrice = winnerLog.price;
        await currentPlayer.save();

        io.emit("bid-winner", {
          player: currentPlayer,
          team,
          price: winnerLog.price,
        });
      }

      currentPlayer = null;
      currentBid = 0;
    });
  });
};
