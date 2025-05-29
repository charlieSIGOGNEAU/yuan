class AuthenticationController < ApplicationController
  before_action :authenticate_user, only: [:me]

  # Authentification rapide pour les tests (à remplacer par Google OAuth)
  def quick_login
    user = User.find_by(email: params[:email])
    
    if user
      token = user.generate_jwt_token
      render json: {
        success: true,
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    else
      render json: { 
        success: false, 
        error: 'Utilisateur non trouvé' 
      }, status: :not_found
    end
  end

  # Authentification via Google OAuth (simulée pour l'instant)
  def google_auth
    # Dans une vraie implémentation, vous vérifieriez le token Google ici
    google_token = params[:google_token]
    email = params[:email]
    name = params[:name]
    google_id = params[:google_id]

    if email.blank? || name.blank?
      render json: {
        success: false,
        error: 'Email et nom requis'
      }, status: :bad_request
      return
    end

    # Créer ou trouver l'utilisateur
    user = User.find_or_create_by_google(
      email: email,
      name: name,
      google_id: google_id
    )

    if user.persisted?
      token = user.generate_jwt_token
      render json: {
        success: true,
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    else
      render json: {
        success: false,
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # Création manuelle pour les tests
  def create_test_user
    user = User.new(
      name: params[:name],
      email: params[:email]
    )

    if user.save
      token = user.generate_jwt_token
      render json: {
        success: true,
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }, status: :created
    else
      render json: {
        success: false,
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def me
    render json: {
      success: true,
      user: {
        id: @current_user.id,
        name: @current_user.name,
        email: @current_user.email
      }
    }
  end

  private

  def authenticate_user
    @current_user = User.find_by_token(jwt_token)
    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  end

  def jwt_token
    request.headers['Authorization']&.split(' ')&.last
  end
end 