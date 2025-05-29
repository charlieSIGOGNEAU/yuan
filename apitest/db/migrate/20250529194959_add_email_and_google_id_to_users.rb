class AddEmailAndGoogleIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :email, :string
    add_index :users, :email, unique: true
    add_column :users, :google_id, :string
  end
end
