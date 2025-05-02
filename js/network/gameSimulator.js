export const gameSimulator = {
    players: ["name1", "name2", "name3"], // name1 est le premier joueur a poser une tuile
    turn: 0, // 0 = phase d'installation
    plateau: {
        tilesToPlay: null, // null pour differentier le fait qu'on a pas encore atribuer la liste des tuiles
        playedTiles: [],
        playedTilesPosition: [],
        playedTilesRotation: [] // 1 = rotation de 60° trigonométrique
    }
};