Tile.delete_all
GameUser.delete_all
Game.delete_all
User.delete_all

User.create!(name: 'user1')
User.create!(name: 'user2')
User.create!(name: 'user3')

p "seed genere"