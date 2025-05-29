class GamesController < ApplicationController
  before_action :authenticate_request

  def quick_game
    # Rails.logger.info "Current user in quick_game: #{@current_user.inspect}"
    game = Game.find_or_create_waiting_game(@current_user)

    if game.persisted?
      game_user = game.game_users.find_by(user_id: @current_user.id) # Assurez-vous que la recherche se fait bien sur user_id

      if game_user
        # Rails.logger.info "Game joined/created: #{game.id}, GameUser: #{game_user.id}, Status: #{game.game_status}"
        render json: { 
          message: "Partie rejointe ou créée avec succès!", 
          game_id: game.id, 
          game_user_id: game_user.id, 
          game_status: game.game_status,
          # is_initiator: game_user.id == game.initiator_id # Ajout pour savoir si le joueur est l'initiateur
        }, status: :ok
      else
        # Rails.logger.error "Could not find GameUser for user #{@current_user.id} in game #{game.id}"
        render json: { error: "Impossible de trouver le joueur dans la partie après sa création/rejointure." }, status: :internal_server_error
      end
    else
      # Rails.logger.error "Failed to create or find game. Errors: #{game.errors.full_messages.join(', ')}"
      render json: { error: "Impossible de créer ou rejoindre une partie rapide.", details: game.errors.full_messages }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error "Quick Game Error: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: "Une erreur interne est survenue: #{e.message}" }, status: :internal_server_error
  end
end
