class User < ApplicationRecord
    belongs_to :current_game, class_name: 'Game', optional: true
    has_many :game_users
    has_many :games, through: :game_users
    has_many :tiles

    validates :email, presence: true, uniqueness: true
    validates :name, presence: true

    def generate_jwt_token
      JsonWebToken.encode(user_id: id, email: email, name: name)
    end

    def self.find_by_token(token)
      decoded_token = JsonWebToken.decode(token)
      return nil unless decoded_token
      find_by(id: decoded_token[:user_id])
    end

    # Méthode pour créer ou trouver un utilisateur via Google OAuth
    def self.find_or_create_by_google(email:, name:, google_id: nil)
      user = find_by(email: email)
      
      if user
        # Mettre à jour le nom si nécessaire
        user.update(name: name) if user.name != name
        user
      else
        # Créer un nouvel utilisateur
        create(
          email: email,
          name: name,
          google_id: google_id
        )
      end
    end
end
  