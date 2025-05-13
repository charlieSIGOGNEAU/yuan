class UsersController < ApplicationController
  skip_before_action :authenticate_user, only: [:login]

  def login
    Rails.logger.info "Login attempt with params: #{params.inspect}"
    user = User.find_by(name: params[:name])
    Rails.logger.info "User found: #{user.inspect}"
    
    if user
      session[:user_id] = user.id
      Rails.logger.info "Session created with user_id: #{session[:user_id]}"
      render json: user
    else
      Rails.logger.info "User not found"
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  def show
    render json: current_user
  end

  def logout
    session.delete(:user_id)
    head :no_content
  end
end 