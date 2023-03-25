import { Box, ButtonProps, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import Button from '@mui/material/Button';
import { ImageToUploadType } from "../../pages/StockForm";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

type ImageUploadProps = {
  loadImageToUpload: (images: ImageToUploadType[]) => void;
  imagesToPreview?: any;
}

export function ImageUpload({ loadImageToUpload, imagesToPreview }: ImageUploadProps) {
  const [images, setImages] = React.useState(imagesToPreview ? imagesToPreview.map((previewImage: any) => ({
    dataURL: previewImage,
  })) : []);
  const [imageSelected, setImageSelected] = useState(0);
  const maxNumber = 69;

  console.log(imagesToPreview);


  function handleChangeImage(direction: string) {
    switch (direction) {
      case 'left':
        setImageSelected(prevState => {
          if (images.length === 0) return prevState;
          if (prevState === 0) return prevState
          else return prevState - 1;
        })
        break;
      case 'right':
        setImageSelected(prevState => {
          if (images.length === 0) return prevState;
          if (prevState === images.length - 1) return prevState
          else return prevState + 1;
        })
        break;
      default:
        break;
    }
  }


  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    setImages(imageList as never[]);
    if (imageList.length > 0 && imageList[0].dataURL && imageList[0].file) {
      loadImageToUpload(imageList.map(image => ({
        url: image.dataURL,
        type: image.file?.type,
        file: image.file
      }) as any))
    }
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
        resolutionType='ratio'
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Button variant="contained" onClick={() => handleChangeImage('left')} color="primary">
                <KeyboardArrowLeftIcon />
              </Button>
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
                    src={imageList[imageSelected].dataURL}
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
                    <ColorButton onClick={() => onImageUpdate(imageList.length - 1)} sx={{ position: 'absolute', bottom: 0, right: 0, marginLeft: 'auto' }}>Mudar Foto(s)</ColorButton>
                  </div>
                }
              </Box>
              <Button variant="contained" onClick={() => handleChangeImage('right')} color="primary">
                <KeyboardArrowRight />
              </Button>
            </div>
            {images.length > 0 ?
              <Typography variant="body1">{imageSelected + 1} de {imageList.length}</Typography>
              :
              <Typography variant="body1" color={'rgba(150, 150, 150, 0.87)'}>Sem fotos selecionadas</Typography>
            }
          </div>
        )
        }
      </ImageUploading >
    </div >
  );
}
