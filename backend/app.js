const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Начальный список пользователей
let users = [
  { id: nanoid(6), name: 'Пётр Иванов', age: 16 },
  { id: nanoid(6), name: 'Иван Сидоров', age: 18 },
  { id: nanoid(6), name: 'Дарья Петрова', age: 20 },
  { id: nanoid(6), name: 'Алексей Смирнов', age: 25 },
  { id: nanoid(6), name: 'Мария Козлова', age: 22 },
];

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) console.log('Body:', req.body);
  });
  next();
});

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Swagger ──────────────────────────────────────────────────────────────────

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API управления пользователями',
      version: '1.0.0',
      description: 'REST API для управления пользователями. Поддерживает полный набор CRUD-операций.',
    },
    servers: [{ url: `http://localhost:${port}`, description: 'Локальный сервер' }],
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         age:
 *           type: integer
 *           description: Возраст пользователя
 *       example:
 *         id: "abc123"
 *         name: "Пётр Иванов"
 *         age: 16
 *
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         age:
 *           type: integer
 *           description: Возраст пользователя
 *       example:
 *         name: "Новый Пользователь"
 *         age: 21
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *       example:
 *         error: "Пользователь не найден"
 */

// ─── Вспомогательная функция ──────────────────────────────────────────────────

function findUserOr404(id, res) {
  const user = users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return null;
  }
  return user;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создаёт нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Не указаны обязательные поля
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/users', (req, res) => {
  const { name, age } = req.body;
  if (!name || age === undefined) {
    return res.status(400).json({ error: 'Укажите name и age' });
  }
  const newUser = {
    id: nanoid(6),
    name: name.trim(),
    age: Number(age),
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Возвращает список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получает пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/users/:id', (req, res) => {
  const user = findUserOr404(req.params.id, res);
  if (!user) return;
  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновляет данные пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *             example:
 *               age: 30
 *     responses:
 *       200:
 *         description: Обновлённый пользователь
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Нет полей для обновления
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch('/api/users/:id', (req, res) => {
  const user = findUserOr404(req.params.id, res);
  if (!user) return;

  const { name, age } = req.body;
  if (name === undefined && age === undefined) {
    return res.status(400).json({ error: 'Нет полей для обновления' });
  }

  if (name !== undefined) user.name = name.trim();
  if (age !== undefined) user.age = Number(age);

  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаляет пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь успешно удалён
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/users/:id', (req, res) => {
  const exists = users.some(u => u.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Пользователь не найден' });
  users = users.filter(u => u.id !== req.params.id);
  res.status(204).send();
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
