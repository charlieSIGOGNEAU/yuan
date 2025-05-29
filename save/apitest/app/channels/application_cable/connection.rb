module ApplicationCable
  class Connection < ActionCable::Connection::Base
    def connect
      puts "🔌 Nouvelle connexion WebSocket établie"
      puts "📍 Origin: #{request.headers['Origin']}"
      puts "🌐 URL: #{request.url}"
    end

    def disconnect
      puts "🔌 Connexion WebSocket fermée"
    end
  end
end
