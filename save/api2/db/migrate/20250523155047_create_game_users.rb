class CreateGameUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :game_users do |t|
      t.references :user, null: false, foreign_key: true
      t.references :game, null: false, foreign_key: true
      t.string :faction
      t.string :user_name

      t.timestamps
    end

    add_index :game_users, [:user_id, :game_id], unique: true
  end
end 
