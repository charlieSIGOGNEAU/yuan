# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_13_155844) do
  create_table "game_users", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "game_id", null: false
    t.integer "turn_order"
    t.string "faction"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user_name"
    t.index ["game_id", "turn_order"], name: "index_game_users_on_game_id_and_turn_order", unique: true
    t.index ["game_id"], name: "index_game_users_on_game_id"
    t.index ["user_id", "game_id"], name: "index_game_users_on_user_id_and_game_id", unique: true
    t.index ["user_id"], name: "index_game_users_on_user_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer "player_count", null: false
    t.integer "game_status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "game_type", default: 0, null: false
  end

  create_table "tiles", force: :cascade do |t|
    t.string "name"
    t.string "position"
    t.integer "rotation"
    t.integer "user_id", null: false
    t.integer "game_id", null: false
    t.integer "turn"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_tiles_on_game_id"
    t.index ["user_id"], name: "index_tiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "game_users", "games"
  add_foreign_key "game_users", "users"
  add_foreign_key "tiles", "games"
  add_foreign_key "tiles", "users"
end
