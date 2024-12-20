import axios from 'axios';
import React from 'react'
import toast from 'react-hot-toast';
const ImageUpload = async (image) => {
    const preset_key = 'fhinwtkj'
    const cloud_name = 'dzrhciunb'
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', preset_key);

    try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData);
        const { format, secure_url } = res.data;

        if (['png', 'jpeg', 'jpg'].includes(format)) {
            console.log('shring the url data :',secure_url);
            return secure_url
        } else {
            toast.error('Image format jpg or png allowed')
            return null;
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export default ImageUpload;


