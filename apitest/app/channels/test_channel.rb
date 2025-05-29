class TestChannel < ApplicationCable::Channel
  def subscribed
    stream_from "test_channel"
    puts "✅ Client connecté au TestChannel: #{current_user.name} (ID: #{current_user.id})"
    
    # Envoyer un message de bienvenue avec les infos de l'utilisateur
    transmit({
      type: "welcome",
      message: "Connexion réussie au TestChannel!",
      user: {
        id: current_user.id,
        name: current_user.name,
        email: current_user.email
      },
      timestamp: Time.current
    })
  end

  def unsubscribed
    puts "❌ Client déconnecté du TestChannel: #{current_user.name}"
  end

  def receive(data)
    puts "📨 Message reçu dans TestChannel de #{current_user.name}: #{data}"
    
    # Renvoyer un écho du message avec un timestamp et les infos utilisateur
    transmit({
      type: "echo",
      original_message: data,
      echo: "Echo: #{data['message']}",
      from_user: {
        id: current_user.id,
        name: current_user.name
      },
      timestamp: Time.current
    })
  end

  def ping(data = {})
    puts "🏓 Ping reçu dans TestChannel de #{current_user.name}"
    
    # Renvoyer un pong immédiatement
    transmit({
      type: "pong",
      message: "Pong!",
      from_user: {
        id: current_user.id,
        name: current_user.name
      },
      server_timestamp: Time.current,
      client_data: data
    })

    # Programmer l'envoi d'un ping depuis le serveur 2 secondes plus tard
    schedule_server_ping
  end

  def server_pong(data = {})
    puts "✅ Réponse au ping serveur reçue de #{current_user.name}: #{data}"
    
    # Confirmer la réception
    transmit({
      type: "server_pong_ack",
      message: "Réponse bien reçue!",
      from_user: {
        id: current_user.id,
        name: current_user.name
      },
      server_timestamp: Time.current,
      client_response: data
    })
  end

  private

  def schedule_server_ping
    puts "⏰ Programmation d'un ping serveur dans 2 secondes pour #{current_user.name}"
    
    # Utiliser un thread pour envoyer un ping après 2 secondes
    Thread.new do
      sleep(2)
      send_server_ping
    rescue => e
      puts "❌ Erreur lors de l'envoi du ping serveur: #{e.message}"
    end
  end

  def send_server_ping
    puts "📡 Envoi d'un ping depuis le serveur vers #{current_user.name}"
    
    transmit({
      type: "server_ping",
      message: "Ping depuis le serveur!",
      to_user: {
        id: current_user.id,
        name: current_user.name
      },
      server_timestamp: Time.current,
      expect_response: true
    })
  end
end 