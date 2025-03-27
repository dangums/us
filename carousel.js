import { config } from './config.js';

export class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.carousel = this.container.querySelector('.carousel');
        this.images = [];
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.carouselDots = document.createElement('div');
        this.carouselDots.className = 'carousel-dots';
        this.container.appendChild(this.carouselDots);
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Touch events for mobile
        this.carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.carousel.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.carousel.addEventListener('touchend', () => this.handleTouchEnd());
        
        // Mouse events for desktop
        this.carousel.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', () => this.handleMouseUp());
        
        // Prevent context menu on long press
        this.carousel.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    addImage(src, alt = 'Gallery Photo') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.classList.add('carousel-image');
        
        // Add click to enlarge functionality
        img.addEventListener('click', () => {
            if (img.classList.contains('active')) {
                this.openImageModal(src);
            } else {
                const clickedIndex = Array.from(this.carousel.children).indexOf(img);
                this.goToImage(clickedIndex);
            }
        });
        
        this.carousel.appendChild(img);
        this.images.push(img);
        this.updateCarouselState();
        this.updateDots();
    }
    
    updateCarouselState() {
        this.images.forEach((img, index) => {
            img.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentIndex) {
                img.classList.add('active');
            } else if (index === this.currentIndex - 1 || 
                      (this.currentIndex === 0 && index === this.images.length - 1)) {
                img.classList.add('prev');
            } else if (index === this.currentIndex + 1 || 
                      (this.currentIndex === this.images.length - 1 && index === 0)) {
                img.classList.add('next');
            }
        });
    }
    
    updateDots() {
        this.carouselDots.innerHTML = '';
        
        this.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === this.currentIndex) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                this.goToImage(index);
            });
            
            this.carouselDots.appendChild(dot);
        });
    }
    
    goToImage(index) {
        this.currentIndex = index;
        this.updateCarouselState();
        this.updateDots();
        this.centerActiveImage();
    }
    
    centerActiveImage() {
        if (this.images.length === 0) return;
        
        const activeImage = this.images[this.currentIndex];
        if (!activeImage) return;
        
        const containerWidth = this.container.offsetWidth;
        const imageRect = activeImage.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        const imageCenter = imageRect.left + imageRect.width / 2;
        const containerCenter = containerRect.left + containerWidth / 2;
        const offset = imageCenter - containerCenter;
        
        this.carousel.style.transform = `translateX(${-offset}px)`;
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateCarouselState();
        this.updateDots();
        this.centerActiveImage();
    }
    
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateCarouselState();
        this.updateDots();
        this.centerActiveImage();
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.isDragging = true;
        this.carousel.style.transition = 'none';
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        this.touchEndX = e.touches[0].clientX;
        const diffX = this.touchStartX - this.touchEndX;
        
        // Get the current transform value and adjust it
        const currentTransform = this.getTransformX();
        this.carousel.style.transform = `translateX(${currentTransform - diffX}px)`;
        this.touchStartX = this.touchEndX;
    }
    
    handleTouchEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.carousel.style.transition = 'transform 0.3s ease';
        
        const threshold = 50; // Minimum distance to trigger next/prev
        
        if (this.touchEndX - this.touchStartX > threshold) {
            this.prevImage();
        } else if (this.touchStartX - this.touchEndX > threshold) {
            this.nextImage();
        } else {
            this.centerActiveImage();
        }
    }
    
    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.pageX - this.carousel.offsetLeft;
        this.scrollLeft = this.getTransformX();
        this.carousel.style.transition = 'none';
        this.carousel.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const x = e.pageX - this.carousel.offsetLeft;
        const walk = (x - this.startX);
        this.carousel.style.transform = `translateX(${this.scrollLeft + walk}px)`;
    }
    
    handleMouseUp() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.carousel.style.cursor = 'grab';
        this.carousel.style.transition = 'transform 0.3s ease';
        this.centerActiveImage();
    }
    
    getTransformX() {
        const transform = window.getComputedStyle(this.carousel).getPropertyValue('transform');
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
            const values = matrix[1].split(', ');
            return parseFloat(values[4]) || 0;
        }
        return 0;
    }
    
    openImageModal(src) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.objectFit = 'contain';
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', () => {
            modal.remove();
        });
    }
}