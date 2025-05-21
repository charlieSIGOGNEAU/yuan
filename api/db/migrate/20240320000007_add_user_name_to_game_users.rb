class AddUserNameToGameUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :game_users, :user_name, :string
    add_index :game_users, [:game_id, :turn_order], unique: true
  end
end 