class AddGameTypeToGames < ActiveRecord::Migration[8.0]
  def change
    add_column :games, :game_type, :integer, default: 0, null: false
  end
end 