Tile.delete_all
GameUser.delete_all
Game.delete_all
User.delete_all

user1 = User.create!(name: 'user1')
user2 = User.create!(name: 'user2')
user3 = User.create!(name: 'user3')
user4 = User.create!(name: 'user4')
user5 = User.create!(name: 'user5')
user6 = User.create!(name: 'user6')

game1 = Game.create!(game_status: 0, game_type: 0, player_count: 2)
game2 = Game.create!(game_status: 0, game_type: 0, player_count: 3)
game3 = Game.create!(game_status: 0, game_type: 0, player_count: 4)

gameuser1=GameUser.create!(user_id: user1.id, game_id: game1.id, faction: 'faction1', user_name: 'user1')
gameuser2=GameUser.create!(user_id: user2.id, game_id: game1.id, faction: 'faction2', user_name: 'user2')
gameuser3=GameUser.create!(user_id: user3.id, game_id: game1.id, faction: 'faction3', user_name: 'user3')
gameuser4=GameUser.create!(user_id: user4.id, game_id: game2.id, faction: 'faction4', user_name: 'user4')
gameuser5=GameUser.create!(user_id: user5.id, game_id: game2.id, faction: 'faction5', user_name: 'user5')
gameuser6=GameUser.create!(user_id: user6.id, game_id: game2.id, faction: 'faction6', user_name: 'user6')






p "seed genere"