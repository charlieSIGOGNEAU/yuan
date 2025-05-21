class AuthenticationController < ApplicationController
  skip_before_action :authenticate_request

  def login
    @user = User.find_by(name: params[:name])
    if @user
      token = JsonWebToken.encode(user_id: @user.id)
      render json: { token: token, user: @user }, status: :ok
    else
      render json: { error: 'Invalid name' }, status: :unauthorized
    end
  end
end 