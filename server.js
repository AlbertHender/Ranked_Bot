const glicko2 = require('glicko2');
const Member = require('./member');
const settings = {
    tau : 0.5,
    rating : 1500,
    rd : 200,
    vol : 0.06
  };

class Server{
    constructor(id, serverName){
        this.serverID = id;
        this.serverName = serverName;
        this.rankings = new glicko2.Glicko2(settings);
        this.membersRanks = new Map();
        this.members = new Map();
        this.matches = new Map();
    }

    getMembers() {
        return this.members;
    }

    getMember(memberId){
        return this.members.get(memberId);
    }

    getMembersRanks() {
        return this.membersRanks;
    }

    getMemberRank(memberId) {
        return this.membersRanks.get(memberId);
    }

    getRank(memberId){
        return this.membersRanks.get(memberId).getRating();
    }

    getName(){
        return this.serverName;
    }

    getID(){
        return this.serverID;
    }

    addMember(member) {
        if (!(this.checkIfMember(member))){
            return false;
        }
        let newPlayer = new Member(member.id,member.user.username);
        let player = this.rankings.makePlayer();
        this.membersRanks.set(member.id,player);
        this.members.set(member.id,newPlayer);
        return true;
    }

    RegisterMatch(match,creatorID){
        if (this.matches.has(creatorID)){
            console.log('This player is already hosing a match');
            return false;
        }

        if (this.matches.set(creatorID,match)){
            console.log('match started');
        }
    }

    RemoveMatch(creatorID) {
        this.matches.delete(creatorID);
    }

    EndMatch(winner,creatorID){
        if (!this.matches.has(creatorID)){
            console.log('This player is not hosting a match');
            return false;
        }

        let match = this.matches.get(creatorID);
        let [team1, team2] = match.getTeams();

        if (winner === 1) {
            let team1Ranks = team1.map(x => this.getMemberRank(x));
            let team2Ranks = team2.map(x => this.getMemberRank(x));
            let game = this.rankings.makeRace([[team1Ranks][0],[team2Ranks][0]]);
            let postgame = game.getMatches();
            this.rankings.updateRatings(postgame);
        } else {
            console.log(team1);
            let team1Ranks = team1.map(x => this.getMemberRank(x));
            let team2Ranks = team2.map(x => this.getMemberRank(x));
            
            let game = this.rankings.makeRace([[team2Ranks][0],[team1Ranks][0]]);
            let postgame = game.getMatches();
            this.rankings.updateRatings(postgame);
        }
        this.RemoveMatch(creatorID);
        console.log('Match has ended');
        return true;
        }

    checkIfMember(member){
        if (!(this.members.has(member.id)) || !(this.membersRanks.has(member.id))){
            console.log(!this.members.has(member.id));
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Server