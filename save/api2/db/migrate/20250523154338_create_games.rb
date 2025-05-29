class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.integer :game_status, default: 0, null: false
      t.integer :game_type, default: 0, null: false

      t.timestamps
    end
  end
end
