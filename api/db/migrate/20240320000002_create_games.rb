class CreateGames < ActiveRecord::Migration[8.0]
  def change
    create_table :games do |t|
      t.integer :player_count, null: false
      t.integer :status, default: 0, null: false

      t.timestamps
    end
  end
end 