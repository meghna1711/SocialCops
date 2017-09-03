import express from 'express';
import middlewares from '../middlewares/middleware';
import controllers from '../controllers/index';
let router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User
 *     description: Login User and get access token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: Username and password
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User id, username and token
 *         schema:
 *           properties:
 *             username:
 *               type: string
 *             _id:
 *               type: string
 *             token:
 *               type: string
 *       500:
 *         description: Internal server error or No User Found
 *         schema:
 *           type: string
 *
 *
 * /get/thumbnail:
 *   post:
 *     tags:
 *       - Thumbnail
 *     description: Generate 50X50 thumbnail by passing a url
 *     produces:
 *       - image/png
 *       - image/jpeg
 *       - image/jpg
 *     parameters:
 *       - name: url
 *         description: Image url to generate to thumbnail
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             url:
 *               type: string
 *     responses:
 *       200:
 *         description: 50x50 file
 *         schema:
 *           type: file
 *       500:
 *         description: Error from server
 *         schema:
 *           type: string
 *
 * /addpatch:
 *   post:
 *     tags:
 *       - JSON Patcher
 *     description: Apply Json patch to JSON Object
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: jsonpatcher
 *         description: Need JSON Patch and JSON Object
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             source:
 *               type: object
 *             patch:
 *               type: object
 *     responses:
 *       200:
 *         description: Patched JSON
 *         schema:
 *           type: object
 *       500:
 *         description: Error from server
 *         schema:
 *           type: string
 *
 */
router.post('/login', middlewares.tokenTryAuth, controllers.auth);
router.post('/get/thumbnail', middlewares.tokenAuth, controllers.generateThumbnail);
router.post('/addpatch', middlewares.tokenAuth, controllers.patch);

export default router;