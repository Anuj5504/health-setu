import { supabase } from './supabaseClient';

const uploadPdf = async (file) => {
  try {
    const bucketName = "doconrx";
    const fileName = `${Date.now()}_prescription.pdf`; 

    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
      contentType: "application/pdf",
    });

    if (error) {
      throw error;
    }

    const publicUrl = `https://dfoceqnxrdplfjsawtcc.supabase.co/storage/v1/object/public/${bucketName}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading PDF:", error.message);
    return null;
  }
};

const deletePdf = async (url) => {
  try {
    const bucketName = "doconrx";
    const filePath = url.split(`${bucketName}/`)[1];

    if (!filePath) {
      throw new Error("Invalid URL or file path could not be extracted.");
    }

    const { data, error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error("Error deleting PDF:", error.message);
    return false;
  }
};

export { uploadPdf, deletePdf };

