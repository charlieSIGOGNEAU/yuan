import { TILE_CONFIGS } from './TileTypes.js';

export class TileManager {
    static getTilesForPlayers(numPlayers) {
        const availableTiles = [];
        
        // Définition des tuiles disponibles selon le nombre de joueurs
        const tileRanges = {
            2: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            3: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
            4: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
        };

        const tilesToUse = tileRanges[numPlayers] ;
        
        tilesToUse.forEach(tileId => {  
            availableTiles.push({
                id: tileId,
                ...TILE_CONFIGS[tileId]
            });
        });

        return availableTiles;
    }
} 