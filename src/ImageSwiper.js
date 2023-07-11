
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function ImageSwiper({ items, activeIndex, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Swiper
        initialSlide={activeIndex}
        navigation
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides
        loop
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {item.data.type === 'video' ? (
              <video
                src={item.data.url}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                }}
                controls
              />
            ) : (
              <img
                src={item.data.url}
                alt={item.data.text}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: '#fff',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 10000,
        }}
      >
        Close
      </button>
    </div>
  );
}
