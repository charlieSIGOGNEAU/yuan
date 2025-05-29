class GameChannel < ApplicationCable::Channel
  def subscribed
    # Lorsqu'un utilisateur s'abonne, on attend un paramètre game_id
    # stream_from "game_#{params[:game_id]}"
    # Rails.logger.info "Subscribed to GameChannel, params: #{params.inspect}"
    
    # Pour l'instant, nous allons permettre de s'abonner au channel général si aucun game_id n'est fourni
    # ou à un channel spécifique si game_id est fourni.
    # Idéalement, vous devriez toujours exiger un game_id pour les actions de jeu spécifiques.
    if params[:game_id].present?
      @game = Game.find_by(id: params[:game_id])
      if @game
        # Vérifier si l'utilisateur actuel (current_user) fait partie de cette partie
        # current_user est disponible via self.current_user (défini dans ApplicationCable::Connection)
        if @game.users.include?(current_user)
          stream_from "game_#{@game.id}"
          Rails.logger.info "#{current_user.name} subscribed to game_#{@game.id}"
        else
          Rails.logger.warn "#{current_user.name} tried to subscribe to game_#{@game.id} but is not a player."
          reject # Rejeter la souscription si l'utilisateur n'est pas dans la partie
        end
      else
        Rails.logger.warn "Attempted to subscribe to non-existent game with id: #{params[:game_id]}"
        reject # Rejeter si la partie n'existe pas
      end
    else
      # Comportement pour un channel de lobby général, si nécessaire
      # stream_from "general_game_lobby" 
      # Pour l'instant, on rejette si pas de game_id, car on veut des channels par partie.
      Rails.logger.warn "Subscription to GameChannel rejected, no game_id provided."
      reject
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    Rails.logger.info "Unsubscribed from GameChannel#game_#{params[:game_id] if params[:game_id].present?}"
    stop_all_streams
  end

  # Exemple d'action que le client pourrait appeler
  # def receive(data)
  #   Rails.logger.info "GameChannel received data: #{data} for game_#{params[:game_id]}"
  #   # Logique pour traiter les actions du joueur pour cette partie
  #   # ActionCable.server.broadcast("game_#{params[:game_id]}", { message: "Action received: #{data}", user: current_user.name })
  # end
end 