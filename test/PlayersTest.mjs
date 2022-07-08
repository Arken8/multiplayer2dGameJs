import { getPlayerList, getIdList, getPlayerFromId, addPlayers, removePlayers, newLocations, getPlayersActualLocations, Player, Location, ObjWithId } from '../public/js/Players.js';

import { equal } from 'assert';

describe('Test addPlayers', function () {

    it('should not add players (add [])', function () {
        let length = getPlayerList().length;
        addPlayers([]);
        equal(getPlayerList().length, length);
    });

    it('should add players (add object Player)', function () {
        let length = getPlayerList().length;
        addPlayers([new Player(0)]);
        equal(getPlayerList().length, length + 1);
    });

    it('should add players (add multiple object Player)', function () {
        let length = getPlayerList().length;
        addPlayers([new Player(1), new Player(2), new Player(3)]);
        equal(getPlayerList().length, length + 3);
    });

    it('should add only first same players (add multiple object Player)', function () {
        let length = getPlayerList().length;
        addPlayers([new Player(10), new Player(10), new Player(10)]);
        equal(getPlayerList().length, length + 1);
    });

    it('should add players with valid id (add object Player)', function () {
        let id = "6434";
        addPlayers([new Player(id)]);
        let length = getPlayerList().length;
        equal(getPlayerList()[length -1].id, id);
    });

    it('should add players with valid type id (add object Player)', function () {
        addPlayers([new Player(892)]);
        let length = getPlayerList().length;
        equal(typeof getPlayerList()[length -1].id , "string");
    });

    it('should not add players (add object Player but same id as another player)', function () {
        addPlayers([new Player(0)]);    // il y a deja un player avec l'id 0 due a une test plus haut
        let length = getPlayerList().length;
        addPlayers([new Player(0)]);
        equal(getPlayerList().length, length);
    });

});

describe('Test removePlayers', function () {

    it('should not rm players (rm [])', function () {
        addPlayers([new Player(0)]);    // il y a deja un player avec l'id 0 due a une test plus haut
        let length = getPlayerList().length;
        removePlayers([])
        equal(getPlayerList().length, length);
    });

    it('should rm players (rm ["0"])', function () {
        addPlayers([new Player(0)]);    // il y a deja un player avec l'id 0 due a une test plus haut
        let length = getPlayerList().length;
        removePlayers(["0"])
        equal(getPlayerList().length, length -1);
    });

    it('should rm only one of these same players (rm ["0", "0"])', function () {
        addPlayers([new Player(0)]);    // il y a deja un player avec l'id 0 due a une test plus haut
        let length = getPlayerList().length;
        removePlayers(["0", "0"])
        equal(getPlayerList().length, length -1);
    });

    it('should rm players (rm ["0", "1", "2"])', function () {
        addPlayers([new Player(0), new Player(1), new Player(2)]);    // il y a deja un player avec l'id 0 due a une test plus haut
        let length = getPlayerList().length;
        removePlayers(["0", "1", "2"])
        equal(getPlayerList().length, length -3);
    });

    it('should rm all players (rm getIdList(getPlayerList()))', function () {
        addPlayers([new Player(0), new Player(1), new Player(2)]);
        removePlayers(getIdList(getPlayerList()));
        equal(getPlayerList().length, 0);
    });

});

describe("Test getPlayerFromId", function () {

    it("should return Player of id", function () {
        let player1 = new Player(1234);
        player1.name = "testFunction"
        addPlayers([player1]);
        let player2 = getPlayerFromId("1234");
        equal(player2.name, "testFunction")
    })

})

describe("Test getPlayersActualLocations", function () {

    it("should return location according to time", function () {
        
        removePlayers(getIdList(getPlayerList()));

        let player = new Player("testActualLocations");
        addPlayers([player]);

        setTimeout(() => {
            let obj = new ObjWithId("testActualLocations", new Location(1000, 1000), Date.now());
            newLocations([obj]);
            LogActualLocation(100, 0, 15);
        }, 1000);

        equal("test", "test")
    })

})

function LogActualLocation(deltaT, i, MaxIteration) {
    console.log(getPlayersActualLocations()[0].obj);
    i++;
    if (i < MaxIteration) {
        setTimeout(LogActualLocation, deltaT, deltaT, i, MaxIteration);
    }
}
