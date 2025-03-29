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
        // Add grab cursor
        this.carousel.style.cursor = 'grab';
        
        this.setupEventListeners();

        // Initial responsiveness adjustment
        this.adjustResponsiveness();
        window.addEventListener('resize', () => this.adjustResponsiveness());

                // Configurações de sensibilidade
        this.swipeThreshold = 50; // Distância mínima para considerar swipe
        this.animationDuration = 300; // Duração da animação em ms
                
        this.setupTouchEvents();
        this.updateCarousel();
    }

    setupTouchEvents() {
        let startX, moveX, isSwiping = false;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            this.carousel.style.transition = 'none';
        }, { passive: true });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            moveX = e.touches[0].clientX;
            const diff = moveX - startX;
            this.carousel.style.transform = `translateX(${-this.currentIndex * 100 + diff * 0.2}%)`;
        }, { passive: true });

        this.carousel.addEventListener('touchend', () => {
            if (!isSwiping) return;
            isSwiping = false;
            
            const diff = moveX - startX;
            if (Math.abs(diff) > this.swipeThreshold) {
                if (diff > 0) {
                    this.prev();
                } else {
                    this.next();
                }
            } else {
                this.updateCarousel();
            }
        });
    }

    next() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    updateCarousel() {
        this.carousel.style.transition = `transform ${this.animationDuration}ms ease`;
        this.carousel.style.transform = `translateX(${-this.currentIndex * 100}%)`;
    }

    adjustResponsiveness() {
        // Adjust image size based on container size
        const containerWidth = this.container.offsetWidth;
        const imagesToShow = Math.floor(containerWidth / 200); // Estimate how many images fit
        
        this.images.forEach(img => {
            img.style.width = `${containerWidth / imagesToShow - 30}px`;
            img.style.height = 'auto';
            img.style.margin = '0 15px';
        });
        
        // Center the active image
        this.centerActiveImage();
    }
    
    setupEventListeners() {
          // Touch events for mobile devices
        this.carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.carousel.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.carousel.addEventListener('touchend', () => this.handleTouchEnd(), { passive: false });
        
        // Mouse events for desktop
        this.carousel.addEventListener('mousedown', (e) => this.handleDragStart(e));
        window.addEventListener('mousemove', (e) => this.handleDrag(e));
        window.addEventListener('mouseup', () => this.handleDragEnd());

        // Prevent context menu on long press
        this.carousel.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    addImage(src, alt = 'Gallery Photo') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.classList.add('carousel-image');
        
        // Add click-to-enlarge functionality
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
        
        // Adjust responsiveness after adding image
        this.adjustResponsiveness();
    }
    
   /*updateCarouselState() {
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
    }*/

    updateCarouselState() {
        this.images.forEach((img, index) => {
            img.classList.remove('active');
            
            if (index === this.currentIndex) {
                img.classList.add('active');
            }
        });
        
        // Centraliza a imagem ativa
        this.centerActiveImage();
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
    
    /*centerActiveImage() {
        if (this.images.length === 0) return;
        
        const activeImage = this.images[this.currentIndex];
        if (!activeImage) return;
        
        const containerWidth = this.container.offsetWidth;
        const imageRect = activeImage.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        const imageCenter = imageRect.left + imageRect.width / 2;
        const containerCenter = containerRect.left + containerWidth / 2;
        const offset = imageCenter - containerCenter;
        
        this.carousel.style.transition = 'transform 0.3s ease';
        this.carousel.style.transform = `translateX(${-offset}px)`;
    }*/
    centerActiveImage() {
        if (this.images.length === 0) return;
          
        const containerWidth = this.container.offsetWidth;
        const imageWidth = containerWidth / 3;
        const scrollPosition = this.currentIndex * imageWidth - imageWidth;
        
        this.carousel.style.transform = `translateX(${-scrollPosition}px)`;
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
    
    /*openImageModal(src) {
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
    }*/
        openImageModal(src) {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            
            const img = document.createElement('img');
            img.src = src;
            
            // Botão de fechar
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => modal.remove());
            
            // Botão de navegação anterior
            const prevBtn = document.createElement('button');
            prevBtn.className = 'modal-nav modal-prev';
            prevBtn.innerHTML = '&larr;';
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prevImage();
                img.src = this.images[this.currentIndex].src;
            });
            
            // Botão de navegação próxima
            const nextBtn = document.createElement('button');
            nextBtn.className = 'modal-nav modal-next';
            nextBtn.innerHTML = '&rarr;';
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.nextImage();
                img.src = this.images[this.currentIndex].src;
            });
            
            modal.appendChild(img);
            modal.appendChild(prevBtn);
            modal.appendChild(nextBtn);
            modal.appendChild(closeBtn);
            
            // Fecha o modal ao clicar fora da imagem
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
            
            document.body.appendChild(modal);
        }
}