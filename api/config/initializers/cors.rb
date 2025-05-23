# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Pour le développement, nous autorisons toutes les origines localhost.
    # En production, spécifiez les domaines exacts.
    origins 'http://localhost:8000', 'http://127.0.0.1:8000' # Si vous servez votre HTML avec python -m http.server sur le port 8000

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true # Important si vous avez besoin de gérer des cookies/sessions via ActionCable
  end
end
