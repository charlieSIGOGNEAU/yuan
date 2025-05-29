class UsersController < ApplicationController
  include Authorization

  def index
    users = User.all
    render json: {
      success: true,
      users: users.map { |user| user_json(user) }
    }
  end

  def show
    user = User.find(params[:id])
    render json: {
      success: true,
      user: user_json(user)
    }
  rescue ActiveRecord::RecordNotFound
    render json: {
      success: false,
      error: "Utilisateur non trouvé"
    }, status: :not_found
  end

  def update
    if @current_user.update(user_update_params)
      render json: {
        success: true,
        user: user_json(@current_user)
      }
    else
      render json: {
        success: false,
        errors: @current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def user_json(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    }
  end

  def user_update_params
    params.require(:user).permit(:name, :email)
  end
end 