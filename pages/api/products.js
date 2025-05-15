import { Product, Category, ProductGroup, ProductImage, ProductDescription } from '../../models/product';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { sequelize } from '../../models/product';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function parseBoolean(value) {
  if (value === 'false') return false;
  if (value === 'true') return true;
  return Boolean(value);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetRequest(req, res);

    case 'PUT': {
      const { action, id, skipStatus } = req.query;

      if (action === 'status') {
        return handleStatusUpdate(req, res, id);
      }

      return handleUploadWrapper(req, res, (req, res) => handlePutRequest(req, res, skipStatus));
    }

    case 'POST':
      return handleUploadWrapper(req, res, handlePostRequest);

    case 'DELETE': {
      const { action } = req.query;
      if (action === 'delete-image') {
        return handleDeleteImageRequest(req, res);
      }
      return handleDeleteRequest(req, res);
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Метод ${method} не разрешен` });
  }
}

function handleUploadWrapper(req, res, handlerFn) {
  return new Promise((resolve, reject) => {
    upload.any()(req, res, async (err) => {
      if (err) {
        console.error('Ошибка при загрузке файлов:', err);
        res.status(500).json({ message: 'Ошибка при загрузке файлов', error: err.message });
        return reject(err);
      }
      try {
        await handlerFn(req, res);
        resolve();
      } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Ошибка сервера', error: error.message });
        }
        reject(error);
      }
    });
  });
}

async function handleStatusUpdate(req, res, id) {
  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();

    let statusValue;
    try {
      const jsonData = JSON.parse(data);
      statusValue = jsonData.status;
    } catch (err) {
      console.error('Ошибка парсинга JSON:', err);
      return res.status(400).json({ message: 'Ошибка при разборе данных' });
    }

    if (typeof statusValue === 'undefined') {
      return res.status(400).json({ message: 'Статус не указан' });
    }

    const parsedStatus = parseBoolean(statusValue);

    const t = await sequelize.transaction();

    try {
      const product = await Product.findByPk(id, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: 'Товар не найден' });
      }

      product.status = parsedStatus;

      await product.save({ transaction: t });

      await t.commit();

      return res.status(200).json({ 
        message: 'Статус обновлен', 
        status: parsedStatus
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

async function handlePutRequest(req, res, skipStatus) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID товара обязателен' });
  }

  const { name, description, price, category_id, status, features } = req.body;

  if (!name || !category_id || !price) {
    return res.status(400).json({ message: 'Название, категория и цена обязательны' });
  }

  const priceValue = String(price).replace(',', '.').replace(/\s/g, '');
  const formattedPrice = parseFloat(priceValue);
  if (isNaN(formattedPrice)) {
    return res.status(400).json({ message: 'Неверный формат цены' });
  }

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    const updateData = {
      name,
      description: description || product.description,
      price: formattedPrice,
      category_id,
      ...(skipStatus === 'true' ? {} : { status }) 
    };

    await product.update(updateData);

    if (req.files && Array.isArray(req.files)) {
      const existing = await ProductImage.findAll({ where: { product_id: id } });
      const existingUrls = existing.map(img => img.image_url);

      const newImages = req.files
        .filter(file => !existingUrls.includes(`/uploads/${file.filename}`))
        .map(file => ({
          product_id: id,
          image_url: `/uploads/${file.filename}`,
        }));

      if (newImages.length > 0) {
        await ProductImage.bulkCreate(newImages);
      }
    }

    if (features) {
      try {
        const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;

        await ProductDescription.destroy({ where: { product_id: id } });

        if (Array.isArray(parsedFeatures)) {
          const newDescriptions = parsedFeatures
            .filter(desc => desc.text && desc.text.trim() !== '')
            .map((desc, index) => ({
              product_id: id,
              description_text: desc.text.trim(),
              description_order: desc.order ? parseInt(desc.order) : index + 1
            }));

          if (newDescriptions.length > 0) {
            await ProductDescription.bulkCreate(newDescriptions);
          }
        }
      } catch (error) {
        console.error('Ошибка при обработке характеристик:', error);
      }
    }

    const updatedProduct = await Product.findByPk(id, {
      include: [ProductImage, ProductDescription]
    });

    return res.status(200).json({
      message: 'Товар успешно обновлен',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    return res.status(500).json({
      message: 'Ошибка сервера при обновлении товара',
      error: error.message
    });
  }
}

async function handleGetRequest(req, res) {
  const { id, category, subcategory } = req.query;

  try {
    if (id) {
      const product = await Product.findByPk(id, {
        include: [
          { model: ProductImage, attributes: ['id', 'image_url'] }, 
          { model: ProductDescription, attributes: ['description_text', 'description_order'] },
          {
            model: Category,
            attributes: ['name'],
            include: { model: ProductGroup, attributes: ['name'] }
          }
        ]
      });

      if (!product) {
        console.error('Product not found for ID:', id);
        return res.status(404).json({ message: 'Товар не найден' });
      }
      return res.status(200).json(product);
    }

    const whereClause = {};

    if (category) {
      const group = await ProductGroup.findOne({
        where: { name: category },
        include: { model: Category, attributes: ['id'] },
      });

      if (!group) {
        console.error('Group not found for category:', category);
        return res.status(404).json({ message: 'Группа не найдена' });
      }

      const categoryIds = group.Categories.map(c => c.id);
      whereClause.category_id = categoryIds;
    }

    if (subcategory && subcategory !== 'all') {
      whereClause.subcategory_id = parseInt(subcategory, 10);
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [
        { model: ProductImage, attributes: ['id', 'image_url'] }, 
        { model: ProductDescription, attributes: ['description_text', 'description_order'] },
        {
          model: Category,
          attributes: ['name'],
          include: { model: ProductGroup, attributes: ['name'] }
        }
      ],
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error while fetching products:', error);
    return res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
}

async function handlePostRequest(req, res) {
  const { name, description, price, category_id, status } = req.body;
  let list = req.body.list;
  const images = req.files;

  if (!name || !category_id || !price) {
    return res.status(400).json({ message: 'Название, категория и цена обязательны' });
  }

  const formattedPrice = parseFloat(price);
  if (isNaN(formattedPrice)) {
    return res.status(400).json({ message: 'Неверный формат цены' });
  }

  if (typeof list === 'string') {
    try {
      list = JSON.parse(list);
    } catch {
      list = [];
    }
  }

  try {
    const newProduct = await Product.create({
      name,
      description: description || '',
      price: formattedPrice,
      category_id,
      status: parseBoolean(status), 
    });

    if (Array.isArray(list)) {
      await Promise.all(
        list.map(async (desc, index) => {
          if (desc.trim()) {
            await ProductDescription.create({
              product_id: newProduct.id,
              description_text: desc.trim(),
              description_order: index + 1,
            });
          }
        })
      );
    }

    if (Array.isArray(images)) {
      await Promise.all(
        images.map(async (image) => {
          const relativePath = `/uploads/${image.filename}`;
          await ProductImage.create({
            product_id: newProduct.id,
            image_url: relativePath,
          });
        })
      );
    }

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Ошибка при добавлении товара:', error);
    return res.status(500).json({ message: 'Ошибка сервера при добавлении товара', error: error.message });
  }
}

async function handleDeleteRequest(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: 'ID товара обязателен для удаления' });

  try {
    const productImages = await ProductImage.findAll({ 
      where: { product_id: id },
      attributes: ['image_url']
    });

    await Promise.all(
      productImages.map(async (image) => {
        const imagePath = path.join(process.cwd(), 'public', image.image_url);
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Файл удален: ${imagePath}`);
          }
        } catch (err) {
          console.error(`Ошибка при удалении файла ${imagePath}:`, err);
        }
      })
    );

    await ProductImage.destroy({ where: { product_id: id } });
    await ProductDescription.destroy({ where: { product_id: id } });
    const deletedCount = await Product.destroy({ where: { id } });

    if (deletedCount === 0) return res.status(404).json({ message: 'Товар не найден' });

    return res.status(200).json({ message: 'Товар успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении товара:', error);
    return res.status(500).json({ message: 'Ошибка сервера при удалении товара', error: error.message });
  }
}

async function handleDeleteImageRequest(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID изображения обязателен' });
  }

  try {
    const image = await ProductImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Изображение не найдено' });
    }

    const imagePath = path.join(process.cwd(), 'public', image.image_url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await image.destroy();

    return res.status(200).json({ message: 'Изображение успешно удалено' });
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    return res.status(500).json({ 
      message: 'Ошибка сервера при удалении изображения',
      error: error.message
    });
  }
}

