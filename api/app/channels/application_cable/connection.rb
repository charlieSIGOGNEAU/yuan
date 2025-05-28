module ApplicationCable
  class Connection < ActionCable::Connection::Base
    # identified_by :current_user # Commenté temporairement

    def connect
      # self.current_user = find_verified_user # Commenté temporairement
      # Rails.logger.info "User #{current_user.name} connected to ActionCable" if current_user # Commenté temporairement
      Rails.logger.info "An anonymous client connected to ActionCable." # Log simple pour voir la connexion
    end

    private

    def find_verified_user
      # Le token JWT sera passé en paramètre de requête lors de la connexion WebSocket
      # par exemple : ws://localhost:3000/cable?token=VOTRE_TOKEN_JWT
      # token = request.params[:token]
      
      # if token.blank?
      #   Rails.logger.warn "Attempted WebSocket connection without a token."
      #   reject_unauthorized_connection
      #   return
      # end

      # decoded_token = JsonWebToken.decode(token)
      # if decoded_token && decoded_token[:user_id]
      #   user = User.find_by(id: decoded_token[:user_id])
      #   if user
      #     user
      #   else
      #     Rails.logger.warn "Attempted WebSocket connection with invalid user_id in token: #{decoded_token[:user_id]}"
      #     reject_unauthorized_connection
      #   end
      # else
      #   Rails.logger.warn "Attempted WebSocket connection with invalid or missing token."
      #   reject_unauthorized_connection
      # end
    # rescue JWT::ExpiredSignature
    #   Rails.logger.warn "Attempted WebSocket connection with expired token."
    #   reject_unauthorized_connection # Ou une gestion spécifique pour les tokens expirés
    # rescue => e
    #   Rails.logger.error "Error in ActionCable connection: #{e.message}"
    #   reject_unauthorized_connection
    end
  end
end
 