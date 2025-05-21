class GamesController < ApplicationController
  def quick_game
    Rails.logger.info "Tentative de création/rejoindre une partie rapide pour l'utilisateur #{current_user.name}"
    @game = Game.find_or_create_waiting_game(current_user)
    
    if @game
      Rails.logger.info "Partie trouvée/créée : #{@game.inspect}"
      Rails.logger.info "Nombre de joueurs dans la partie : #{@game.game_users.count}"
      
      # Récupérer l'ID du game_user du joueur courant
      current_game_user_id = @game.game_users.find_by(user: current_user).id
      
      render json: {
        game: @game.as_json(include: [:game_users, :tiles]),
        current_game_user_id: current_game_user_id
      }
    else
      Rails.logger.error "Impossible de créer/rejoindre une partie"
      render json: { error: "Impossible de créer ou rejoindre une partie" }, status: :unprocessable_entity
    end
  end
end 