ActiveRecord::Schema[7.1].define(version: 2025_05_29_134933) do
  create_table "game_users", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "game_id", null: false
    t.string "faction"
    t.string "user_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_game_users_on_game_id"
    t.index ["user_id", "game_id"], name: "index_game_users_on_user_id_and_game_id", unique: true
    t.index ["user_id"], name: "index_game_users_on_user_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer "game_status", default: 0, null: false
    t.integer "game_type", default: 0, null: false
    t.integer "player_count"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tests", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tiles", force: :cascade do |t|
    t.string "name"
    t.string "position"
    t.integer "rotation"
    t.integer "game_user_id", null: false
    t.integer "game_id", null: false
    t.integer "turn"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_tiles_on_game_id"
    t.index ["game_user_id"], name: "index_tiles_on_game_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "game_users", "games"
  add_foreign_key "game_users", "users"
  add_foreign_key "tiles", "game_users"
  add_foreign_key "tiles", "games"
end
