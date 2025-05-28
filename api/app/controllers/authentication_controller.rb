# app/controllers/authentication_controller.rb
class AuthenticationController < ApplicationController
  skip_before_action :authenticate_request, only: [:login]

  # Pas besoin de `skip_before_action :authenticate_request` ici si ApplicationController ne l'impose pas encore
  # ou si ce contrôleur est le seul point d'entrée non authentifié pour le login.

  def login
    user = User.find_by(name: params[:name]) # Vous avez dit que vous utiliserez le nom.
                                        # Assurez-vous que votre modèle User a un champ `name` unique.

    if user
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token, message: "Login successful", user_name: user.name }, status: :ok
    else
      render json: { error: "Invalid name" }, status: :unauthorized
    end
  rescue => e
    Rails.logger.error "Login Error: #{e.message}"
    render json: { error: "Internal server error" }, status: :internal_server_error
  end
end 