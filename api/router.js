import Router from "@koa/router";
import * as users from "./users/index.js";
import * as games from "./games/index.js";
import * as hunches from "./hunches/index.js";

export const router = new Router();

// USER
router.get('/login', users.login)
router.post('/users', users.create)

// HUNCH
router.post('/hunches', hunches.create)

// GAME
router.get('/games', games.list)

router.get('/:username', users.hunches)