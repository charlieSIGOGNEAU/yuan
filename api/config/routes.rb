Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Mount Action Cable server
  mount ActionCable.server => '/cable'

  # Authentication route
  post '/auth/login', to: 'authentication#login'

  # Game routes
  post '/games/quick_game', to: 'games#quick_game'

  # Defines the root path route ("/")
  # root "posts#index"
end
