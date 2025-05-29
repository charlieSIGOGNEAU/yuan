module Authorization
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user
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