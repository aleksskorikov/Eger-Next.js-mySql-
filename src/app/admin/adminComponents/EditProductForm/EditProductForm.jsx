import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./_editProductForm.module.scss";
import StatusCheckbox from "../StatusCheckbox/StatusCheckbox"; 

const EditProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: [],
    images: [],
    status: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        features: product.ProductDescriptions?.map(d => ({
          id: d.id,
          text: d.description_text,
          order: d.description_order,
        })) || [],
        images: product.ProductImages || [],
        status: product.status || false, 
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index].text = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleAddFeature = () => {
    if (formData.features.length >= 20) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { text: '', order: prev.features.length + 1 }]
    }));
  };

  const handleDeleteImage = async (imageId, imageUrl) => {
    if (!imageId || !imageUrl) return;
    if (!confirm('Удалить изображение?')) return;

    try {
      const response = await fetch(`/api/products?id=${imageId}&action=delete-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении изображения');
      }

      const updatedImages = formData.images.filter(img => img.id !== imageId);

      setFormData(prev => ({
        ...prev,
        images: updatedImages,
      }));

    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      alert(error.message || 'Не удалось удалить изображение');
    }
  };

  const handleAddImageClick = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImage = {
        id: `new-${Date.now()}-${index}`,
        file: file,
        preview: URL.createObjectURL(file),
      };

      const updatedImages = [...formData.images];
      updatedImages[index] = newImage;

      setFormData(prev => ({
        ...prev,
        images: updatedImages,
      }));
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/no-image.jpg';
    return imagePath.startsWith('/uploads/') ? imagePath : `/uploads/${imagePath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category_id', product.category_id);
      formDataToSend.append('status', formData.status ? 'true' : 'false');


      formData.features.forEach((feature, index) => {
        formDataToSend.append(`features[${index}][text]`, feature.text);
        formDataToSend.append(`features[${index}][order]`, feature.order || index + 1);
      });

      formData.images.forEach((img) => {
        if (img.file) {
          formDataToSend.append('images', img.file);
        }
      });

      const response = await fetch(`/api/products?id=${product.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка HTTP! статус: ${response.status}, сообщение: ${errorText}`);
      }

      const savedProduct = await response.json();
      onSave(savedProduct);

      const formDataObj = {};
formDataToSend.forEach((value, key) => {
  formDataObj[key] = value;
});

    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
      alert(error.message || 'Не удалось сохранить изменения');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  if (!product) return <p>Загрузка...</p>;

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Редактировать товар</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLable}>Название товара</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLable}>Описание товара</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLable}>Цена товара</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLable}>Статус</label>
          <StatusCheckbox
            productId={product.id}
            initialStatus={formData.status}
            onStatusChange={handleStatusChange}
          />
        </div>

        <div className={styles.imageGrid}>
          {Array.from({ length: 10 }).map((_, index) => {
            const img = formData.images[index];

            return (
              <div key={img?.id || index} className={styles.imageItem}>
                {img ? (
                  <>
                    <Image
                      src={img.preview ? img.preview : getImageUrl(img.image_url)}
                      alt={`Изображение ${index + 1}`}
                      width={150}
                      height={150}
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id, img.image_url)}
                      className={styles.deleteImageButton}
                    >
                      Удалить
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAddImageClick(index)}
                      className={styles.addImageButton}
                    >
                      Добавить изображение
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(index, e)}
                      className={styles.formInput}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.formGroup}>
          <h3>Характеристики товара</h3>
          {formData.features.map((feature, index) => (
            <div key={feature.id || index} className={styles.featureItem}>
              <input
                type="text"
                value={feature.text || ''}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className={styles.featureInput}
                placeholder={`Характеристика ${index + 1}`}
              />
            </div>
          ))}
          {formData.features.length < 20 && (
            <button
              type="button"
              onClick={handleAddFeature}
              className={styles.addFeatureButton}
            >
              Добавить характеристику
            </button>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
