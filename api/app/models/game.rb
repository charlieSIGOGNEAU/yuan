class Game < ApplicationRecord
  enum :game_status, {
    waiting_for_players: 0,
    initializing: 1,
    simultaneous_play: 2,
    completed: 3,
    abandoned: 4
  }, default: :waiting_for_players

  enum :game_type, {
    quick_game: 0,
    custom_game: 1
  }, default: :quick_game

  has_many :game_users
  has_many :users, through: :game_users
  has_many :tiles

 
  validates :game_status, presence: true
  validates :game_type, presence: true

  def self.find_or_create_waiting_game(user)
    waiting_game = where(game_status: :waiting_for_players, game_type: :quick_game).first

    if waiting_game
      # Si on ne peut pas rejoindre la partie, on cherche une autre partie
      if waiting_game.add_player(user)
        waiting_game
      else
        # On exclut la partie qu'on vient d'essayer de rejoindre
        find_or_create_waiting_game(user)
      end
    else
      game = create(
        player_count: 3,
        game_status: :waiting_for_players,
        game_type: :quick_game
      )
      return nil unless game.persisted?
      game.add_player(user)
      game
    end
  end

  def add_player(user)
    transaction do
      reload.lock!
      return false unless can_add_player?
      game_user = game_users.create(user: user)
      return false unless game_user.persisted?
      check_and_initialize_game
      true
    end
  end

  private

  def can_add_player?
    waiting_for_players? && game_users.count < player_count
  end

  def check_and_initialize_game
    initialize_game if game_users.count == player_count
  end

  def initialize_game
    update(game_status: :initializing)
    create_tiles
    update(game_status: :simultaneous_play)
    broadcast_game_start
  end

  def create_tiles
    tile_count = calculate_tile_count
    create_tiles_for_players(tile_count)
  end

  def calculate_tile_count
    case player_count
    when 2 then 8
    when 3 then 12
    when 4 then 15
    end
  end

  def create_tiles_for_players(tile_count)
    tile_count.times do |i|
      tile = tiles.create(
        user_id: game_users.find_by(turn_order: (i % player_count) + 1).user_id,
        turn: (i / player_count) + 1
      )
      return false unless tile.persisted?
    end
    true
  end

  def broadcast_game_start
    ActionCable.server.broadcast(
      "game_#{id}",
      {
        type: 'game_start',
        game: as_json(include: [:game_users, :tiles])
      }
    )
  end
end 