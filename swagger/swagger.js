/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, moderator, admin, director, superadmin]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 *       422:
 *         description: Missing required fields
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/users/current:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile info
 */

/**
 * @swagger
 * /api/auth/users/all:
 *   get:
 *     summary: Get all users (public)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of all users
 */

/**
 * @swagger
 * /api/auth/moderator/users:
 *   get:
 *     summary: Moderator-level route
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Moderator access granted
 */

/**
 * @swagger
 *  /api/auth/admin/users:
 *   get:
 *     summary: Admin-level route
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 */

/**
 * @swagger
 *  /api/auth/director/users:
 *   get:
 *     summary: Director-level route
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Director access granted
 */

/**
 * @swagger
 *  /api/auth/superadmin/users:
 *   get:
 *     summary: Superadmin-level route
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Superadmin access granted
 */
