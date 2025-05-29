class User < ApplicationRecord
    belongs_to :current_game, class_name: 'Game', optional: true
    has_many :game_users
    has_many :games, through: :game_users
    has_many :tiles
  end
  