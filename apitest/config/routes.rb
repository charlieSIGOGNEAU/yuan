Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # ActionCable
  mount ActionCable.server => '/cable'

  # Authentication routes
  post '/auth/quick_login', to: 'authentication#quick_login'  # Pour les tests
  post '/auth/google', to: 'authentication#google_auth'       # Pour Google OAuth
  post '/auth/create_test_user', to: 'authentication#create_test_user'  # Pour créer des utilisateurs de test
  get '/auth/me', to: 'authentication#me'

  # API routes
  resources :users, only: [:index, :show, :update]
  
  # Routes pour les parties
  get '/games/all', to: 'games#all_games'  # Récupérer toutes les parties (pour tests)
  resources :games, only: [:index, :show, :create]

  # Defines the root path route ("/")
  # root "posts#index"
end
