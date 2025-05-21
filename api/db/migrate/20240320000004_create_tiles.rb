class CreateTiles < ActiveRecord::Migration[8.0]
  def change
    create_table :tiles do |t|
      t.string :name
      t.string :position
      t.integer :rotation
      t.references :user, null: false, foreign_key: true
      t.references :game, null: false, foreign_key: true
      t.integer :turn

      t.timestamps
    end
  end
end 