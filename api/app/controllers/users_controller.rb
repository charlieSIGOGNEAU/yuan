class UsersController < ApplicationController
  def show
    render json: @current_user
  end

  def index
    @users = User.all
    render json: @users
  end
end 