import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Magnifier = () => {
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle mouse over event for magnification
  const handleMouseOver = () => setHovered(true);
  const handleMouseOut = () => setHovered(false);

  return (
    <div className="magnifier-container mt-12 p-6 bg-gray-100 rounded-xl">
      <motion.h2
        className="text-3xl font-medium text-purple-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Magnifier Feature
      </motion.h2>

      {/* Image Upload Section */}
      <motion.div
        className="image-upload mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border-2 p-2 rounded-md"
        />
      </motion.div>

      {/* Display the uploaded image with magnification effect */}
      {image && (
        <motion.div
          className="magnified-image mt-10 relative flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={image}
            alt="Uploaded"
            className={`transition-transform duration-300 ease-in-out transform ${
              hovered ? 'scale-150' : 'scale-100'
            }`}
            style={{ width: '300px', cursor: 'zoom-in' }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          />
        </motion.div>
      )}

      {!image && (
        <div className="mt-6 text-center text-gray-500">
          <p>Please upload an image to use the magnifier feature.</p>
        </div>
      )}
    </div>
  );
};

export default Magnifier;
