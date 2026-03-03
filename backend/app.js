const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Начальный список товаров (не менее 10)
let products = [
  { id: nanoid(6), name: 'Наушники Sony WH-1000XM5', category: 'Аудио', description: 'Беспроводные наушники с активным шумоподавлением, 30 ч работы', price: 24990, stock: 8, rating: 4.8 },
  { id: nanoid(6), name: 'Клавиатура Logitech MX Keys', category: 'Периферия', description: 'Беспроводная клавиатура с подсветкой и умными клавишами', price: 9490, stock: 15, rating: 4.7 },
  { id: nanoid(6), name: 'Мышь Razer DeathAdder V3', category: 'Периферия', description: 'Игровая мышь с оптическим сенсором 30 000 DPI', price: 6990, stock: 20, rating: 4.9 },
  { id: nanoid(6), name: 'Монитор LG UltraWide 34"', category: 'Мониторы', description: 'Ультраширокий монитор 34 дюйма, 2560x1080, 144 Гц', price: 39990, stock: 5, rating: 4.6 },
  { id: nanoid(6), name: 'Веб-камера Logitech C920', category: 'Видео', description: 'Full HD 1080p, автофокус, встроенный микрофон', price: 7490, stock: 12, rating: 4.5 },
  { id: nanoid(6), name: 'SSD Samsung 970 EVO 1TB', category: 'Накопители', description: 'NVMe M.2, скорость чтения 3500 МБ/с', price: 8990, stock: 25, rating: 4.9 },
  { id: nanoid(6), name: 'Зарядка Anker PowerCore 20000', category: 'Аксессуары', description: 'Портативный аккумулятор 20000 мАч, быстрая зарядка', price: 3490, stock: 30, rating: 4.7 },
  { id: nanoid(6), name: 'Колонка JBL Charge 5', category: 'Аудио', description: 'Портативная Bluetooth-колонка, IPX7, 20 ч работы', price: 12990, stock: 10, rating: 4.8 },
  { id: nanoid(6), name: 'Коврик SteelSeries QcK XXL', category: 'Периферия', description: 'Игровой коврик 900x400 мм, антискользящая основа', price: 2990, stock: 40, rating: 4.6 },
  { id: nanoid(6), name: 'USB-хаб Anker 10-in-1', category: 'Аксессуары', description: 'USB-C хаб: HDMI 4K, 3xUSB-A, SD, Ethernet', price: 5490, stock: 18, rating: 4.5 },
  { id: nanoid(6), name: 'Микрофон Blue Yeti', category: 'Аудио', description: 'Конденсаторный USB-микрофон, 4 режима записи', price: 14990, stock: 7, rating: 4.8 },
];

// Middleware
app.use(express.json());

// Логирование
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) console.log('Body:', req.body);
  });
  next();
});

// CORS
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
      title: 'API интернет-магазина',
      version: '1.0.0',
      description: 'REST API для управления товарами интернет-магазина. Поддерживает полный набор CRUD-операций.',
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
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *           enum: [Аудио, Периферия, Мониторы, Видео, Накопители, Аксессуары, Другое]
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           nullable: true
 *           description: Рейтинг товара от 0 до 5
 *       example:
 *         id: "abc123"
 *         name: "Наушники Sony WH-1000XM5"
 *         category: "Аудио"
 *         description: "Беспроводные наушники с активным шумоподавлением"
 *         price: 24990
 *         stock: 8
 *         rating: 4.8
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена в рублях
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           description: Рейтинг 0-5
 *       example:
 *         name: "Монитор LG 27"
 *         category: "Мониторы"
 *         description: "IPS, 2560x1440, 165 Гц"
 *         price: 35990
 *         stock: 4
 *         rating: 4.7
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Описание ошибки
 *       example:
 *         error: "Товар не найден"
 */

// ─── Вспомогательная функция ──────────────────────────────────────────────────

function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Товар не найден' });
    return null;
  }
  return product;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создаёт новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Не указаны обязательные поля
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock, rating } = req.body;
  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Укажите name, category, price, stock' });
  }
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description ? description.trim() : '',
    price: Number(price),
    stock: Number(stock),
    rating: rating != null ? Number(rating) : null,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные товара (частично)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *             example:
 *               price: 19990
 *               stock: 5
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет полей для обновления
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  const { name, category, description, price, stock, rating } = req.body;
  const hasFields = [name, category, description, price, stock, rating].some(v => v !== undefined);
  if (!hasFields) {
    return res.status(400).json({ error: 'Нет полей для обновления' });
  }

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);

  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удалён (тело ответа отсутствует)
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/products/:id', (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Товар не найден' });
  products = products.filter(p => p.id !== req.params.id);
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

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI доступен: http://localhost:${port}/api-docs`);
});
