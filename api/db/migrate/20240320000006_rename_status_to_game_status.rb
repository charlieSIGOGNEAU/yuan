class RenameStatusToGameStatus < ActiveRecord::Migration[8.0]
  def change
    rename_column :games, :status, :game_status
  end
end 