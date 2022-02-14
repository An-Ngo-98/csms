using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Text;

namespace CdnApi.Common.Extensions
{
    public static class ImageProcessing
    {
        // https://social.msdn.microsoft.com/Forums/vstudio/en-US/e2d8bd99-1af4-404a-a6bd-5fae9f540c2d/how-to-resize-an-image-in-byte-?forum=csharpgeneral
        // Create a thumbnail in byte array format from the image encoded in the passed byte array.  
        // (RESIZE an image in a byte[] variable.)  
        public static byte[] CreateThumbnail(byte[] sourceImage, int size = 600)
        {
            byte[] thumbnail;

            if (size == 0)
            {
                return sourceImage;
            }

            using (MemoryStream startMemoryStream = new MemoryStream(), newMemoryStream = new MemoryStream())
            {
                // write the string to the stream  
                startMemoryStream.Write(sourceImage, 0, sourceImage.Length);
                // create the start Bitmap from the MemoryStream that contains the image  
                Bitmap startBitmap = new Bitmap(startMemoryStream);
                // set thumbnail height and width proportional to the original image.  
                int newHeight;
                int newWidth;
                double hwRatio;

                if (startBitmap.Height > startBitmap.Width)
                {
                    newHeight = size;
                    hwRatio = size / (double)startBitmap.Height;
                    newWidth = (int)(hwRatio * startBitmap.Width);
                }
                else
                {
                    newWidth = size;
                    hwRatio = size / (double)startBitmap.Width;
                    newHeight = (int)(hwRatio * startBitmap.Height);
                }
                // create a new Bitmap with dimensions for the thumbnail.  
                // Copy the image from the START Bitmap into the NEW Bitmap.  
                // This will create a thumnail size of the same image.  
                Bitmap newBitmap = ResizeImage(startBitmap, newWidth, newHeight);
                // Save this image to the specified stream in the specified format.  
                newBitmap.Save(newMemoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                // Fill the byte[] for the thumbnail from the new MemoryStream.  
                thumbnail = newMemoryStream.ToArray();
                // Dispose objects
                startBitmap.Dispose();
                newBitmap.Dispose();
            }

            // return the resized image as a string of bytes.  
            return thumbnail;
        }

        // Resize a Bitmap  
        private static Bitmap ResizeImage(Bitmap image, int width, int height)
        {
            Bitmap resizedImage = new Bitmap(width, height);
            using (Graphics gfx = Graphics.FromImage(resizedImage))
            {
                gfx.DrawImage(image, new Rectangle(0, 0, width, height),
                    new Rectangle(0, 0, image.Width, image.Height), GraphicsUnit.Pixel);
            }
            return resizedImage;
        }
    }
}
