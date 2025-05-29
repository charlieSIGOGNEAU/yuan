## Roadmap: Real-Time Multiplayer Game

**Project Goal:** Develop a real-time multiplayer game using a Rails 7 API backend and a plain HTML/JavaScript frontend.

**Core Technologies:**
*   **Backend:** Ruby on Rails 7 (API-only mode initially)
*   **Frontend:** HTML, CSS, JavaScript (no complex frameworks to start)
*   **Real-time Communication:** ActionCable
*   **Database:** SQLite (for development simplicity)

---

### Phase 1: Basic Setup & User Authentication

1.  **Backend: Rails API Setup**
    *   Generate a new Rails 7 API-only application.
    *   Configure CORS.
    *   Setup JWT for authentication (e.g., using the `jwt` gem).
2.  **Backend: User Model & Endpoints**
    *   Create `User` model (e.g., `email`, `password_digest`).
    *   Implement registration endpoint (`/api/users` or `/api/signup`).
    *   Implement login endpoint (`/api/login`) that returns a JWT.
    *   Implement an authenticated test endpoint (e.g., `/api/profile`) to verify JWT.
3.  **Frontend: Basic HTML Structure**
    *   Create `index.html` with forms for registration and login.
    *   Create `home.html` (for authenticated users).
4.  **Frontend: JavaScript for Authentication**
    *   Write JS to handle registration form submission.
    *   Write JS to handle login form submission, store JWT in `localStorage`.
    *   Write JS to redirect to `home.html` on successful login.
    *   Write JS to check for JWT on `home.html` load, redirect to `index.html` if not found or invalid.
    *   JS function to make authenticated API calls (include JWT in headers).

**Testing for Phase 1:**
*   Can a new user register successfully?
*   Can a registered user log in successfully?
*   Is a JWT returned upon login and stored in `localStorage`?
*   Is the user redirected to `home.html` after login?
*   Is access to authenticated API endpoints (e.g., `/api/profile`) protected and working with the JWT?
*   Are users redirected to `index.html` if they try to access `home.html` without a valid JWT?

---

### Phase 2: Game Management (No Real-time Yet)

1.  **Backend: Game Models**
    *   Create `Game` model (e.g., `status` enum: `waiting`, `active`, `finished`, `max_players`).
    *   Create `GameUser` model to link `User` and `Game` (join table), possibly store player-specific game data like score later.
2.  **Backend: Game Logic & Endpoints**
    *   Implement `POST /api/games/quick` endpoint:
        *   Authenticated users can call this.
        *   If a `Game` with `status: 'waiting'` and space available exists, add the user to it (create `GameUser`).
        *   If the game becomes full, change its `status` to `active` and trigger any initial game setup (e.g., tile distribution - to be detailed in Phase 3).
        *   If no suitable `Game` exists, create a new one with `status: 'waiting'`, add the user to it.
        *   Return the game state (or a message).
    *   Implement `GET /api/games/:id` endpoint:
        *   Authenticated users (who are part of the game) can fetch game details.
3.  **Frontend: Game Interaction**
    *   On `home.html`, add a "Quick Join/Create Game" button.
    *   JS to call the `/api/games/quick` endpoint.
    *   Display game status on `home.html` (e.g., "Waiting for another player...", "Game in progress", game ID).
    *   If a game is active, perhaps redirect to a `game.html?id=<game_id>` page or dynamically load the game interface.

**Testing for Phase 2:**
*   Can a user create a new game if none are waiting?
*   Can a second user join an existing waiting game?
*   Does the game status change to `active` when the required number of players join?
*   Can users retrieve the status of a game they are part of?
*   What happens if more than `max_players` try to join? (Handle gracefully)

---

### Phase 3: Basic Game Logic (e.g., Tile Distribution)

1.  **Backend: Tile Model**
    *   Create `Tile` model (e.g., `game_id`, `game_user_id`, `letter`, `value`, `position_in_hand`, `is_on_board`).
2.  **Backend: Tile Distribution Logic**
    *   When a `Game` status changes to `active`, implement logic to:
        *   Generate a set of initial tiles for the game.
        *   Distribute these tiles among the `GameUser`s (players) in the game.
        *   Associate tiles with specific `GameUser`s.
3.  **Backend: Game State Endpoint Enhancement**
    *   Update `GET /api/games/:id` to include player-specific information, like their current hand of tiles. Ensure a player only sees their own tiles, not opponents', unless game rules dictate otherwise.
4.  **Frontend: Displaying Tiles**
    *   On `game.html` (or the dynamic game interface on `home.html`), fetch and display the current player's tiles.

**Testing for Phase 3:**
*   Are tiles correctly generated when a game starts?
*   Are tiles correctly distributed and associated with each `GameUser`?
*   Can each player view their own tiles via the API?
*   Does the frontend correctly display the player's tiles?

---

### Phase 4: Real-time with ActionCable

1.  **Backend: ActionCable Setup**
    *   Install and configure ActionCable.
    *   Implement `ApplicationCable::Connection` for authenticating WebSocket connections (e.g., using the JWT).
2.  **Backend: GameChannel**
    *   Create a `GameChannel` (e.g., `game_channel.rb`).
    *   Users subscribe to a specific game's stream (e.g., `stream_for game`).
    *   Broadcast updates when:
        *   A player joins a game (`game.game_users.count` changes).
        *   A game starts (`game.status` changes to `active`).
        *   (Later) A player makes a move, turn changes, etc.
3.  **Frontend: ActionCable Client**
    *   Include ActionCable JavaScript in the frontend.
    *   JS to establish a WebSocket connection upon entering `game.html` or when a game is joined.
    *   JS to subscribe to the relevant `GameChannel` stream.
    *   JS to handle received broadcasts and update the UI dynamically (e.g., show new player joining, display "Game starting!" message, update tile displays).

**Testing for Phase 4:**
*   Can the frontend successfully connect to ActionCable?
*   Is the ActionCable connection authenticated?
*   When Player A joins a game, does Player B (if subscribed) receive a real-time update?
*   When the game starts, do all subscribed players receive a real-time update?
*   Does the UI update correctly based on these broadcasts without needing a page refresh?

---

### Phase 5: Basic Gameplay (Example: Turn-based Tile Placement)

1.  **Backend: Turn Management**
    *   Add `current_turn_game_user_id` to the `Game` model.
    *   Logic to set the first player's turn when the game starts.
    *   Logic to advance the turn to the next player.
2.  **Backend: Play Move Endpoint**
    *   Implement `POST /api/games/:id/move` endpoint.
    *   Validate:
        *   Is it the current player's turn?
        *   Is the move valid according to game rules (e.g., valid tile, valid placement)?
    *   Update game state (e.g., move tile from hand to board, update score).
    *   Advance the turn.
    *   Broadcast the game state change via ActionCable (new board state, whose turn it is).
3.  **Frontend: Making a Move**
    *   Allow the current player to select a tile and a position (simplified).
    *   JS to send the move to the `/api/games/:id/move` endpoint.
    *   UI should update based on ActionCable broadcasts (reflecting the move and turn change for all players).

**Testing for Phase 5:**
*   Is the first player correctly assigned the turn?
*   Can the current player make a valid move?
*   Are invalid moves rejected?
*   Does the game state update correctly after a move (e.g., tile moved, score updated)?
*   Does the turn advance to the next player?
*   Do all players see the updated game state and turn change in real-time?

---

### Phase 6: Further Enhancements & Refinements

*   **Scoring:** Implement and display scores.
*   **Game End Conditions:** Define and implement how a game ends and determine a winner.
*   **More Complex Game Logic:** Depending on the chosen game.
*   **User Interface/User Experience (UI/UX):** Improve the visual design and interactivity.
*   **Error Handling:** Robust error handling on both frontend and backend.
*   **Chat Functionality:** Potentially add a simple chat per game using ActionCable.
*   **Deployment:** Considerations for deploying the Rails API and serving the static frontend files.

--- 