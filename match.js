const servers = require('./index');

class Match{
    constructor(players, serverID){
        this.playersID = players;
        this.serverID = serverID;
        this.platform = servers.servers.get(this.serverID);
        this.team1;
        this.team2;
    }

    createMatch(){
        let team1 = [];
        let team2 = [];
        let team1Names = [];
        let team2Names = [];
        let playerList = new Map();
        for (let player of this.playersID) {
                    playerList.set(player,this.platform.getRank(player));
            }
        let orderedList = new Map([...playerList.entries()].sort((a, b) => b[1] - a[1]));
        orderedList = Array.from(orderedList.keys());
        let j = 0;
        let k = orderedList.length-1
        for (let i = 0; i < orderedList.length / 2; i++) {
            if (i % 2 === 0){
                team1.push(orderedList.at(j));
                team1Names.push(this.platform.getMember(orderedList.at(j)).getName());
                team2.push(orderedList.at(k));
                team2Names.push(this.platform.getMember(orderedList.at(k)).getName());
                j++;
                k--; 
            } else {
                team1.push(orderedList.at(k));
                team1Names.push(this.platform.getMember(orderedList.at(k)).getName());
                team2.push(orderedList.at(j));
                team2Names.push(this.platform.getMember(orderedList.at(j)).getName());
                j++;
                k--; 
            } 
        }
        this.team1 = team1;
        this.team2 = team2;
        return [team1Names, team2Names];
        }

        getTeams(){
            return [this.team1,this.team2];
        }
    }


module.exports = Match