import { Box, ButtonProps, styled, Typography } from "@mui/material";
import React from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Button from '@mui/material/Button';

export function ImageUpload() {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: '#230f04',
    color: 'white',
    '&:hover': {
      backgroundColor: '#e3573b',
    },
  }));

  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <Box
              onClick={imageList.length === 0 ? onImageUpload : () => { }}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 400,
                height: 300,
                borderRadius: '4px',
                padding: 0,
                ...((imageList.length === 0) && { border: '2px solid rgba(150, 150, 150, 0.87)', borderStyle: 'dashed' }),
                ...(isDragging && { backgroundColor: '#e3573b' })
              }}
              {...dragProps}
            >
              {imageList.length === 0 &&
                <Typography variant="body1" color={!isDragging ? 'rgba(150, 150, 150, 0.87)' : 'white'}>+ Insira a foto do produto</Typography>
              }

              {imageList.length > 0 &&
                <img
                  src={imageList[imageList.length - 1].dataURL}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    overflow: 'hidden',
                  }} />
              }
              {imageList.length > 0 &&
                <div>
                  <ColorButton onClick={() => onImageUpdate(imageList.length - 1)} sx={{ position: 'absolute', bottom: 0, right: 0, marginLeft: 'auto' }}>Mudar Foto</ColorButton>
                </div>
              }
            </Box>


          </div>
        )
        }
      </ImageUploading >
    </div >
  );
}
