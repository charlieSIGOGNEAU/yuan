class GameChannel < ApplicationCable::Channel
  def subscribed
    # L'utilisateur est déjà authentifié via la connexion WebSocket
    game_id = params[:game_id]

    if game_id.blank?
      puts "❌ GameChannel: game_id manquant"
      reject
      return
    end

    # Vérifier que la partie existe
    @game = Game.find_by(id: game_id)
    unless @game
      puts "❌ GameChannel: Partie #{game_id} introuvable"
      reject
      return
    end

    # Vérifier que l'utilisateur authentifié fait bien partie de cette partie
    @game_user = @game.game_users.find_by(user_id: current_user.id)
    unless @game_user
      puts "❌ GameChannel: Utilisateur #{current_user.name} (ID: #{current_user.id}) ne fait pas partie de la partie #{game_id}"
      reject
      return
    end

    # S'abonner au canal de la partie
    stream_from "game_#{game_id}"
    
    puts "✅ GameChannel: Utilisateur #{@game_user.user_name} connecté à la partie #{game_id}"
    
    # Envoyer les informations de la partie au joueur qui se connecte
    transmit({
      type: "game_joined",
      message: "Connecté à la partie #{game_id}",
      game: game_data,
      your_game_user: @game_user.as_json(only: [:id, :user_id, :user_name, :faction]),
      current_user: {
        id: current_user.id,
        name: current_user.name,
        email: current_user.email
      },
      timestamp: Time.current
    })

    # Notifier les autres joueurs qu'un joueur s'est connecté
    broadcast_to_game({
      type: "player_connected",
      message: "#{@game_user.user_name} s'est connecté",
      game_user: @game_user.as_json(only: [:id, :user_id, :user_name, :faction]),
      timestamp: Time.current
    }, exclude_current: true)
  end

  def unsubscribed
    if @game && @game_user
      puts "❌ GameChannel: #{@game_user.user_name} déconnecté de la partie #{@game.id}"
      
      # Notifier les autres joueurs qu'un joueur s'est déconnecté
      broadcast_to_game({
        type: "player_disconnected",
        message: "#{@game_user.user_name} s'est déconnecté",
        game_user: @game_user.as_json(only: [:id, :user_id, :user_name, :faction]),
        timestamp: Time.current
      }, exclude_current: true)
    end
  end

  def send_message(data)
    message = data['message']
    puts "💬 GameChannel: Message de #{@game_user.user_name}: #{message}"
    
    broadcast_to_game({
      type: "chat_message",
      message: message,
      from: @game_user.as_json(only: [:id, :user_id, :user_name, :faction]),
      timestamp: Time.current
    })
  end

  def game_action(data)
    action_type = data['action_type']
    puts "🎮 GameChannel: Action '#{action_type}' de #{@game_user.user_name}"
    
    # Ici vous pourrez ajouter la logique des actions de jeu
    broadcast_to_game({
      type: "game_action",
      action_type: action_type,
      data: data,
      from: @game_user.as_json(only: [:id, :user_id, :user_name, :faction]),
      timestamp: Time.current
    })
  end

  private

  def game_data
    {
      id: @game.id,
      game_status: @game.game_status,
      game_type: @game.game_type,
      player_count: @game.player_count,
      game_users: @game.game_users.as_json(only: [:id, :user_id, :user_name, :faction]),
      tiles_count: @game.tiles.count
    }
  end

  def broadcast_to_game(data, exclude_current: false)
    if exclude_current
      # Diffuser à tous sauf à l'utilisateur actuel
      ActionCable.server.broadcast("game_#{@game.id}", data)
    else
      # Diffuser à tous les joueurs de la partie
      ActionCable.server.broadcast("game_#{@game.id}", data)
    end
  end
end 