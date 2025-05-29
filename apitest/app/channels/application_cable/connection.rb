require_relative '../../lib/json_web_token'

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      puts "🔌 === DÉBUT CONNEXION WEBSOCKET ==="
      puts "📍 Origin: #{request.headers['Origin']}"
      puts "🌐 URL: #{request.url}"
      puts "🔗 Query params: #{request.query_parameters}"
      puts "📋 Headers: #{request.headers.to_h.select { |k, v| k.downcase.include?('auth') || k.downcase.include?('token') }}"
      
      self.current_user = find_verified_user
      puts "✅ Connexion WebSocket authentifiée établie pour #{current_user.name} (ID: #{current_user.id})"
    rescue => e
      puts "❌ ERREUR CONNEXION WEBSOCKET: #{e.class}: #{e.message}"
      puts "📍 Backtrace: #{e.backtrace.first(3).join(', ')}"
      reject_unauthorized_connection
    end

    def disconnect
      puts "🔌 Connexion WebSocket fermée pour #{current_user&.name || 'utilisateur inconnu'}"
    end

    private

    def find_verified_user
      puts "🔍 === DÉBUT VÉRIFICATION UTILISATEUR ==="
      
      # Récupérer le token depuis les paramètres de l'URL ou les headers
      token = request.params[:token] || extract_token_from_headers
      puts "🔑 Token reçu: #{token&.truncate(50) || 'AUCUN'}"

      if token.blank?
        puts "❌ Token JWT manquant dans la connexion WebSocket"
        reject_unauthorized_connection
        return
      end

      # Décoder le token JWT
      puts "🔓 Tentative de décodage du token JWT..."
      decoded_token = JsonWebToken.decode(token)
      puts "📝 Token décodé: #{decoded_token || 'ÉCHEC'}"
      
      if decoded_token.nil?
        puts "❌ Token JWT invalide dans la connexion WebSocket"
        reject_unauthorized_connection
        return
      end

      # Trouver l'utilisateur
      user_id = decoded_token[:user_id]
      puts "👤 Recherche utilisateur avec ID: #{user_id}"
      
      user = User.find_by(id: user_id)
      puts "👤 Utilisateur trouvé: #{user&.name || 'AUCUN'}"
      
      if user.nil?
        puts "❌ Utilisateur non trouvé avec le token JWT (ID: #{user_id})"
        reject_unauthorized_connection
        return
      end

      puts "✅ Utilisateur authentifié via JWT: #{user.name} (#{user.email})"
      user
    end

    def extract_token_from_headers
      # Essayer d'extraire le token depuis les headers Authorization
      auth_header = request.headers['Authorization']
      puts "🔍 Header Authorization: #{auth_header&.truncate(50) || 'AUCUN'}"
      auth_header&.split(' ')&.last
    end
  end
end
