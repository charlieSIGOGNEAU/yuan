class ApplicationController < ActionController::API
  # L'authentification pour ActionCable se fait dans ApplicationCable::Connection
  # donc on peut skipper l'authentification HTTP pour le path /cable.
  # Note: Cela suppose que ActionCable est monté à la racine /cable.
  # Si vous avez une portée de type `scope :api do ... mount ActionCable.server => '/cable' ... end`,
  # le before_action de l'API pourrait toujours s'appliquer. Ajustez si nécessaire.
  # Pour l'instant, on ne va pas ajouter de skip_before_action ici, car la connexion ActionCable
  # n'est pas une requête HTTP standard qui passerait par ce ApplicationController de l'API.
  # La protection est gérée par ApplicationCable::Connection.

  before_action :authenticate_request
  attr_reader :current_user

  private

  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    begin
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded[:user_id]) 
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::ExpiredSignature => e
      render json: { errors: 'Token has expired' }, status: :unauthorized 
    end
  end
end
