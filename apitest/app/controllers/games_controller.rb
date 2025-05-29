class GamesController < ApplicationController
  include Authorization

  # Exemption d'authentification pour all_games (tests uniquement)
  skip_before_action :authenticate_user, only: [:all_games]

  # Action publique pour récupérer toutes les parties (pour les tests)
  def all_games
    games = Game.includes(:game_users, :users).all
    render json: {
      success: true,
      games: games.map { |game| all_games_json(game) }
    }
  end

  def index
    games = @current_user.games.includes(:game_users, :users)
    render json: {
      success: true,
      games: games.map { |game| game_json(game) }
    }
  end

  def show
    game = @current_user.games.find(params[:id])
    render json: {
      success: true,
      game: detailed_game_json(game)
    }
  rescue ActiveRecord::RecordNotFound
    render json: {
      success: false,
      error: "Partie non trouvée"
    }, status: :not_found
  end

  def create
    game = Game.find_or_create_waiting_game(@current_user)
    
    if game
      render json: {
        success: true,
        game: detailed_game_json(game),
        message: "Partie trouvée ou créée avec succès"
      }
    else
      render json: {
        success: false,
        error: "Impossible de créer ou rejoindre une partie"
      }, status: :unprocessable_entity
    end
  end

  private

  def all_games_json(game)
    {
      id: game.id,
      game_status: game.game_status,
      game_type: game.game_type,
      player_count: game.player_count,
      current_players: game.game_users.count,
      players: game.game_users.map { |gu| { name: gu.user_name, faction: gu.faction } },
      created_at: game.created_at
    }
  end

  def game_json(game)
    {
      id: game.id,
      game_status: game.game_status,
      game_type: game.game_type,
      player_count: game.player_count,
      current_players: game.game_users.count,
      created_at: game.created_at
    }
  end

  def detailed_game_json(game)
    {
      id: game.id,
      game_status: game.game_status,
      game_type: game.game_type,
      player_count: game.player_count,
      current_players: game.game_users.count,
      players: game.game_users.map do |game_user|
        {
          id: game_user.id,
          user_id: game_user.user_id,
          user_name: game_user.user_name,
          faction: game_user.faction
        }
      end,
      tiles_count: game.tiles.count,
      created_at: game.created_at
    }
  end
end 