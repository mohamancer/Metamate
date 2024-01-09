import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';

export type PostResponse = {
  // Define the structure of the response from the Facebook API
  // Adjust this based on the actual response structure
  // This is just a placeholder for demonstration purposes
  success: boolean;
  postId?: number;
};

const postToFeed = async (
  pageId: string,
  pageAccessToken: string,
  message: string,
): Promise<PostResponse> => {
  const endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;

  try {
    const response: AxiosResponse<PostResponse> = await axios.post(
      endpoint,
      {
        message,
        access_token: pageAccessToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status >= 200 && response.status < 300) {
      console.log('POST request was successful');
      return { success: true };
    }

    return { success: false };
  } catch (error: any) {
    console.log('POST request failed');
    throw error.message;
  }
};

const postWithImage = async (
  pageId: string,
  pageAccessToken: string,
  message: string,
  imagePath: string,
): Promise<PostResponse> => {
  const endpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;

  try {
    const formData = new FormData();
    formData.append('message', message);

    // Read the image file asynchronously
    const imageBuffer = await fs.promises.readFile(imagePath);
    const randomFileName = `image_${Date.now()}${Math.floor(
      Math.random() * 10000,
    )}${path.extname(imagePath)}`;
    // Create a Blob from the Buffer
    const imageBlob = new Blob([imageBuffer]);

    // Append the image Blob to the form data
    formData.append('source', imageBlob, randomFileName);

    formData.append('access_token', pageAccessToken);

    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status >= 200 && response.status < 300) {
      console.log('image POST request was successful');
      return { success: true };
    }

    return { success: false };
  } catch (error: any) {
    console.log('image POST request failed');
    console.log(error);
    throw error.message;
  }
};
export { postToFeed, postWithImage };
