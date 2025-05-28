module ApplicationCable
  class Connection < ActionCable::Connection::Base
    def connect
      Rails.logger.info "API2: An anonymous client connected to ActionCable."
    end
  end
end 