class GameUser < ApplicationRecord
  belongs_to :user
  belongs_to :game

  validates :user_name, presence: true

  before_validation :set_user_name, on: :create
  before_validation :set_turn_order, on: :create

  private

  def set_user_name
    self.user_name = user.name if user
  end

  def set_turn_order
    return if turn_order.present?
    
    # Récupérer tous les turn_order existants pour cette partie
    existing_orders = game.game_users.pluck(:turn_order)
    
    # Créer un tableau de tous les ordres possibles
    all_possible_orders = (0...game.player_count).to_a
    
    # Trouver le premier ordre disponible
    self.turn_order = (all_possible_orders - existing_orders).sample
  end
end 