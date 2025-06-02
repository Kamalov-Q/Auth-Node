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
 *             required: [name, email, password]
 *             type: object
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
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and return tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [email, password]
 *             type: object
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
 *       422:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Get a new access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [refreshToken]
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Invalid or expired refresh token
 *       422:
 *         description: Missing refresh token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and invalidate tokens
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/users/current:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
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
 * /api/auth/moderator/create:
 *   post:
 *     tags:
 *       - Moderator
 *     summary: Create a new moderator
 *     description: Allows an authenticated user with roles `admin`, `director`, or `superadmin` to create a new moderator.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: moderatorUser
 *               email:
 *                 type: string
 *                 format: email
 *                 example: moderator@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123!
 *     responses:
 *       201:
 *         description: Moderator created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Moderator created successfully.
 *                 moderator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 12345
 *                     username:
 *                       type: string
 *                       example: moderatorUser
 *                     email:
 *                       type: string
 *                       example: moderator@example.com
 *       400:
 *         description: Bad Request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User not authorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/moderator/users:
 *   get:
 *     summary: Moderator-level route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Moderator access granted
 */

/**
 * @swagger
 * /api/auth/admin/users:
 *   get:
 *     summary: Admin-level route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 */

/**
 * @swagger
 * /api/auth/director/users:
 *   get:
 *     summary: Director-level route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Director access granted
 */

/**
 * @swagger
 * /api/auth/superadmin/users:
 *   get:
 *     summary: Superadmin-level route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Superadmin access granted
 */
