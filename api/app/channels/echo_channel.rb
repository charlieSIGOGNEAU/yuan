class EchoChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "echo_channel"
    Rails.logger.info "Client subscribed to echo_channel"
  end

  def receive(data)
    name_received = data["name"]
    Rails.logger.info "Received name: '#{name_received}' on echo_channel"

    if name_received.present?
      # Enregistrer le nom dans la base de données
      test_record = Test.create(name: name_received)

      if test_record.persisted?
        Rails.logger.info "Saved to DB: #{test_record.inspect}"
        # Attendre 1 seconde
        sleep 1

        # Renvoyer le nom enregistré au client
        ActionCable.server.broadcast("echo_channel", { message: "Bonjour #{test_record.name}" })
        Rails.logger.info "Broadcasted message: Bonjour #{test_record.name}"
      else
        error_message = "Failed to save name: #{test_record.errors.full_messages.join(', ')}"
        Rails.logger.error error_message
        ActionCable.server.broadcast("echo_channel", { error: error_message })
      end
    else
      Rails.logger.warn "Received empty name"
      # Optionnel: informer le client
      ActionCable.server.broadcast("echo_channel", { error: "Name cannot be empty" })
    end
  rescue => e # Ajout d'un rescue pour capturer d'éventuelles erreurs pendant le traitement
    Rails.logger.error "Error in EchoChannel#receive: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    ActionCable.server.broadcast("echo_channel", { error: "An internal server error occurred." })
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    Rails.logger.info "Client unsubscribed from echo_channel"
  end
end
