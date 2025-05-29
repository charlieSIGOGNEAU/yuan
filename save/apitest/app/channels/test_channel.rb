class TestChannel < ApplicationCable::Channel
  def subscribed
    stream_from "test_channel"
    puts "✅ Client connecté au TestChannel"
    
    # Envoyer un message de bienvenue
    transmit({
      type: "welcome",
      message: "Connexion réussie au TestChannel!",
      timestamp: Time.current
    })
  end

  def unsubscribed
    puts "❌ Client déconnecté du TestChannel"
  end

  def receive(data)
    puts "📨 Message reçu dans TestChannel: #{data}"
    
    # Renvoyer un écho du message avec un timestamp
    transmit({
      type: "echo",
      original_message: data,
      echo: "Echo: #{data['message']}",
      timestamp: Time.current
    })
  end

  def ping(data = {})
    puts "🏓 Ping reçu dans TestChannel"
    
    # Renvoyer un pong immédiatement
    transmit({
      type: "pong",
      message: "Pong!",
      server_timestamp: Time.current,
      client_data: data
    })

    # Programmer l'envoi d'un ping depuis le serveur 2 secondes plus tard
    schedule_server_ping
  end

  def server_pong(data = {})
    puts "✅ Réponse au ping serveur reçue du client: #{data}"
    
    # Confirmer la réception
    transmit({
      type: "server_pong_ack",
      message: "Réponse bien reçue!",
      server_timestamp: Time.current,
      client_response: data
    })
  end

  private

  def schedule_server_ping
    puts "⏰ Programmation d'un ping serveur dans 2 secondes"
    
    # Utiliser un thread pour envoyer un ping après 2 secondes
    Thread.new do
      sleep(2)
      send_server_ping
    rescue => e
      puts "❌ Erreur lors de l'envoi du ping serveur: #{e.message}"
    end
  end

  def send_server_ping
    puts "📡 Envoi d'un ping depuis le serveur"
    
    transmit({
      type: "server_ping",
      message: "Ping depuis le serveur!",
      server_timestamp: Time.current,
      expect_response: true
    })
  end
end 