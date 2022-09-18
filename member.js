class Member{
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.wins = 0, this.loses = 0;
    }

    updateName (params){
        this.name = params
    }

    getName (){
        return this.name;
    }

    getRecord (){
        return this.wins,this.loses;
    }

    getId () {
        return this.id;
    }

    /*updateRecord(W = 0, L = 0) {
        this.wins += W;
        this.loses += L;
        return true;
    }*/
}

module.exports = Member